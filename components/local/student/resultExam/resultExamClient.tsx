"use client";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { DataResultExam } from "@/src/types/student/dataExams";
import { EssayQuestion, MultipleChoiceQuestion } from "@/src/types/dataExam";
import { useEffect, useState } from "react";
import { Pagination } from "@/src/types/dataExam";
import { toast } from "sonner";
import PaginationUi from "@/components/global/pagination/content";

type DataResultExamDetail = {
  initialDataResultExam: DataResultExam;
  initialPagination: Pagination;
  idSubject: string;
  idStudent: string;
};

export default function ResultExamClient({
  initialDataResultExam,
  initialPagination,
  idSubject,
  idStudent,
}: DataResultExamDetail) {
  const [dataAnswer, setDataAnswer] = useState<Record<string, string>>(
    initialDataResultExam.answer_student,
  );
  const [dataQuestions, setDataQuestions] = useState<
    Array<MultipleChoiceQuestion | EssayQuestion>
  >(initialDataResultExam.exam_questions);

  const [page, setPage] = useState(initialPagination?.page ?? 1);
  const [limit, setLimit] = useState(initialPagination?.limit ?? 10);
  const [pagination, setPagination] = useState<Pagination | null>(
    initialPagination,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchResultExam() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          idStudent,
          idSubject,
        });

        const response = await fetch(
          `/api/student/GET/dataResultExam?${params.toString()}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data jawaban.");
        }

        const res = await response.json();

        if (!res.success) {
          throw new Error(
            res.message || "Terjadi kesalahan saat mengambil data jawaban.",
          );
        }

        if (!res.data) {
          throw new Error("Data jawaban dari server tidak lengkap.");
        }

        setDataAnswer(res.data.answer_student);
        setDataQuestions(res.data.exam_questions);
        setPagination(res.pagination);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching questions:", error);
        toast.error("Gagal mengambil data jawaban", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data jawaban",
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchResultExam();
    return () => controller.abort();
  }, [page, limit, idStudent, idSubject]);

  return (
    <div className="space-y-8">
      {/* ================= HEADER / RESULT SUMMARY ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-100 sm:p-8">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-white/5" />

        <div className="relative z-10">
          <Link
            href="/Student/Dashboard"
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Dashboard
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            Result Review
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hasil Ujian
          </h1>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              {initialDataResultExam.name_exam}
            </h2>

            <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
              {initialDataResultExam.type_exam === "PG"
                ? "Pilihan Ganda"
                : "Essay"}
            </span>
          </div>
        </div>
      </section>

      {/* ================= QUESTIONS ================= */}
      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Review Jawaban
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Pembahasan Jawaban
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Periksa kembali jawaban yang telah Anda berikan pada setiap soal.
          </p>
        </div>
        {initialDataResultExam.type_exam === "PG" ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {dataQuestions.map((item, i: number) => {
              if (!("multipleChoice" in item)) return null;
              const questionNumber = (page - 1) * limit + i + 1;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  {/* Question Header */}
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        {String(questionNumber).padStart(2, "0")}
                      </span>

                      <h3 className="pt-1 text-base font-bold leading-6 text-slate-900">
                        {item.questions}
                      </h3>
                    </div>
                  </div>

                  {/* Answers */}
                  <div className="p-5">
                    <ul className="flex flex-col gap-3">
                      {["a", "b", "c", "d", "e"].map((opt) => {
                        const choiceKey = `choice_${opt}` as
                          | "choice_a"
                          | "choice_b"
                          | "choice_c"
                          | "choice_d"
                          | "choice_e";
                        const choiceText = item.multipleChoice[choiceKey];

                        return (
                          <li
                            key={opt}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                              dataAnswer[item.id] === choiceText
                                ? "bg-blue-200 rounded-sm py-1 font-semibold"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/70 text-xs font-bold">
                                {opt.toUpperCase()}
                              </span>

                              <span className="leading-6">{choiceText}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {dataQuestions.map((item, i: number) => {
              const questionNumber = (page - 1) * limit + i + 1;
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Question */}
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        {String(questionNumber).padStart(2, "0")}
                      </span>

                      <h3 className="pt-1 text-base font-bold leading-6 text-slate-900">
                        {item.questions}
                      </h3>
                    </div>
                  </div>

                  {/* Student Answer */}
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">
                        Jawaban Anda
                      </label>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        Essay
                      </span>
                    </div>

                    <Textarea
                      disabled
                      value={dataAnswer[item.id] || ""}
                      className="min-h-32 resize-none rounded-xl border-slate-200 bg-slate-50 text-sm leading-6 text-slate-700"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {pagination && pagination.total_pages > 1 && (
          <PaginationUi
            currentPage={page}
            totalPage={pagination.total_pages}
            onPageChange={setPage}
            isLoading={loading}
          />
        )}
      </section>
    </div>
  );
}
