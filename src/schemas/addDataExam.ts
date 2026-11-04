import { z } from "zod";

export const ExamSchema = z.object({
  id_teacher: z.string().min(1).max(50),
  name_exam: z.string().trim().min(3).max(150),
  type_exam: z.enum(["PG", "ESSAY"]),
  exam_questions: z.array(z.unknown()).min(1).max(200),
});

export const createExamSchema = z
  .object({
    typeUjian: z.enum(["PG", "ESSAY"], {
      error: "Pilih salah satu",
    }),

    namaUjian: z.string().min(1, "Pilih salah satu"),

    namaUjianBaru: z
      .string()
      .min(5, "Minimal 5 karakter")
      .optional()
      .or(z.literal("")),

    pertanyaan: z.string().min(5, "Minimal 5 karakter"),

    pilihanGanda: z
      .object({
        choice_a: z.string(),
        choice_b: z.string(),
        choice_c: z.string(),
        choice_d: z.string(),
        choice_e: z.string(),
      })
      .optional(),

    correctAnswer: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.namaUjian === "buatUjianBaru" &&
      (!data.namaUjianBaru || data.namaUjianBaru.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["namaUjianBaru"],
        message: "Nama ujian baru harus diisi",
      });
    }

    if (!data.pertanyaan || data.pertanyaan.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pertanyaan"],
        message: "Pertanyaan harus diisi",
      });
    }

    if (data.typeUjian === "PG") {
      const pilihan = data.pilihanGanda;

      if (!pilihan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pilihanGanda"],
          message: "Semua opsi jawaban harus diisi",
        });
      } else {
        const opsi = [
          ["choice_a", pilihan.choice_a],
          ["choice_b", pilihan.choice_b],
          ["choice_c", pilihan.choice_c],
          ["choice_d", pilihan.choice_d],
          ["choice_e", pilihan.choice_e],
        ] as const;

        opsi.forEach(([field, value]) => {
          if (!value || value.trim().length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pilihanGanda", field],
              message: "Minimal 3 karakter",
            });
          }
        });
      }

      if (!data.correctAnswer || data.correctAnswer.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: "Pilih jawaban yang benar",
        });
      }
    }
  });

export type CreateExamSchemaType = z.infer<typeof createExamSchema>;
