"use client";
import PaginationUi from "@/components/global/pagination/content";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_SIZE } from "@/src/lib/constants";
import { fromDateString, toDateString } from "@/src/lib/utils/date";
import {
  isScheduleConfigured,
  sendExamToStudentSchema,
  SendExamToStudentSchemaType,
} from "@/src/schemas/manageDataExam";
import { DataTeacher } from "@/src/types/dataUser";
import { ManageExamItem } from "@/src/types/teacher/dataExam";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ChevronDownIcon,
  ClipboardList,
  PenLine,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ManagedExamsProps = {
  dataTeacher: DataTeacher;
  dataManageExams: ManageExamItem[];
  totalData: number;
};

const classIdMapping: Record<string, number> = {
  "1A": 4,
  "2B": 5,
  "2C": 8,
  "3A": 1,
  "4E": 6,
  "5A": 7,
};

type ActionsExam = {
  id_manage_exam: string;
  name_exam: string;
};

export default function ManageExams({
  dataTeacher,
  dataManageExams,
  totalData,
}: ManagedExamsProps) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SendExamToStudentSchemaType>({
    resolver: zodResolver(sendExamToStudentSchema),
    defaultValues: {
      exams: [],
    },
  });

  const filterByManageExams = dataManageExams.filter(
    (exam) => !exam.is_manage_exam,
  );

  useEffect(() => {
    if (dataManageExams.length === 0) return;

    dataManageExams.forEach((item, i) => {
      setValue(`exams.${i}.id_subject`, item.id_subject);
    });
  }, [dataManageExams, setValue]);

  const totalPages = Math.ceil(totalData / PAGE_SIZE);
  const [selectedExam, setSelectedExam] = useState<ActionsExam | null>(null);
  const [openDialog, setOpenDialog] = useState({
    sendExam: false,
    deleteExam: false,
  });

  async function onSubmit(data: SendExamToStudentSchemaType) {
    const dataExams = data.exams
      .map((exam, formIndex) => ({
        exam,
        formIndex,
      }))
      .filter(({ exam }) => isScheduleConfigured(exam))
      .map(({ exam, formIndex }) => ({
        exam: {
          ...exam,
          class_id: classIdMapping[exam.class_id ?? ""] ?? 2,
        },
        formIndex,
      }));

    const exams = dataExams.map(({ exam }) => exam);

    const payload = {
      teacherId: dataTeacher.id_teacher,
      exams,
    };

    try {
      const req = await fetch("/api/teacher/sendDataExam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await req.json();

      if (!res.success) {
        toast.error("Error", {
          description: res.message,
        });
        return;
      }

      setOpenDialog((prev) => ({
        ...prev,
        sendExam: false,
      }));
      toast.success("Berhasil", {
        description: res.message,
      });
    } catch {
      toast.error("Error", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  function getDataBeforeDelete(idManageExam: string, namaUjian: string) {
    setSelectedExam({
      id_manage_exam: idManageExam,
      name_exam: namaUjian,
    });
    setOpenDialog((prev) => ({
      ...prev,
      deleteExam: true,
    }));
  }

  async function handleDeleteExam(idManageExam: string | undefined) {
    if (!idManageExam) {
      toast.error("Gagal", {
        description: "Nama ujian tidak ditemukan.",
      });
      return;
    }

    try {
      const req = await fetch(`/api/teacher/deleteDataExam/${idManageExam}`, {
        method: "DELETE",
      });
      const res = await req.json();

      if (!res.success) {
        toast.error("Error", {
          description: res.message,
        });
        return;
      }

      setOpenDialog((prev) => ({
        ...prev,
        deleteExam: false,
      }));

      toast.success("Berhasil", {
        description: res.message,
      });
    } catch {
      toast.error("Gagal", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Exam Management
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Daftar Soal Ujian
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Atur kelas tujuan, jadwal, durasi, dan kelola soal ujian yang
              telah dibuat.
            </p>
          </div>

          <div className="text-sm font-semibold text-blue-600 space-x-2">
            <span className="size-2 rounded-full bg-green-500 inline-block" />
            <span>{dataManageExams.length} Ujian</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        id="form-send-exam"
      >
        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-14 font-semibold text-slate-600">
                  No
                </TableHead>

                <TableHead className="min-w-55 font-semibold text-slate-600">
                  Ujian
                </TableHead>

                <TableHead className="min-w-32.5 font-semibold text-slate-600">
                  Kirim Ke
                </TableHead>

                <TableHead className="min-w-62.5 font-semibold text-slate-600">
                  Jadwal Ujian
                </TableHead>

                <TableHead className="min-w-32.5 font-semibold text-slate-600">
                  Durasi
                </TableHead>

                <TableHead className="min-w-20 text-center font-semibold text-slate-600">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataManageExams.length > 0 ? (
                dataManageExams.map((data, i: number) => (
                  <TableRow
                    key={i}
                    className="align-top transition-colors hover:bg-slate-50"
                  >
                    {/* Number */}
                    <TableCell className="pt-5 font-semibold text-slate-400">
                      {String(i + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Exam */}
                    <TableCell className="pt-5 max-w-60">
                      <div>
                        <p className="font-bold text-slate-900 truncate">
                          {data.name_exam}
                        </p>

                        <span className="mt-1.5 inline-flex rounded-full text-[11px] font-semibold text-blue-600">
                          {data.type_exam === "PG" ? "Pilihan Ganda" : "Essay"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Target Class */}
                    <TableCell className="pt-5">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Kelas
                      </label>

                      <Controller
                        control={control}
                        name={`exams.${i}.class_id`}
                        render={({ field, fieldState }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none">
                              <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>

                            {fieldState.error && (
                              <p className="mt-0.5 text-xs text-red-500">
                                {fieldState.error.message}
                              </p>
                            )}

                            <SelectContent className="rounded-xl bg-white">
                              <SelectItem value="1A">1A</SelectItem>
                              <SelectItem value="2B">2B</SelectItem>
                              <SelectItem value="3A">3A</SelectItem>
                              <SelectItem value="4E">4E</SelectItem>
                              <SelectItem value="5A">5A</SelectItem>
                              <SelectItem value="2C">2C</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    {/* Schedule */}
                    <TableCell className="pt-5">
                      <div className="space-y-3">
                        {/* Date */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Tanggal
                          </label>

                          <Controller
                            control={control}
                            name={`exams.${i}.exam_date`}
                            render={({ field, fieldState }) => {
                              const selectedDate = fromDateString(field.value);

                              return (
                                <div className="space-y-1">
                                  <Popover>
                                    <PopoverTrigger className="h-10 border w-full flex items-center justify-between rounded-lg border-slate-300 px-3 font-medium text-slate-700">
                                      <span>
                                        {selectedDate
                                          ? selectedDate.toLocaleDateString(
                                              "id-ID",
                                              {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                              },
                                            )
                                          : "Pilih Tanggal"}
                                      </span>
                                      <ChevronDownIcon className="size-5 text-slate-400" />
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto overflow-hidden rounded-xl p-0">
                                      <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        defaultMonth={selectedDate}
                                        captionLayout="dropdown"
                                        onSelect={(date) =>
                                          field.onChange(
                                            date
                                              ? toDateString(date)
                                              : undefined,
                                          )
                                        }
                                        disabled={(date) =>
                                          date <
                                          new Date(
                                            new Date().setHours(0, 0, 0, 0),
                                          )
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  {fieldState.error && (
                                    <p className="mt-0.5 text-xs text-red-500">
                                      {fieldState.error.message}
                                    </p>
                                  )}
                                </div>
                              );
                            }}
                          />
                        </div>

                        {/* Time */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Mulai
                            </label>

                            <Input
                              type="time"
                              {...register(`exams.${i}.exam_start_at`)}
                              className="h-10 rounded-xl border-slate-200 px-3"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Selesai
                            </label>

                            <Input
                              type="time"
                              {...register(`exams.${i}.exam_end_at`)}
                              className="h-10 rounded-xl border-slate-200 px-3"
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="pt-5">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Durasi
                      </label>

                      <Controller
                        control={control}
                        name={`exams.${i}.exam_duration`}
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none">
                                <SelectValue placeholder="Tentukan durasi" />
                              </SelectTrigger>

                              <SelectContent className="rounded-xl bg-white">
                                <SelectItem value={10}>10 Menit</SelectItem>
                                <SelectItem value={15}>15 Menit</SelectItem>
                                <SelectItem value={20}>20 Menit</SelectItem>
                                <SelectItem value={25}>25 Menit</SelectItem>
                                <SelectItem value={30}>30 Menit</SelectItem>
                                <SelectItem value={40}>40 Menit</SelectItem>
                                <SelectItem value={45}>45 Menit</SelectItem>
                                <SelectItem value={50}>50 Menit</SelectItem>
                                <SelectItem value={60}>60 Menit</SelectItem>
                              </SelectContent>
                            </Select>

                            {fieldState.error && (
                              <p className="mt-0.5 text-xs text-red-500">
                                {fieldState.error.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pt-5">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/Teacher/dashboard/manageExams/${data.id_manage_exam}`}
                          className="inline-flex h-7 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          <PenLine className="size-4" />
                        </Link>

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() =>
                            getDataBeforeDelete(
                              data.id_manage_exam,
                              data.name_exam,
                            )
                          }
                          className="h-7"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="size-9 text-slate-300" />

                      <p className="mt-3 font-semibold text-slate-500">
                        Belum Ada Soal Ujian
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Soal ujian yang dibuat akan muncul di sini.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ================= DIALOG ================= */}
        <Dialog
          open={openDialog.deleteExam}
          onOpenChange={(open) =>
            setOpenDialog((prev) => ({
              ...prev,
              deleteExam: open,
            }))
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Soal Ujian</DialogTitle>

              <DialogDescription>
                Apakah Anda yakin ingin menghapus ujian{" "}
                <span className="font-bold text-slate-900">
                  &quot;{selectedExam?.name_exam}&quot;
                </span>
                ?
                <span className="mt-2 block">
                  Tindakan ini tidak dapat dibatalkan.
                </span>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="space-x-1">
              <DialogClose>Batal</DialogClose>

              <Button
                variant="destructive"
                onClick={() => handleDeleteExam(selectedExam?.id_manage_exam)}
              >
                Hapus Ujian
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="border-t border-slate-200" />

        <PaginationUi
          currentPage={page}
          totalPage={totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
        {/* ================= SEND NOTE + ACTION ================= */}
        <div className="flex flex-col gap-5 px-5 pb-5 sm:px-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 md:max-w-2xl">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />

            <p className="text-sm leading-6 text-amber-700">
              Jika hanya ingin mengirim sebagian soal, isi pengaturan hanya pada
              soal yang ingin dikirim dan biarkan bagian lainnya kosong.
            </p>
          </div>

          <Dialog
            open={openDialog.sendExam}
            onOpenChange={(open) =>
              setOpenDialog((prev) => ({
                ...prev,
                sendExam: open,
              }))
            }
          >
            <DialogTrigger className="w-full rounded-md bg-blue-500 px-7 font-semibold hover:bg-blue-500/80 text-slate-100 md:w-auto py-1.5">
              Kirim Soal
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Pengiriman</DialogTitle>

                <DialogDescription>
                  Apakah Anda yakin ingin mengirimkan soal yang sudah
                  dikonfigurasi kepada siswa?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="space-x-1">
                <DialogClose>Batal</DialogClose>

                <Button
                  variant="default"
                  form="form-send-exam"
                  type="submit"
                  className="rounded-md bg-blue-600 hover:bg-blue-700"
                >
                  Ya, Kirim Soal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
}
