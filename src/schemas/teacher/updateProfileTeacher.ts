import { z } from "zod";

export const InputUpdateDataTeacherSchema = z
  .object({
    teachRole: z.string().trim().optional(),
    password: z.string().optional(),
    noTlp: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.teachRole !== undefined ||
      data.password !== undefined ||
      data.noTlp !== undefined,
    {
      message: "Minimal satu field harus diisi",
    },
  );

export type InputUpdateDataTeacher = z.infer<
  typeof InputUpdateDataTeacherSchema
>;
