import { z } from "zod";

const CHOICE_KEYS = [
  "choice_a",
  "choice_b",
  "choice_c",
  "choice_d",
  "choice_e",
] as const;

export const ExamQuestionInput = z.object({
  questions: z
    .string()
    .trim()
    .min(5, "Minimal 5 karakter")
    .max(200, "Maksimal 200 karakter"),
  multipleChoice: z
    .object({
      choice_a: z.string().trim(),
      choice_b: z.string().trim(),
      choice_c: z.string().trim(),
      choice_d: z.string().trim(),
      choice_e: z.string().trim(),
    })
    .optional(),
  correctAnswer: z.string().trim().optional(),
});

// export const ExamQuestion = ExamQuestionInput.extend({
//   id: z.string().trim().min(1),
// });

export type ExamQuestionInputType = z.infer<typeof ExamQuestionInput>;
// export type ExamQuestionType = z.infer<typeof ExamQuestion>;

export function validateMultipleChoice(
  q: z.infer<typeof ExamQuestionInput>,
  ctx: z.RefinementCtx,
  basePath: (string | number)[] = [],
) {
  const pilihan = q.multipleChoice;

  if (!pilihan) {
    ctx.addIssue({
      code: "custom",
      path: [...basePath, "multipleChoice"],
      message: "Semua opsi jawaban harus diisi",
    });
    return;
  }

  const values = CHOICE_KEYS.map((key) => pilihan[key]);

  CHOICE_KEYS.forEach((key, i) => {
    const value = pilihan[key];

    if (value.length < 1) {
      ctx.addIssue({
        code: "custom",
        path: [...basePath, "multipleChoice", key],
        message: "Minimal 1 karakter",
      });
    } else if (values.indexOf(value) !== i) {
      // sudah muncul di opsi sebelumnya
      ctx.addIssue({
        code: "custom",
        path: [...basePath, "multipleChoice", key],
        message: "Isi opsi tidak boleh sama dengan opsi lain",
      });
    }
  });

  if (!q.correctAnswer) {
    ctx.addIssue({
      code: "custom",
      path: [...basePath, "correctAnswer"],
      message: "Pilih jawaban yang benar",
    });
  } else if (!values.includes(q.correctAnswer)) {
    ctx.addIssue({
      code: "custom",
      path: [...basePath, "correctAnswer"],
      message: "Jawaban benar harus sesuai dengan salah satu opsi",
    });
  }
}

export const ExamSchema = z
  .object({
    id_teacher: z.string().min(1).max(50),
    name_exam: z.string().trim().min(3).max(150),
    type_exam: z.enum(["PG", "ESSAY"]),
    exam_questions: z.array(ExamQuestionInput).min(1).max(200),
  })
  .superRefine((data, ctx) => {
    if (data.type_exam !== "PG") return;

    data.exam_questions.forEach((q, i) => {
      validateMultipleChoice(q, ctx, ["exam_questions", i]);
    });
  });

export const createExamSchema = z
  .object({
    id_subject: z.string().trim().min(1, "Harus ada id ujian"),
    type_exam: z.enum(["PG", "ESSAY"], {
      error: "Pilih salah satu",
    }),
    name_exam: z.string().trim().min(1, "Pilih salah satu"),
    new_name_exam: z.string().trim().optional(),
    ...ExamQuestionInput.shape,
  })
  .superRefine((data, ctx) => {
    if (data.name_exam === "buatUjianBaru") {
      const name = data.new_name_exam ?? "";

      if (name === "") {
        ctx.addIssue({
          code: "custom",
          path: ["new_name_exam"],
          message: "Nama ujian baru harus diisi",
        });
      } else if (name.length < 5) {
        ctx.addIssue({
          code: "custom",
          path: ["new_name_exam"],
          message: "Minimal 5 karakter",
        });
      }
    }

    if (data.type_exam === "PG") {
      validateMultipleChoice(data, ctx);
    }
  });

export type CreateExamSchemaType = z.infer<typeof createExamSchema>;
