"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from "sonner";
import { Check, History, Trophy } from "lucide-react";
import HamburgerMenu from "@/components/global/hamburgerMenu/content";
import ListSidebar from "@/components/global/listSidebar/content";
import HeaderProfile from "@/src/layout/headerProfile/content";
import { useGetDataUser } from "@/src/store/useGetDataUsers/state";
import { ScheduleExams } from "@/src/types/student/dataExams";
import { useForm } from "react-hook-form";
import {
  InputUpdateData,
  inputUpdateDataSchema,
} from "@/src/schemas/updateDataStudent";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/global/loader/component";
import { createPortal } from "react-dom";
import { formatDateToYYYYMMDD } from "@/src/lib/utils/convertDate";

type DataExamsStudent = {
  dataExams: ScheduleExams[];
};

type ClassGroup = {
  id_student: string;
  pointExams: number[];
};

export default function ProfilClient({ dataExams }: DataExamsStudent) {
  const dataUser = useGetDataUser((state) => state.dataUser);

  const rankingClasses = () => {
    if (!dataExams?.length || !dataUser?.class) {
      return { ranking: 0, lenStudentPerClass: 0 };
    }

    const normalizedResults = dataExams.map((item) => ({
      ...item,
      result_exam:
        item.result_exam !== "telat" && item.result_exam !== "pending"
          ? item.result_exam
          : "0",
    }));

    const groupedByClass = normalizedResults.reduce<ClassGroup[]>(
      (acc, cur) => {
        const idStudentGroup = acc.find(
          (group) => group.id_student === cur.id_student,
        );
        const score = Number(cur.result_exam);

        if (!idStudentGroup) {
          acc.push({
            id_student: cur.id_student,
            pointExams: [score],
          });
        } else {
          idStudentGroup.pointExams.push(score);
        }

        return acc;
      },
      [],
    );

    const totalScores = groupedByClass.map((item) => ({
      ...item,
      pointExams: item.pointExams.reduce((sum, score) => sum + score, 0),
    }));

    // Step 4: Sort by score (descending)
    const sortedByScore = [...totalScores].sort(
      (a, b) => b.pointExams - a.pointExams,
    );

    // Step 5: Add ranks (handling ties)
    let lastScore: number | null = null;
    let currentRank = 0;

    const withRanking = sortedByScore.map((item, index) => {
      if (item.pointExams !== lastScore) {
        currentRank = index + 1;
        lastScore = item.pointExams;
      }
      return { ...item, ranking: currentRank };
    });

    // Step 6: Find current student's ranking
    const studentRanking = withRanking.find(
      (item) => item.id_student === dataUser.id_student,
    );

    return {
      ranking: studentRanking?.ranking ?? 0,
      lenStudentPerClass: totalScores.length,
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputUpdateData>({
    resolver: zodResolver(inputUpdateDataSchema),
    defaultValues: {
      name: dataUser?.fullname,
      noTlp: dataUser?.no_tlp,
      password: "",
    },
  });

  const onSubmit = async (data: InputUpdateData) => {
    const dataPayload = {
      name: data.name,
      password: data.password,
      noTlp: data.noTlp,
    };

    const filteredPayload = Object.fromEntries(
      Object.entries(dataPayload).filter(
        ([, value]) => value !== undefined && value !== "",
      ),
    );

    try {
      const request = await fetch("/api/student/updateData", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idStudent: dataUser?.id_student,
          fieldInput: filteredPayload,
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
      return;
    } catch {
      toast.error("Gagal", {
        description: "Error fetch api",
      });
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-3xl font-bold">Profil Siswa</h1>
        <HamburgerMenu>
          <ListSidebar />
        </HamburgerMenu>
      </div>
      <div className="w-full h-0.5 bg-slate-700 rounded-lg" />
      <div className="mt-7 space-y-6">
        <HeaderProfile>
          {/* Identity */}
          <div className="flex-1 space-y-3">
            <h2 className="text-3xl font-extrabold capitalize">
              {dataUser?.fullname || ""}
            </h2>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold backdrop-blur-sm shadow-sm">
                NIS. {dataUser?.nis || "-"}
              </span>

              <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold backdrop-blur-sm shadow-sm">
                Kelas {dataUser?.class || "-"}
              </span>
            </div>
          </div>

          {/* Edit */}
          <Dialog>
            <DialogTrigger className="rounded-lg py-2 border text-sm border-white/20 bg-white px-5 font-semibold text-blue-600 shadow-md hover:bg-blue-50">
              Edit Profil
            </DialogTrigger>

            <DialogContent>
              <form
                className="space-y-3"
                onSubmit={handleSubmit(onSubmit)}
                id="handleEditDataStudent"
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Edit Profil
                  </DialogTitle>

                  <DialogDescription>
                    Perbarui informasi akun yang ingin Anda ubah.
                  </DialogDescription>
                </DialogHeader>

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nama
                  </label>

                  <Input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password Baru
                  </label>

                  <Input
                    type="password"
                    id="password"
                    {...register("password")}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="noTlp"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    No. Telepon
                  </label>

                  <Input
                    type="text"
                    id="noTlp"
                    {...register("noTlp")}
                    className="h-11 rounded-xl"
                  />
                </div>

                <p className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-medium leading-5 text-amber-700">
                  Kosongkan field yang tidak ingin diubah.
                </p>

                <DialogFooter className="gap-2">
                  <DialogClose>Batal</DialogClose>

                  <Button
                    type="submit"
                    form="handleEditDataStudent"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {isSubmitting && createPortal(<Loader />, document.body)}
        </HeaderProfile>

        {/* ================= EXAM STATISTICS ================= */}
        <section>
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <History className="size-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Riwayat Ujian
                </h2>

                <p className="text-sm text-slate-500">
                  Ringkasan aktivitas ujian Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Completed */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Ujian Selesai
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {dataExams.length || 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Total ujian yang telah dikerjakan
                  </p>
                </div>

                <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Check className="size-6" />
                </div>
              </div>
            </div>

            {/* Ranking */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Peringkat Kelas
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {rankingClasses().ranking || 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Dari {rankingClasses().lenStudentPerClass || 0}
                  </p>
                </div>

                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Trophy className="size-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HISTORY TABLE ================= */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm pb-5">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Riwayat Ujian
              </h2>

              <p className="text-sm text-slate-500">
                Daftar ujian yang pernah anda ikuti.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-600 text-sm">
                    No
                  </TableHead>

                  <TableHead className="font-semibold text-slate-600 text-sm">
                    Nama Ujian
                  </TableHead>

                  <TableHead className="font-semibold text-slate-600 text-sm">
                    Tanggal
                  </TableHead>

                  <TableHead className="font-semibold text-slate-600 text-sm">
                    Nilai
                  </TableHead>

                  <TableHead className="font-semibold text-slate-600 text-sm">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dataExams.length > 0 ? (
                  dataExams.map((item, i: number) => (
                    <TableRow
                      key={i}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <TableCell className="font-medium text-slate-500">
                        {i + 1}
                      </TableCell>

                      <TableCell className="font-semibold text-slate-800">
                        {item.name_exam || "-"}
                      </TableCell>

                      <TableCell className="text-sm text-slate-500">
                        {formatDateToYYYYMMDD(item.created_at) || "-"}
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-slate-800">
                          {item.result_exam ?? "-"}
                        </span>
                      </TableCell>

                      <TableCell>
                        {item.status_exam === 1 ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                            Selesai
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                            Belum Selesai
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-36 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <History className="size-8 text-slate-300" />

                        <p className="mt-3 font-semibold text-slate-500">
                          Belum Ada Riwayat
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Riwayat ujian Anda akan muncul di sini.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </section>
  );
}
