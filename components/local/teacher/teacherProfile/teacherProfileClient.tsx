"use client";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HamburgerMenu from "@/components/global/hamburgerMenu/content";
import ListSidebar from "@/components/global/listSidebar/content";
import { History } from "lucide-react";
import HeaderProfile from "@/src/layout/headerProfile/content";
import { DataTeacher } from "@/src/types/dataUser";
import { TeacherExamHistoryItem } from "@/src/types/teacher/dataExam";
import PaginationUi from "@/components/global/pagination/content";
import { formatDateToYYYYMMDD } from "@/src/lib/utils/convertDate";
import { useForm } from "react-hook-form";
import {
  InputUpdateDataTeacher,
  InputUpdateDataTeacherSchema,
} from "@/src/schemas/teacher/updateProfileTeacher";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_PAGE_SIZE } from "@/src/lib/constants";
import { getTeacherExamHistoryAction } from "@/src/actions/dataExamsTeacher";

type DataProfileTeacher = {
  dataTeacher: DataTeacher;
};

export default function ProfileTeacherClient({
  dataTeacher,
}: DataProfileTeacher) {
  const [dataHistoryExams, setDataHistoryExams] = useState<
    TeacherExamHistoryItem[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = Math.ceil(totalData / MAX_PAGE_SIZE);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputUpdateDataTeacher>({
    resolver: zodResolver(InputUpdateDataTeacherSchema),
    defaultValues: {
      teachRole: "",
      noTlp: "",
      password: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function getTeacherExamHistory() {
      setIsLoading(true);
      try {
        const result = await getTeacherExamHistoryAction(page);
        if (!isMounted) return;

        if (!result.success) {
          toast("Gagal ❌", {
            description: result.message,
          });
          return;
        }

        setDataHistoryExams(result.data);
        setTotalData(result.total);
      } catch (error) {
        console.error("Gagal mengambil riwayat ujian:", error);
        if (isMounted) {
          toast("Gagal ❌", {
            description: "Riwayat ujian gagal dimuat",
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    getTeacherExamHistory();

    return () => {
      isMounted = false;
    };
  }, [page]);

  function resultNilaiRataRata(hasil_ujian: (string | null)[]) {
    const hasilUjianValid = hasil_ujian.filter(
      (fil): fil is string => fil !== null,
    );
    const nilaiUjian = hasilUjianValid
      .filter((fil) => fil !== "pending" && fil !== "telat")
      .map(Number);
    const nilaiPending = hasilUjianValid.filter((fil) => fil === "pending");
    const nilaiTelat = hasilUjianValid.filter((fil) => fil === "telat");

    const nilaiYangPendingAtauTelat =
      nilaiPending.length > 0 || nilaiTelat.length > 0;

    const nilaiRataRata =
      nilaiUjian.length > 0
        ? Math.round(
            nilaiUjian.reduce((acc: number, cur: number) => acc + cur, 0) /
              nilaiUjian.length,
          )
        : 0;

    const getMessage = () => {
      if (nilaiPending.length > 0 && nilaiTelat.length > 0) {
        return `Ada ${nilaiTelat.length} siswa telat dan ${nilaiPending.length} belum dinilai`;
      }

      if (nilaiTelat.length > 0) {
        return `Ada ${nilaiTelat.length} Siswa Yang Telat Mengerjakan`;
      }

      return `Ada ${nilaiPending.length} siswa yang belum dinilai`;
    };

    if (nilaiYangPendingAtauTelat) {
      return (
        <Popover>
          <PopoverTrigger>
            <p>{nilaiRataRata}</p>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2">
            <p className="font-semibold text-xs">{getMessage()}</p>
          </PopoverContent>
        </Popover>
      );
    }
    return nilaiRataRata;
  }

  async function onSubmit(data: InputUpdateDataTeacher) {
    const dataPayload = {
      teachRole: data.teachRole,
      password: data.password,
      noTlp: data.noTlp,
    };

    const filteredPayload = Object.fromEntries(
      Object.entries(dataPayload).filter(
        ([_, value]) => value !== undefined && value !== "",
      ),
    );

    try {
      const request = await fetch("/api/teacher/PATCH/editProfileTeacher", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredPayload),
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
      return;
    } catch {
      toast.error("Gagal", {
        description: "Error fetch api",
      });
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-bold">Profil Guru</h2>
        <HamburgerMenu>
          <ListSidebar />
        </HamburgerMenu>
      </div>
      <div className="w-full h-0.5 bg-slate-700 rounded-lg" />

      <div className="mt-7 space-y-6">
        <HeaderProfile>
          {/* Identity */}
          <div className="flex-1 space-y-3">
            <h2 className="text-3xl font-bold capitalize">
              {dataTeacher?.fullname || ""}
            </h2>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-xs backdrop-blur-sm shadow-sm">
                NISN. {dataTeacher?.nisn || ""}
              </span>

              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-xs backdrop-blur-sm shadow-sm">
                {dataTeacher?.teach_role || ""}
              </span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger className="rounded-md text-sm border border-white/20 bg-white px-5 py-2 font-semibold text-blue-600 shadow-md hover:bg-blue-50">
              Edit Profil
            </DialogTrigger>

            <DialogContent className="rounded-2xl sm:max-w-lg">
              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                id="submit-edit-profile"
              >
                <DialogHeader>
                  <DialogTitle>Edit Profil</DialogTitle>

                  <DialogDescription>
                    Perbarui informasi akun yang ingin Anda ubah.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <label htmlFor="pengajarMapel" className="mb-2 block">
                    Ubah Pengajar Mata Pelajaran
                  </label>
                  <Input
                    id="pengajarMapel"
                    {...register("teachRole")}
                    placeholder="Matematika - Bahasa Indonesia - dst"
                  />
                </div>
                <div>
                  <label htmlFor="noTlp" className="mb-2 block">
                    Ubah No Telepon
                  </label>
                  <Input
                    id="noTlp"
                    {...register("noTlp")}
                    placeholder="089276361434"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block">
                    Ubah Password
                  </label>
                  <Input
                    type="password"
                    {...register("password")}
                    id="password"
                    placeholder="**********"
                  />
                </div>

                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-700">
                  Kosongkan field yang tidak ingin diubah.
                </p>

                <DialogFooter className="space-x-2">
                  <DialogClose>Batal</DialogClose>

                  <Button
                    type="submit"
                    form="submit-edit-profile"
                    className="rounded-md bg-blue-500 hover:bg-blue-500/80"
                  >
                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </HeaderProfile>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <History className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                    Exam History
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Riwayat Ujian yang Dibuat
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Lihat ringkasan ujian yang telah Anda buat dan kelola.
                  </p>
                </div>
              </div>

              {/* Total Exam */}
              <div className="ml-13 w-fit rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 sm:ml-0">
                {totalData} Ujian
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-14 font-semibold text-slate-600">
                    No
                  </TableHead>

                  <TableHead className="min-w-55 font-semibold text-slate-600">
                    Nama Ujian
                  </TableHead>

                  <TableHead className="min-w-32.5 text-center font-semibold text-slate-600">
                    Jumlah Siswa
                  </TableHead>

                  <TableHead className="min-w-37.5 text-center font-semibold text-slate-600">
                    Nilai Rata-Rata
                  </TableHead>

                  <TableHead className="min-w-30 text-center font-semibold text-slate-600">
                    Kelas
                  </TableHead>

                  <TableHead className="min-w-37.5 text-center font-semibold text-slate-600">
                    Tanggal
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dataHistoryExams.length > 0 ? (
                  dataHistoryExams.map((item, i: number) => (
                    <TableRow
                      key={`${item.class_id}-${item.id_subject}`}
                      className="transition-colors hover:bg-slate-50"
                    >
                      {/* No */}
                      <TableCell className="font-semibold text-slate-400">
                        {String((page - 1) * MAX_PAGE_SIZE + i + 1).padStart(
                          2,
                          "0",
                        )}
                      </TableCell>

                      {/* Exam */}
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.name_exam || "-"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Ujian yang telah dibuat
                          </p>
                        </div>
                      </TableCell>

                      {/* Student Count */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
                          {item.student_id.length} Siswa
                        </span>
                      </TableCell>

                      {/* Average Score */}
                      <TableCell className="text-center">
                        <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                          {resultNilaiRataRata(item.hasil_ujian) || 0}
                        </span>
                      </TableCell>

                      {/* Class */}
                      <TableCell className="text-center">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                          {item.class || "-"}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-center text-sm font-medium text-slate-500">
                        {item.exam_date
                          ? formatDateToYYYYMMDD(item.exam_date)
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <History className="size-9 text-slate-300" />

                        <p className="mt-3 font-semibold text-slate-500">
                          Belum Ada Riwayat Ujian
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Ujian yang telah dibuat akan muncul di sini.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="border-t border-slate-200 px-5 py-3 sm:px-7">
            <PaginationUi
              currentPage={page}
              totalPage={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </div>
        </section>
      </div>
    </>
  );
}
