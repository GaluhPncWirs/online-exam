import { z } from "zod";

// Update data student schema
export const inputUpdateDataSchema = z.object({
  resetPassword: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export type InputUpdateData = z.infer<typeof inputUpdateDataSchema>;
