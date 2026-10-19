import { z } from "zod";

// login schema
export const inputLoginSchema = z.object({
  typeAccount: z.enum(["siswa", "guru"], {
    error: "Pilih salah satunya",
  }),
  email: z.email().min(5, "Minimal 5 karakter"),
  password: z.string().trim().min(1, "Password tidak boleh kosong"),
});

export type InputLogin = z.infer<typeof inputLoginSchema>;

// register schema
export const inputRegisterSchema = z
  .object({
    nama: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    kelas: z.string().trim().min(1, "Kelas tidak boleh kosong"),
    email: z.email().min(5, "Minimal 5 karakter"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter"),
    ulangiPassword: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.ulangiPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ulangiPassword"],
        message: "Passwordnya harus sama dengan password sebelumnya",
      });
    }

    const passwordLower = data.password.toLowerCase();
    if (
      passwordLower === data.email.toLowerCase() ||
      passwordLower === data.nama.toLowerCase()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password tidak boleh sama dengan nama atau email",
      });
    }
  });

export type InputRegister = z.infer<typeof inputRegisterSchema>;
