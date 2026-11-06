import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm
const DURATION_REGEX = /^[1-9]\d*$/; // menit, bilangan bulat > 0

const REQUIRED_MESSAGES = {
  examId: "Ujian tidak valid",
  kelas: "Pilih kelas",
  tanggalUjian: "Pilih tanggal ujian",
  mulai: "Tentukan waktu mulai",
  selesai: "Tentukan waktu selesai",
  durasi: "Pilih durasi",
} as const;

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

export const isScheduleConfigured = (exam: ExamSchedule) =>
  Boolean(
    exam.kelas ||
    exam.tanggalUjian ||
    exam.mulai ||
    exam.selesai ||
    exam.durasi,
  );

type RequiredField = keyof typeof REQUIRED_MESSAGES;

export const examScheduleSchema = z.object({
  examId: z.string().trim(),
  kelas: z.string().trim(),
  tanggalUjian: z.date().optional(), // optional supaya row kosong tidak gagal di tahap tipe
  mulai: z.string().trim(),
  selesai: z.string().trim(),
  durasi: z.string().trim(),
});

export type ExamSchedule = z.infer<typeof examScheduleSchema>;

export const sendExamToStudentSchema = z
  .object({
    exams: z.array(examScheduleSchema),
  })
  .superRefine((data, ctx) => {
    let selectedCount = 0;

    data.exams.forEach((exam, index) => {
      // Row belum digunakan → abaikan
      if (!isScheduleConfigured(exam)) return;

      selectedCount++;

      const addError = (field: keyof ExamSchedule, message: string) =>
        ctx.addIssue({
          code: "custom",
          path: ["exams", index, field],
          message,
        });

      // Field wajib untuk row yang dipakai
      (Object.keys(REQUIRED_MESSAGES) as RequiredField[]).forEach((field) => {
        if (!exam[field]) addError(field, REQUIRED_MESSAGES[field]);
      });

      // Jika tanggal yang sudah lewat
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (exam.tanggalUjian && exam.tanggalUjian < today) {
        addError("tanggalUjian", "Tanggal ujian tidak boleh sebelum hari ini");
      }

      // Format
      const validStart = TIME_REGEX.test(exam.mulai);
      const validEnd = TIME_REGEX.test(exam.selesai);
      const validDuration = DURATION_REGEX.test(exam.durasi);

      if (exam.mulai && !validStart) {
        addError("mulai", "Format waktu tidak valid (HH:mm)");
      }
      if (exam.selesai && !validEnd) {
        addError("selesai", "Format waktu tidak valid (HH:mm)");
      }
      if (exam.durasi && !validDuration) {
        addError("durasi", "Durasi harus berupa angka menit lebih dari 0");
      }

      // Logika waktu (hanya jika kedua jam valid)
      if (validStart && validEnd) {
        const window = toMinutes(exam.selesai) - toMinutes(exam.mulai);

        if (window <= 0) {
          addError(
            "selesai",
            "Waktu selesai harus lebih besar dari waktu mulai",
          );
        } else if (validDuration && Number(exam.durasi) > window) {
          addError("durasi", "Durasi melebihi rentang waktu mulai–selesai");
        }
      }
    });

    // Minimal satu ujian harus dipilih
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
