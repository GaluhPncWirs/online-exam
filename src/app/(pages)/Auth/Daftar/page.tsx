"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FloatingLabel from "@/components/global/floatingLabel/content";
import {
  AtSign,
  KeyRound,
  Loader2,
  Repeat,
  School,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormAuth from "@/src/layout/formAuth/content";
import { InputRegister, inputRegisterSchema } from "@/src/schemas/auth";

export default function RegisterAccount() {
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputRegister>({
    resolver: zodResolver(inputRegisterSchema),
  });

  async function onSubmit(data: InputRegister) {
    const dataRegister = {
      fullName: data.nama,
      classes: data.kelas,
      email: data.email,
      password: data.password,
    };

    try {
      const req = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRegister),
      });

      const res = await req.json();

      if (!res.success) {
        toast.error("Gagal", {
          description: res.message,
        });
        return;
      }

      push("/Auth/Login");

      toast.success("Berhasil", {
        description: res.message,
      });
    } catch {
      toast.error("Gagal", {
        description: "Error fetch api",
      });
    }
  }

  return (
    <FormAuth formTitle={"Buat Akun"}>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* nama */}
        <FloatingLabel
          type="text"
          id="nama"
          label="Nama"
          register={register("nama")}
          error={errors.nama}
          placeholder=" "
          Icon={UserRound}
        />

        {/* kelas */}
        <FloatingLabel
          type="text"
          id="kelas"
          label="Kelas"
          register={register("kelas")}
          error={errors.kelas}
          placeholder=" "
          Icon={School}
        />

        {/* email */}
        <FloatingLabel
          type="email"
          id="email"
          label="Email"
          register={register("email")}
          error={errors.email}
          placeholder=" "
          Icon={AtSign}
        />

        {/* password */}
        <FloatingLabel
          type="password"
          id="password"
          register={register("password")}
          error={errors.password}
          label="Password"
          placeholder=" "
          Icon={KeyRound}
        />

        {/* repeat password */}
        <FloatingLabel
          type="password"
          id="ulangiPassword"
          register={register("ulangiPassword")}
          error={errors.ulangiPassword}
          label="Ulangi Password"
          placeholder=" "
          Icon={Repeat}
        />

        {/* register button */}

        <Button
          variant="outline"
          type="submit"
          className="bg-blue-400 rounded-md h-10 mt-3 text-slate-50 tracking-wide font-semibold cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Buat Akun"
          )}
        </Button>
      </form>
    </FormAuth>
  );
}
