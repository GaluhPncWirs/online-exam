"use client";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import {
  DataResultExam,
  Essay,
  MultipleChoice,
} from "@/src/types/student/dataExams";

type DataResultExamDetail = {
  dataResultExam: DataResultExam;
};

export default function ResultExamClient({
  dataResultExam,
}: DataResultExamDetail) {
  function correctAnswer(questionsId: string, pg: string) {
    if (!dataResultExam) return null;
    const answerStudentObj = dataResultExam?.answer_student;
    const studentAnswer = answerStudentObj[questionsId];
    return studentAnswer === pg && "bg-blue-200 rounded-sm py-1 font-semibold";
  }

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
              {dataResultExam.name_exam}
            </h2>

            <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
              {dataResultExam.type_exam === "pg" ? "Pilihan Ganda" : "Essay"}
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
        {dataResultExam.type_exam === "PG" ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {(dataResultExam.exam_questions as MultipleChoice[]).map(
              (item: MultipleChoice, i: number) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  {/* Question Header */}
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        {String(i + 1).padStart(2, "0")}
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
                        const choiceKey =
                          `choice_${opt}` as keyof typeof item.multipleChoice;
                        const choiceText = item.multipleChoice[choiceKey];

                        return (
                          <li
                            key={opt}
                            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${correctAnswer(
                              item.id,
                              choiceText,
                            )}`}
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
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {dataResultExam.exam_questions.map((item: Essay, i: number) => (
              <div
                key={item.id ?? i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Question */}
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
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
                    value={dataResultExam.answer_student?.[item.id] || ""}
                    className="min-h-32 resize-none rounded-xl border-slate-200 bg-slate-50 text-sm leading-6 text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
