"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputDataLoginUseGoogle,
  inputDataLoginUseGoogleSchema,
} from "@/src/schemas/student/updateDataStudent";
import { DataStudent } from "@/src/types/dataUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const idClass = [
  {
    id: 4,
    name: "1A",
  },
  {
    id: 5,
    name: "2B",
  },
  {
    id: 8,
    name: "2C",
  },
  {
    id: 1,
    name: "3A",
  },
  {
    id: 6,
    name: "4E",
  },
  {
    id: 7,
    name: "5A",
  },
] as const;

export default function DialogFormAddDataUser({
  dataStudent,
}: {
  dataStudent: DataStudent;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(
    dataStudent.type_account === "google" &&
      (!dataStudent.class ||
        dataStudent.class === "not filled" ||
        !dataStudent.nis ||
        !dataStudent.no_tlp),
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputDataLoginUseGoogle>({
    resolver: zodResolver(inputDataLoginUseGoogleSchema),
    defaultValues: {
      kelas: idClass.find((item) => item.name === dataStudent.class)?.name,
      noTlp: dataStudent.no_tlp,
      nis: dataStudent.nis,
    },
  });

  const onSubmit = async (data: InputDataLoginUseGoogle) => {
    const filterClassId = idClass.find((fill) => fill.name === data.kelas);
    if (!filterClassId) {
      toast.error("Gagal", {
        description: "Kelas yang dipilih tidak valid",
      });
      return;
    }

    const dataPayload = {
      kelas: filterClassId.id,
      noTlp: data.noTlp,
      nis: data.nis,
    };

    try {
      const request = await fetch("/api/student/PATCH/updateData", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idStudent: dataStudent.id_student,
          fieldInput: dataPayload,
        }),
      });

      const response = await request.json();

      if (!response.success) {
        toast.error("Gagal", {
          description: response.message,
        });
        return;
      }

      toast.success("Berhasil", {
        description: response.message,
      });
      setIsOpen(false);
      router.refresh();
    } catch {
      toast.error("Gagal", {
        description: "Error fetch api",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Terindikasi Login Menggunakan Google</DialogTitle>
            <DialogDescription>
              Sistem mendeteksi bahwa Anda login menggunakan Google. maka dari
              itu anda harus menambahkan kelas, NIS, dan No Hp pada akun anda
              ini untuk bisa menggunakan sistem ini.
            </DialogDescription>
            <div>
              <label htmlFor="classes" className="mb-2 block">
                Kelas
              </label>
              <Controller
                control={control}
                name="kelas"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="classes"
                      className="w-full border-slate-200 bg-slate-50 px-4 shadow-none text-sm transition-all focus:border-blue-500 focus:ring-blue-500"
                    >
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1A">1A</SelectItem>
                        <SelectItem value="2B">2B</SelectItem>
                        <SelectItem value="3A">3A</SelectItem>
                        <SelectItem value="4E">4E</SelectItem>
                        <SelectItem value="5A">5A</SelectItem>
                        <SelectItem value="2C">2C</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.kelas && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.kelas.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="nis" className="mb-2 block">
                NIS
              </label>
              <Input
                {...register("nis")}
                type="text"
                id="nis"
                name="nis"
                inputMode="numeric"
                aria-invalid={Boolean(errors.nis)}
              />
              {errors.nis && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.nis.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="noHp" className="mb-2 block">
                No Hp
              </label>
              <Input
                {...register("noTlp")}
                type="tel"
                id="noHp"
                name="noTlp"
                inputMode="numeric"
                aria-invalid={Boolean(errors.noTlp)}
              />
              {errors.noTlp && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.noTlp.message}
                </p>
              )}
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Konfirmasi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
