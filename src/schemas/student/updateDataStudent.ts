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

export const inputDataLoginUseGoogleSchema = z.object({
  kelas: z.enum(["1A", "2B", "3A", "4E", "5A", "2C"]),
  noTlp: z.string().min(11, "Minimal 11 digit").max(13, "Maksimal 13 digit"),
  nis: z.string().length(5, "Harus 5 digit"),
});

export type InputDataLoginUseGoogle = z.infer<
  typeof inputDataLoginUseGoogleSchema
>;
