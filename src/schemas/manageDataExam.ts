import { z } from "zod";
import { todayWIB } from "../lib/utils/convertDate";

const WIB_OFFSET = "+07:00";
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const MAX_DURATION = 480; // menit
const MAX_ADVANCE_DAYS = 90;

const REQUIRED_MESSAGES = {
  class_id: "Pilih kelas",
  exam_date: "Pilih tanggal ujian",
  exam_start_at: "Tentukan waktu mulai",
  exam_end_at: "Tentukan waktu selesai",
  exam_duration: "Pilih durasi",
} as const;

const REQUIRED_MESSAGES_API = {
  id_subject: "Ujian tidak valid",
  class_id: "Pilih kelas",
  exam_date: "Pilih tanggal ujian",
  exam_start_at: "Tentukan waktu mulai",
  exam_end_at: "Tentukan waktu selesai",
  exam_duration: "Pilih durasi",
} as const;

type RequiredField = keyof typeof REQUIRED_MESSAGES;

/** "YYYY-MM-DD" + "HH:mm" (WIB) → Date. Null jika tidak valid. */
export const toDateTime = (date: string, time: string): Date | null => {
  if (!DATE_REGEX.test(date) || !TIME_REGEX.test(time)) return null;
  const d = new Date(`${date}T${time}:00${WIB_OFFSET}`);
  if (Number.isNaN(d.getTime())) return null;
  // Tolak tanggal yang "meluber", misalnya 2026-02-31
  const backToWIB = new Date(d.getTime() + 7 * 3_600_000)
    .toISOString()
    .slice(0, 10);
  return backToWIB === date ? d : null;
};

type TimingField =
  | "exam_date"
  | "exam_start_at"
  | "exam_end_at"
  | "exam_duration";
type TimingResult = {
  issues: { field: TimingField; message: string }[];
  start: Date | null;
  end: Date | null;
};

/** Satu-satunya tempat aturan waktu didefinisikan (dipakai form dan API). */
export const checkTiming = (
  date: string,
  startTime: string,
  endTime: string,
  duration?: number | null,
): TimingResult => {
  const issues: TimingResult["issues"] = [];
  const add = (field: TimingField, message: string) =>
    issues.push({ field, message });

  const startFmtOk = TIME_REGEX.test(startTime);
  const endFmtOk = TIME_REGEX.test(endTime);
  if (!startFmtOk) add("exam_start_at", "Format waktu tidak valid (HH:mm)");
  if (!endFmtOk) add("exam_end_at", "Format waktu tidak valid (HH:mm)");

  const durationOk =
    duration == null ||
    (Number.isInteger(duration) && duration >= 1 && duration <= MAX_DURATION);
  if (!durationOk) add("exam_duration", `Durasi harus 1-${MAX_DURATION} menit`);

  if (!startFmtOk || !endFmtOk) return { issues, start: null, end: null };

  const start = toDateTime(date, startTime);
  const end = toDateTime(date, endTime);
  if (!start || !end) {
    add("exam_date", "Tanggal tidak valid");
    return { issues, start: null, end: null };
  }

  if (date < todayWIB()) {
    add("exam_date", "Tanggal ujian tidak boleh sebelum hari ini");
  } else if (start <= new Date()) {
    add("exam_start_at", "Waktu mulai sudah lewat");
  } else if (start.getTime() - Date.now() > MAX_ADVANCE_DAYS * 86_400_000) {
    add(
      "exam_date",
      `Ujian maksimal dijadwalkan ${MAX_ADVANCE_DAYS} hari ke depan`,
    );
  }

  const windowMinutes = (end.getTime() - start.getTime()) / 60_000;
  if (windowMinutes <= 0) {
    add("exam_end_at", "Waktu selesai harus lebih besar dari waktu mulai");
  } else if (duration && durationOk && duration > windowMinutes) {
    add("exam_duration", "Durasi melebihi rentang waktu mulai-selesai");
  }

  return { issues, start, end };
};

/* ---------- Schema form (longgar, per baris) ---------- */

