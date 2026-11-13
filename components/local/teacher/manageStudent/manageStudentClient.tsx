"use client";
import PaginationUi from "@/components/global/pagination/content";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTeacher } from "@/src/types/dataUser";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ManageStudentProps = {
  dataTeacher: DataTeacher;
};

type ResultExamStudent = {
  student_id: string;
  resultUjian: {
    namaUjian: string | null;
    idUjian: string;
    tipe_ujian: "PG" | "ESSAY";
    hasil_ujian: string | null;
    status_exam: 0 | 1;
  }[];
  created_at: Date[];
  fullName: string | null;
  classes: string | null;
};

const PAGE_SIZE = 10;

export default function ManageStudent({ dataTeacher }: ManageStudentProps) {
  const [resultExamStudents, setResultExamStudents] = useState<
    ResultExamStudent[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const totalPages = Math.ceil(totalStudents / PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuestions() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/teacher/GET/dataResultScoreExams?from=${from}&to=${to}`,
          {
            signal: controller.signal,
            credentials: "include",
          },
        );

        if (
          !response.headers.get("content-type")?.includes("application/json")
        ) {
          throw new Error(
            `Respons server tidak valid (${response.status} ${response.statusText}).`,
          );
        }

        const res = await response.json();

        if (res.success) {
          if (!Array.isArray(res.data) || typeof res.total !== "number") {
            throw new Error("Data hasil ujian dari server tidak lengkap.");
          }
          setResultExamStudents(res.data);
          setTotalStudents(res.total);
        } else {
          toast.error("Gagal mengambil data hasil ujian", {
            description:
              res.message ||
              "Terjadi kesalahan saat mengambil data hasil ujian",
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching exam results:", error);
        toast.error("Gagal mengambil data hasil ujian", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data hasil ujian",
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchQuestions();
    return () => controller.abort();
  }, [from, to]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Student Results
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Hasil Ujian Siswa
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pantau nilai dan status pengerjaan ujian setiap siswa.
            </p>
          </div>

          <div className="rounded-md bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
            {resultExamStudents.length} dari {totalStudents} Siswa
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-14 font-semibold text-slate-600">
                No
              </TableHead>

              <TableHead className="min-w-45 font-semibold text-slate-600">
                Siswa
              </TableHead>

              <TableHead className="min-w-65 font-semibold text-slate-600">
                Ujian
              </TableHead>

              <TableHead className="min-w-35 font-semibold text-slate-600">
                Nilai
              </TableHead>

              <TableHead className="min-w-42.5 font-semibold text-slate-600">
                Status Tugas
              </TableHead>

              <TableHead className="min-w-30 font-semibold text-slate-600">
                Kelas
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {resultExamStudents.length > 0 ? (
              resultExamStudents.map((data, i: number) => (
                <TableRow
                  key={data.student_id}
                  className="align-top transition-colors hover:bg-slate-50"
                >
                  <TableCell className="pt-5 font-semibold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </TableCell>

                  <TableCell className="pt-5">
                    <p className="font-semibold text-slate-900">
                      {data.fullName || "-"}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      ID: {data.student_id || "-"}
                    </p>
                  </TableCell>

                  <TableCell className="pt-5">
                    <div className="space-y-2">
                      {data.resultUjian?.length > 0 ? (
                        data.resultUjian.map((item, examIndex: number) => (
                          <div
                            key={item.idUjian}
                            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                          >
                            <div className="flex gap-3">
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-500 shadow-sm">
                                {examIndex + 1}
                              </span>

                              <div className="min-w-0">
                                <p className="font-semibold leading-5 text-slate-800">
                                  {item.namaUjian || "-"}
                                </p>

                                <span className="mt-1 text-[9px] font-semibold text-slate-500">
                                  {item.tipe_ujian === "ESSAY"
                                    ? "Essay"
                                    : "Pilihan Ganda"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          Belum ada ujian
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="pt-5">
                    <div className="space-y-2">
                      {data.resultUjian?.length > 0 ? (
                        data.resultUjian.map(
                          (nilaiUjian, examIndex: number) => {
                            const isPending =
                              nilaiUjian.hasil_ujian === "pending";

                            const isEssay = nilaiUjian.tipe_ujian === "ESSAY";

                            return (
                              <div
                                key={nilaiUjian.idUjian ?? `score-${examIndex}`}
                                className="flex min-h-10.5 items-center"
                              >
                                {isPending && isEssay ? (
                                  <HoverCard>
                                    <HoverCardTrigger>
                                      <Link
                                        href={`/Teacher/dashboard/correctionEssay/${nilaiUjian.idUjian}/${data.student_id}`}
                                        className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 transition-colors hover:bg-amber-100"
                                      >
                                        Perlu Dinilai
                                      </Link>
                                    </HoverCardTrigger>

                                    <HoverCardContent className="w-fit rounded-xl p-3">
                                      <p className="text-xs font-semibold text-slate-600">
                                        Beri nilai untuk jawaban essay siswa
                                      </p>
                                    </HoverCardContent>
                                  </HoverCard>
                                ) : (
                                  <span
                                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                                      nilaiUjian.hasil_ujian === "pending"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-emerald-50 text-emerald-600"
                                    }`}
                                  >
                                    {nilaiUjian.hasil_ujian === "pending"
                                      ? "Pending"
                                      : (nilaiUjian.hasil_ujian ?? "-")}
                                  </span>
                                )}
                              </div>
                            );
                          },
                        )
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="pt-5">
                    <div className="space-y-2">
                      {data.resultUjian?.length > 0 ? (
                        data.resultUjian.map(
                          (statusUjian, examIndex: number) => (
                            <div
                              key={statusUjian.idUjian ?? `status-${examIndex}`}
                              className="flex min-h-10.5 items-center"
                            >
                              {statusUjian.status_exam === 1 ? (
                                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                                  Selesai
                                </span>
                              ) : (
                                <span className="inline-flex rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                                  Belum Selesai
                                </span>
                              )}
                            </div>
                          ),
                        )
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="pt-5">
                    <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {data.classes || "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardList className="size-9 text-slate-300" />

                    <p className="mt-3 font-semibold text-slate-500">
                      Belum Ada Data Siswa
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Hasil ujian siswa akan muncul di sini setelah tersedia.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalStudents > PAGE_SIZE && (
          <PaginationUi
            currentPage={page}
            totalPage={totalPages}
            onPageChange={setPage}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
}
