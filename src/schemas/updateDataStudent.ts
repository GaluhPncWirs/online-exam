import { z } from "zod";

// Update data student schema
export const inputUpdateDataSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter")
      .optional(),

    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter")
      .optional(),

    noTlp: z
      .string()
      .trim()
      .regex(/^\d{11,14}$/, "No telepon harus terdiri dari 11-14 digit")
      .optional(),
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
