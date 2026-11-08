import { z } from "zod";
import { todayWIB } from "../lib/utils/convertDate";
import { addMinutes } from "date-fns";

const WIB_OFFSET = "+07:00"; // WIB tidak punya DST, offset-nya tetap
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const MAX_DURATION = 480; // menit

const REQUIRED_MESSAGES = {
  id_subject: "Ujian tidak valid",
  class_id: "Pilih kelas",
  exam_date: "Pilih tanggal ujian",
  exam_start_at: "Tentukan waktu mulai",
  exam_duration: "Pilih durasi",
} as const;

type RequiredField = keyof typeof REQUIRED_MESSAGES;

export const isScheduleConfigured = (exam: ExamScheduleInput) =>
  Boolean(
    exam.class_id || exam.exam_date || exam.exam_start_at || exam.exam_duration,
  );

export const toStartDateTime = (date: string, time: string): Date | null => {
  if (!DATE_REGEX.test(date) || !TIME_REGEX.test(time)) return null;
  const d = new Date(`${date}T${time}:00${WIB_OFFSET}`);
  if (Number.isNaN(d.getTime())) return null;
  // Tolak tanggal yang "meluber", misalnya 2026-02-31
  const backToWIB = new Date(d.getTime() + 7 * 3_600_000)
    .toISOString()
    .slice(0, 10);
  return backToWIB === date ? d : null;
};

const examScheduleSchema = z.object({
  id_subject: z.string().min(1, REQUIRED_MESSAGES.id_subject),
  class_id: z.number().int().positive().nullish(),
  exam_date: z.string().nullish(), // "YYYY-MM-DD"
  exam_start_at: z.string().nullish(), // "HH:mm"
  exam_duration: z.number().int().nullish(), // menit
});

export type ExamScheduleInput = z.infer<typeof examScheduleSchema>;