const examRowSchema = z.object({
  class_id: z.string().min(1, "Pilih salah satu"),
  exam_date: z.string().nullish(), // "YYYY-MM-DD"
  exam_start_at: z.string().nullish(), // "HH:mm"
  exam_end_at: z.string().nullish(), // "HH:mm"
  exam_duration: z.number().int().nullish(), // menit
});

export type ExamRowInput = z.infer<typeof examRowSchema>;

export const isScheduleConfigured = (exam: ExamRowInput) =>
  Boolean(
    exam.class_id ||
    exam.exam_date ||
    exam.exam_start_at ||
    exam.exam_end_at ||
    exam.exam_duration,
  );

export const sendExamToStudentSchema = z
  .object({ exams: z.array(examRowSchema) })
  .superRefine((data, ctx) => {
    const scheduled: {
      index: number;
      classId: string;
      start: Date;
      end: Date;
    }[] = [];
    let selectedCount = 0;

    data.exams.forEach((exam, index) => {
      if (!isScheduleConfigured(exam)) return; // baris belum dipakai
      selectedCount++;

      const addError = (field: keyof ExamRowInput, message: string) =>
        ctx.addIssue({
          code: "custom",
          path: ["exams", index, field],
          message,
        });

      // 1. Field wajib
      (Object.keys(REQUIRED_MESSAGES) as RequiredField[]).forEach((field) => {
        if (!exam[field]) addError(field, REQUIRED_MESSAGES[field]);
      });

      // 2. Aturan waktu, hanya jika tanggal, mulai, dan selesai sudah terisi
      if (!exam.exam_date || !exam.exam_start_at || !exam.exam_end_at) return;

      const { issues, start, end } = checkTiming(
        exam.exam_date,
        exam.exam_start_at,
        exam.exam_end_at,
        exam.exam_duration,
      );
      issues.forEach((i) => addError(i.field, i.message));

      if (exam.class_id && start && end && issues.length === 0) {
        scheduled.push({ index, classId: exam.class_id, start, end });
      }
    });

    // 3. Bentrok antar baris dalam satu pengiriman (kelas sama + jendela overlap)
    scheduled.forEach((a, i) => {
      const clash = scheduled
        .slice(0, i)
        .find(
          (b) => b.classId === a.classId && a.start < b.end && a.end > b.start,
        );
      if (clash) {
        ctx.addIssue({
          code: "custom",
          path: ["exams", a.index, "exam_start_at"],
          message: `Bentrok dengan jadwal pada baris ${clash.index + 1}`,
        });
      }
    });

    // 4. Minimal satu ujian
    if (selectedCount === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["exams"],
        message: "Pilih minimal satu ujian",
      });
    }
  });

export type SendExamToStudentSchemaType = z.infer<
  typeof sendExamToStudentSchema
>;

/* ---------- Schema API (ketat, satu ujian) ---------- */

export const examScheduleSchema = z
  .object({
    id_subject: z.string().min(1, REQUIRED_MESSAGES_API.id_subject),
    class_id: z.number().int().positive(REQUIRED_MESSAGES_API.class_id),
    exam_date: z.string().min(1, REQUIRED_MESSAGES_API.exam_date),
    exam_start_at: z.string().min(1, REQUIRED_MESSAGES_API.exam_start_at),
    exam_end_at: z.string().min(1, REQUIRED_MESSAGES_API.exam_end_at),
    exam_duration: z.number().int().min(1, REQUIRED_MESSAGES_API.exam_duration),
  })
  .transform((v, ctx) => {
    const { issues, start, end } = checkTiming(
      v.exam_date,
      v.exam_start_at,
      v.exam_end_at,
      v.exam_duration,
    );
    issues.forEach((i) =>
      ctx.addIssue({ code: "custom", path: [i.field], message: i.message }),
    );
    if (issues.length > 0 || !start || !end) return z.NEVER;
    return { ...v, startAt: start, endAt: end }; // Date siap disimpan
  });

export type ExamScheduleParsed = z.output<typeof examScheduleSchema>;
