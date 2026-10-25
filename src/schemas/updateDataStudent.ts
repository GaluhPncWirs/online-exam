import { z } from "zod";

// Update data student schema
export const inputUpdateDataSchema = z
  .object({
    name: z.string().trim().optional(),

    password: z.string().optional(),

    noTlp: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.password !== undefined ||
      data.noTlp !== undefined,
    {
      message: "Minimal satu field harus diisi",
    },
  );

export type InputUpdateData = z.infer<typeof inputUpdateDataSchema>;