export const sendExamToStudentSchema = z
  .object({ exams: z.array(examScheduleSchema) })
  .superRefine((data, ctx) => {
    const scheduled: {
      index: number;
      classId: number;
      start: Date;
      end: Date;
    }[] = [];
    let selectedCount = 0;

    data.exams.forEach((exam, index) => {
      if (!isScheduleConfigured(exam)) return; // baris belum dipakai

      selectedCount++;

      const addError = (field: keyof ExamScheduleInput, message: string) =>
        ctx.addIssue({
          code: "custom",
          path: ["exams", index, field],
          message,
        });

      // 1. Field wajib
      (Object.keys(REQUIRED_MESSAGES) as RequiredField[]).forEach((field) => {
        if (!exam[field]) addError(field, REQUIRED_MESSAGES[field]);
      });

      // 2. Format dan batas
      if (exam.exam_start_at && !TIME_REGEX.test(exam.exam_start_at)) {
        addError("exam_start_at", "Format waktu tidak valid (HH:mm)");
      }

      const durationOk =
        !!exam.exam_duration &&
        exam.exam_duration >= 1 &&
        exam.exam_duration <= MAX_DURATION;
      if (exam.exam_duration && !durationOk) {
        addError("exam_duration", `Durasi harus 1–${MAX_DURATION} menit`);
      }

      // 3. Logika waktu (hanya jika tanggal dan jam sudah terisi)
      if (!exam.exam_date || !exam.exam_start_at) return;

      const start = toStartDateTime(exam.exam_date, exam.exam_start_at);
      if (!start) {
        // Kalau jamnya valid, berarti tanggalnya yang bermasalah
        if (TIME_REGEX.test(exam.exam_start_at)) {
          addError("exam_date", "Tanggal tidak valid");
        }
        return;
      }

      if (exam.exam_date < todayWIB()) {
        addError("exam_date", "Tanggal ujian tidak boleh sebelum hari ini");
      } else if (start <= new Date()) {
        addError("exam_start_at", "Waktu mulai sudah lewat");
      }

      if (exam.class_id && durationOk) {
        scheduled.push({
          index,
          classId: exam.class_id,
          start,
          end: addMinutes(start, exam.exam_duration!),
        });
      }
    });

    // 4. Bentrok antar baris dalam satu pengiriman (kelas sama + overlap)
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

    // 5. Minimal satu ujian
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

// export const sendExamToStudentSchema = z
//   .object({
//     exams: z.array(examScheduleSchema),
//   })
//   .superRefine((data, ctx) => {
//     let selectedCount = 0;

//     data.exams.forEach((exam, index) => {
//       // Row belum digunakan → abaikan
//       if (!isScheduleConfigured(exam)) return;

//       selectedCount++;

//       const addError = (field: keyof ExamScheduleInput, message: string) =>
//         ctx.addIssue({
//           code: "custom",
//           path: ["exams", index, field],
//           message,
//         });

//       // Field wajib untuk row yang dipakai
//       (Object.keys(REQUIRED_MESSAGES) as RequiredField[]).forEach((field) => {
//         if (!exam[field]) addError(field, REQUIRED_MESSAGES[field]);
//       });

//       // Jika tanggal yang sudah lewat
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       if (exam.exam_date && exam.exam_date < today) {
//         addError("exam_date", "Tanggal ujian tidak boleh sebelum hari ini");
//       }

//       // Format
//       const validStart = TIME_REGEX.test(exam.exam_start_at);
//       const validEnd = TIME_REGEX.test(exam.selesai);
//       const validDuration = DURATION_REGEX.test(exam.durasi);

//       if (exam.exam_start_at && !validStart) {
//         addError("mulai", "Format waktu tidak valid (HH:mm)");
//       }
//       if (exam.selesai && !validEnd) {
//         addError("selesai", "Format waktu tidak valid (HH:mm)");
//       }
//       if (exam.durasi && !validDuration) {
//         addError("durasi", "Durasi harus berupa angka menit lebih dari 0");
//       }

//       // Logika waktu (hanya jika kedua jam valid)
//       if (validStart && validEnd) {
//         const window = toMinutes(exam.selesai) - toMinutes(exam.exam_start_at);

//         if (window <= 0) {
//           addError(
//             "selesai",
//             "Waktu selesai harus lebih besar dari waktu mulai",
//           );
//         } else if (validDuration && Number(exam.durasi) > window) {
//           addError("durasi", "Durasi melebihi rentang waktu mulai–selesai");
//         }
//       }
//     });

//     // Minimal satu ujian harus dipilih
//     if (selectedCount === 0) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["exams"],
//         message: "Pilih minimal satu ujian",
//       });
//     }
//   });

/* ---------- Schema API (ketat, satu ujian) ---------- */

export const examScheduleSchema = z
  .object({
    id_subject: z.string().min(1, REQUIRED_MESSAGES.id_subject),
    class_id: z.number().int().positive(REQUIRED_MESSAGES.class_id),
    exam_date: z.string().min(1, REQUIRED_MESSAGES.exam_date),
    exam_start_at: z
      .string()
      .regex(TIME_REGEX, "Format waktu tidak valid (HH:mm)"),
    exam_duration: z
      .number()
      .int()
      .min(1, REQUIRED_MESSAGES.exam_duration)
      .max(MAX_DURATION, `Durasi maksimal ${MAX_DURATION} menit`),
  })
  .transform((v, ctx) => {
    const startAt = toStartDateTime(v.exam_date, v.exam_start_at);
    if (!startAt) {
      ctx.addIssue({
        code: "custom",
        path: ["exam_date"],
        message: "Tanggal tidak valid",
      });
      return z.NEVER;
    }
    if (startAt <= new Date()) {
      ctx.addIssue({
        code: "custom",
        path: ["exam_start_at"],
        message: "Waktu mulai sudah lewat",
      });
      return z.NEVER;
    }
    return { ...v, startAt, endAt: addMinutes(startAt, v.exam_duration) };
  });

export type ExamScheduleParsed = z.output<typeof examScheduleSchema>;
