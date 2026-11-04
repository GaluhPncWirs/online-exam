import { z } from "zod";

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
        answer_a: z.string(),
        answer_b: z.string(),
        answer_c: z.string(),
        answer_d: z.string(),
        answer_e: z.string(),
      })
      .optional(),

    jawabanYangBenar: z.string().optional(),
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
          ["answer_a", pilihan.answer_a],
          ["answer_b", pilihan.answer_b],
          ["answer_c", pilihan.answer_c],
          ["answer_d", pilihan.answer_d],
          ["answer_e", pilihan.answer_e],
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

      if (!data.jawabanYangBenar || data.jawabanYangBenar.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jawabanYangBenar"],
          message: "Pilih jawaban yang benar",
        });
      }
    }
  });

export type CreateExamSchemaType = z.infer<typeof createExamSchema>;
