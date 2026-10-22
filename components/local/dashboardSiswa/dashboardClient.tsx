"use client";
import { useRouter } from "next/navigation";
import HeaderDasboard from "../forDasboard/content";
import { useCallback, useEffect, useState } from "react";
import { useGetDataUser } from "@/src/store/useGetDataUsers/state";
import { BarChart3, BellRing, CalendarClock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUpComingExam } from "@/hooks/getUpComingExam";
import { ScheduleExams } from "@/src/types/student/dataExams";
import { toast } from "sonner";
import { getExamStatus } from "@/src/lib/utils/statusExam";
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
import { Button } from "@/components/ui/button";
import { formatDateToYYYYMMDD } from "@/src/lib/utils/convertDate";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

type DataExamsStudent = {
  dataExams: ScheduleExams[];
};

export default function DashboardClient({ dataExams }: DataExamsStudent) {
  const route = useRouter();
  const dataUser = useGetDataUser((state) => state.dataUser);
  // const scheduleExams = useDataExams(dataStudent, getIdStudent);
  const [confirm, setConfirm] = useState(5);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<
    Record<string, boolean>
  >({
    upComingExamCard: false,
    statusBadge: false,
  });
  const [lateExam, setLateExam] = useState<ScheduleExams[]>([]);

  const upcomingExam = getUpComingExam(dataExams);

  const filterScoreExams = dataExams.filter((exams) => {
    if (!exams.status_exam) return false;
    if (exams.result_exam === "pending" || exams.result_exam === "telat") {
      return false;
    }

    const score = Number(exams.result_exam);

    return Number.isFinite(score);
  });

  const totalScore = filterScoreExams.reduce((total, result_exam) => {
    return total + Number(result_exam);
  }, 0);

  const averageValue =
    filterScoreExams.length > 0
      ? Math.round((totalScore / filterScoreExams.length) * 100) / 100
      : 0;

  const lateExams = useCallback(
    async (idUjian: string) => {
      if (!dataUser?.id_student) return;
      const payload = {
        id_student: dataUser.id_student,
        id_subject: idUjian,
        result_exam: "telat",
        status_exam: true,
        className: dataUser.class,
      };

      const request = await fetch("/api/student/lateExam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await request.json();

      if (!response.success) {
        toast("❌ Gagal Simpan Data", {
          description: response.message,
        });
        return;
      }
    },
    [dataUser?.id_student],
  );

  useEffect(() => {
    if (!dataExams.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLateExam([]);
      return;
    }

    const lateExamsList = dataExams.filter((exam) => {
      return getExamStatus(exam.deadline_exam, exam.created_at) === "LEWAT";
    });

    setLateExam(lateExamsList);

    if (lateExamsList.length === 0) {
      return;
    }

    async function saveLateExams() {
      await Promise.all(
        lateExamsList.map((exam) => lateExams(exam.id_subject)),
      );
    }

    saveLateExams();
  }, [dataExams]);

  useEffect(() => {
    if (!openConfirmDialog) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirm(5);
      return;
    }

    setConfirm(5);

    const timer = setInterval(() => {
      setConfirm((prev: number) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [openConfirmDialog]);

  return (
    <div>
      <HeaderDasboard
        user="Siswa"
        fullname={dataUser?.fullname ?? ""}
        exams={dataExams}
      />
      <div className="space-y-8">
        {/* Summary */}
        <section>
          <div className="mb-5 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Overview
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Ringkasan Ujian
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Pantau ujian yang tersedia dan perkembangan hasil ujian Anda.
            </p>
          </div>

          {/* Statistic Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Ujian Terjadwal */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Ujian Terjadwal
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {dataExams.filter((done) => done.status_exam !== 1)
                      .length || 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Ujian yang belum diselesaikan
                  </p>
                </div>

                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <CalendarClock className="size-6" strokeWidth={1.8} />
                </div>
              </div>
            </div>

            {/* Nilai Rata-rata */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Nilai Rata-Rata
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {Math.round(averageValue) || 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Berdasarkan ujian yang telah selesai
                  </p>
                </div>

                <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <BarChart3 className="size-6" strokeWidth={1.8} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deadline Exam */}
        {upcomingExam && (
          <section>
            <div className="mb-4 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                Perlu Diperhatikan
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Ujian Segera Berakhir
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm sm:p-6">
              <div className="absolute -right-10 -top-10 size-40 rounded-full bg-amber-100/50 blur-2xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <BellRing className="size-6" strokeWidth={1.8} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      Deadline Terdekat
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {upcomingExam?.name_exam}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {upcomingExam?.created_at.toISOString()} ·{" "}
                      {upcomingExam?.deadline_exam.toISOString()}
                    </p>
                  </div>
                </div>

                <Dialog
                  open={openConfirmDialog.upComingExamCard}
                  onOpenChange={(open) =>
                    setOpenConfirmDialog((prev) => ({
                      ...prev,
                      upComingExamCard: open,
                    }))
                  }
                >
                  <DialogTrigger>
                    <Button
                      className="w-full rounded-xl bg-amber-500 px-6 font-semibold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 sm:w-auto"
                      onClick={() => setConfirm(5)}
                    >
                      Mulai Ujian
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="rounded-2xl sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Konfirmasi Masuk Ujian
                      </DialogTitle>

                      <DialogDescription className="pt-2 text-left leading-6">
                        Apakah Anda yakin ingin mengerjakan soal{" "}
                        <span className="font-bold text-slate-900">
                          &quot;{upcomingExam?.name_exam || ""}&quot;
                        </span>
                        ?
                        <span className="mt-3 block">
                          Pastikan Anda sudah siap. Setelah masuk ke halaman
                          ujian, Anda tidak dapat kembali ke dashboard.
                        </span>
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 gap-2">
                      <DialogClose>
                        <Button variant="outline" className="rounded-xl">
                          Batal
                        </Button>
                      </DialogClose>

                      <Button
                        onClick={() => {
                          if (!upcomingExam) return;

                          setOpenConfirmDialog((prev) => ({
                            ...prev,
                            upComingExamCard: false,
                          }));

                          route.push(
                            `/Student/Exams/StartExam/${upcomingExam.id_subject}`,
                          );
                        }}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700"
                        disabled={confirm > 0}
                      >
                        {confirm <= 0 ? "Mulai" : confirm}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
        )}

        {/* Available Exams */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Ujian Tersedia
                </h2>
                <p className="text-sm text-muted-foreground">
                  Daftar ujian yang tersedia untuk Anda.
                </p>
              </div>

              <div className="hidden rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 sm:block">
                {dataExams.length} Ujian
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-sm text-slate-600">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-sm text-slate-600">
                    Nama Ujian
                  </TableHead>
                  <TableHead className="font-semibold text-sm text-slate-600">
                    Waktu Tenggat
                  </TableHead>
                  <TableHead className="font-semibold text-sm text-slate-600">
                    Guru Pengampu
                  </TableHead>
                  <TableHead className="font-semibold text-sm text-slate-600">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dataExams.length > 0 ? (
                  dataExams.map((data, i: number) => {
                    const status = getExamStatus(
                      data.deadline_exam,
                      data.created_at,
                    );

                    return (
                      <TableRow
                        key={i}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <TableCell className="font-medium text-slate-500">
                          {i + 1}
                        </TableCell>

                        <TableCell className="font-semibold text-slate-800">
                          {data.name_exam}
                        </TableCell>

                        <TableCell className="text-sm text-slate-500">
                          {formatDateToYYYYMMDD(data.created_at)} | {""}
                          {formatDateToYYYYMMDD(data.deadline_exam)}
                        </TableCell>

                        <TableCell className="text-sm text-slate-600">
                          {data.fullname}
                        </TableCell>

                        <TableCell>
                          {data.status_exam === 1 &&
                          data.result_exam !== "telat" ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                              Selesai
                            </span>
                          ) : data.status_exam === 1 &&
                            data.result_exam === "telat" ? (
                            <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                              Telat
                            </span>
                          ) : status === "BELUM_MULAI" ? (
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                              Belum Dimulai
                            </span>
                          ) : status === "LEWAT" ? (
                            <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                              Lewat Batas Waktu
                            </span>
                          ) : status === "BERLANGSUNG" ? (
                            <Dialog
                              open={openConfirmDialog.badgeStatus}
                              onOpenChange={(open) =>
                                setOpenConfirmDialog((prev) => ({
                                  ...prev,
                                  badgeStatus: open,
                                }))
                              }
                            >
                              <DialogTrigger>
                                <button
                                  className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                                  onClick={() => setConfirm(5)}
                                >
                                  Sedang Berlangsung
                                </button>
                              </DialogTrigger>

                              <DialogContent className="rounded-2xl sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold">
                                    Konfirmasi Masuk Ujian
                                  </DialogTitle>

                                  <DialogDescription className="pt-2">
                                    Yakin ingin masuk ke ujian{" "}
                                    <span className="font-bold text-slate-900">
                                      &quot;{data.name_exam}&quot;
                                    </span>
                                    ?
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter className="mt-4 gap-2">
                                  <DialogClose>
                                    <Button
                                      variant="outline"
                                      className="rounded-xl"
                                    >
                                      Batal
                                    </Button>
                                  </DialogClose>

                                  <Button
                                    onClick={() => {
                                      if (!upcomingExam) return;

                                      setOpenConfirmDialog((prev) => ({
                                        ...prev,
                                        badgeStatus: false,
                                      }));

                                      route.push(
                                        `/Student/Exams/StartExam/${data.id_subject}`,
                                      );
                                    }}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700"
                                    disabled={confirm > 0}
                                  >
                                    {confirm <= 0 ? "Mulai" : confirm}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarClock className="size-8 text-slate-300" />

                        <p className="mt-2 font-semibold text-slate-500">
                          Belum Ada Ujian
                        </p>

                        <p className="text-sm text-slate-400">
                          Ujian yang tersedia akan muncul di sini.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Recent Scores */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Nilai Terakhir
              </h2>

              <p className="text-sm text-slate-500">
                Riwayat hasil ujian yang telah Anda selesaikan.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-600">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Nama Ujian
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Tanggal Pengerjaan
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">
                    Nilai
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dataExams.length > 0 ? (
                  dataExams.map((item, i: number) => {
                    const isCompleted = item.status_exam === 1;
                    const isLate = item.result_exam === "telat";
                    const isPending = item.result_exam === "pending";

                    // =========================
                    // UJIAN TELAT
                    // =========================
                    if (isLate) {
                      return (
                        <TableRow
                          key={item.id_subject}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <TableCell className="font-medium text-slate-500">
                            {i + 1}
                          </TableCell>

                          <TableCell>
                            <span className="font-semibold text-slate-800">
                              {item.name_exam}
                            </span>
                          </TableCell>

                          <TableCell className="text-sm text-slate-500">
                            {item.created_at
                              ? formatDateToYYYYMMDD(item.created_at)
                              : "-"}
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                              Tidak Ada Nilai
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    // =========================
                    // UJIAN SUDAH DIKERJAKAN
                    // =========================
                    if (isCompleted) {
                      return (
                        <TableRow
                          key={item.id_subject}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <TableCell className="font-medium text-slate-500">
                            {i + 1}
                          </TableCell>

                          <TableCell>
                            <HoverCard>
                              <HoverCardTrigger
                                href={`/Student/Dashboard/ResultExam/${item.id_subject}`}
                                className="font-semibold text-slate-800 transition-colors hover:text-blue-600 hover:underline"
                              >
                                {item.name_exam}
                              </HoverCardTrigger>

                              <HoverCardContent className="w-fit rounded-lg p-3">
                                <p className="text-xs font-medium text-slate-700">
                                  Lihat hasil ujian
                                </p>
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>

                          <TableCell className="text-sm text-slate-500">
                            {item.created_at
                              ? formatDateToYYYYMMDD(item.created_at)
                              : "-"}
                          </TableCell>

                          <TableCell>
                            {isPending ? (
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-600">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600">
                                {item.result_exam} / 100
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }

                    // =========================
                    // BELUM MENGERJAKAN
                    // =========================
                    return (
                      <TableRow
                        key={item.id_subject}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <TableCell className="font-medium text-slate-500">
                          {i + 1}
                        </TableCell>

                        <TableCell>
                          <span className="font-semibold text-slate-700">
                            {item.name_exam}
                          </span>
                        </TableCell>

                        <TableCell className="text-sm text-slate-500">
                          -
                        </TableCell>

                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500">
                            Belum Ada Nilai
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BarChart3 className="size-8 text-slate-300" />

                        <p className="mt-2 font-semibold text-slate-500">
                          Belum Ada Nilai
                        </p>

                        <p className="text-sm text-slate-400">
                          Hasil ujian akan muncul setelah Anda menyelesaikan
                          ujian.
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
    </div>
  );
}
