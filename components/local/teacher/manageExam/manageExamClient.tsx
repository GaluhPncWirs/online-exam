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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardList, PenLine, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  ExamQuestionType,
  SchemaExamQuestion,
} from "@/src/schemas/addDataExam";
import { Choice, ExamQuestion } from "@/src/types/dataExam";
import { toast } from "sonner";
import PaginationUi from "@/components/global/pagination/content";

type DataExamQuestion = {
  examQuestion: ExamQuestion;
  idExam: string;
  idTeacher: string;
};

type SelectedQuestion = {
  id: string;
  questions: string;
  multipleChoice?: Choice;
  correctAnswer?: string;
};

type Pagination = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export default function ManageExamComponent({
  examQuestion,
  idExam,
  idTeacher,
}: DataExamQuestion) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] =
    useState<SelectedQuestion | null>(null);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({
    editExam: false,
    deleteExam: false,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [questions, setQuestions] = useState(examQuestion.exam_questions);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExamQuestionType>({
    resolver: zodResolver(SchemaExamQuestion),

    defaultValues: {
      id: "",
      questions: "",
      multipleChoice: {
        choice_a: "",
        choice_b: "",
        choice_c: "",
        choice_d: "",
        choice_e: "",
      },
      correctAnswer: undefined,
    },
  });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuestions() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/teacher/GET/dataQuestions/${idExam}?page=${page}&limit=${limit}`,
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

        const res: {
          success: boolean;
          message?: string;
          data?: {
            exam_questions: ExamQuestion["exam_questions"];
            pagination: Pagination;
          };
        } = await response.json();

        if (res.success) {
          if (!res.data) {
            throw new Error("Data soal dari server tidak lengkap.");
          }
          setQuestions(res.data.exam_questions);
          setPagination(res.data.pagination);
        } else {
          toast.error("Gagal mengambil data soal", {
            description:
              res.message || "Terjadi kesalahan saat mengambil data soal",
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching questions:", error);
        toast.error("Gagal mengambil data soal", {
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengambil data soal",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
    return () => controller.abort();
  }, [page, limit, idExam]);

  useEffect(() => {
    if (selectedQuestion) {
      setValue("id", selectedQuestion.id);
    }
  }, [selectedQuestion, setValue]);

  async function onSubmit(formData: ExamQuestionType) {
    try {
      const updates: Record<string, string> = {
        questions: formData.questions,
      };

      if (formData.multipleChoice) {
        updates["multipleChoice.choice_a"] = formData.multipleChoice.choice_a;
        updates["multipleChoice.choice_b"] = formData.multipleChoice.choice_b;
        updates["multipleChoice.choice_c"] = formData.multipleChoice.choice_c;
        updates["multipleChoice.choice_d"] = formData.multipleChoice.choice_d;
        updates["multipleChoice.choice_e"] = formData.multipleChoice.choice_e;
      }

      if (formData.correctAnswer !== undefined) {
        updates.correctAnswer = formData.correctAnswer;
      }

      const response = await fetch("/api/teacher/PATCH/updateDataQuestion", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_subject: idExam,
          id_teacher: idTeacher,
          questionId: formData.id,
          updates,
        }),
      });

      const result: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        toast("Gagal ❌", {
          description: result.message ?? "Soal gagal diperbarui.",
        });
        return;
      }

      toast("Berhasil ✅", {
        description: "Soal berhasil diperbarui.",
      });

      setOpenDialog((prev) => ({
        ...prev,
        editExam: false,
      }));
      router.refresh();
    } catch (error) {
      console.error("Unexpected update error:", error);

      toast("Gagal ❌", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  async function handleDeleteQuestion(questionId: string | undefined) {
    if (!questionId) {
      toast.error("Gagal", {
        description: "ID soal tidak valid.",
      });
      return;
    }

    try {
      const req = await fetch("/api/teacher/DELETE/dataExam", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idSubject: idExam,
          idQuestion: questionId,
          idTeacher: idTeacher,
        }),
      });

      const res = await req.json();

      if (!res.success) {
        toast.error("Gagal", {
          description: res.message || "Soal gagal dihapus.",
        });
      }

      toast.success("Berhasil", {
        description: res.message || "Soal berhasil dihapus.",
      });

      setOpenDialog((prev) => ({
        ...prev,
        deleteExam: false,
      }));
    } catch (error) {
      console.error("Hapus soal gagal:", error);
      toast("Gagal ❌", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  function getDataBeforeUpdate(
    isTypeExam: "PG" | "ESSAY",
    dataQuestion: SelectedQuestion,
  ) {
    setSelectedQuestion(dataQuestion);

    const baseData = {
      id: dataQuestion.id ?? "",
      questions: dataQuestion.questions ?? "",
    };

    if (isTypeExam === "PG") {
      reset({
        ...baseData,

        multipleChoice: {
          choice_a: dataQuestion.multipleChoice?.choice_a ?? "",
          choice_b: dataQuestion.multipleChoice?.choice_b ?? "",
          choice_c: dataQuestion.multipleChoice?.choice_c ?? "",
          choice_d: dataQuestion.multipleChoice?.choice_d ?? "",
          choice_e: dataQuestion.multipleChoice?.choice_e ?? "",
        },

        correctAnswer: dataQuestion.correctAnswer ?? "",
      });
    } else {
      reset({
        ...baseData,

        multipleChoice: undefined,
        correctAnswer: undefined,
      });
    }

    setOpenDialog((prev) => ({
      ...prev,
      editExam: true,
    }));
  }

  function getDataBeforeDelete(dataQuestion: SelectedQuestion) {
    setSelectedQuestion(dataQuestion);
    setOpenDialog((prev) => ({
      ...prev,
      deleteExam: true,
    }));
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-blue-500 via-blue-500 to-cyan-500 p-6 text-white shadow-lg shadow-blue-100 sm:p-8">
        <div className="relative">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-sm">
              Exam Management
            </p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Kelola Soal Ujian
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-base font-semibold sm:text-lg">
                {examQuestion.name_exam}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                {examQuestion.type_exam === "PG" ? "Pilihan Ganda" : "Essay"}
              </span>

              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                {questions.length || 0} Soal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUESTIONS ================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Daftar Soal</h2>

            <p className="mt-1 text-sm text-slate-500">
              Kelola pertanyaan dan jawaban yang terdapat pada ujian ini.
            </p>
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

                <TableHead className="min-w-112.5 font-semibold text-slate-600">
                  Soal Ujian
                </TableHead>

                <TableHead className="min-w-17.5 text-center font-semibold text-slate-600">
                  Kelola
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {questions.length > 0 ? (
                questions.map((item, i: number) => (
                  <TableRow
                    key={item.id}
                    className="align-top transition-colors hover:bg-slate-50"
                  >
                    {/* Number */}
                    <TableCell className="pt-5 font-bold text-slate-400">
                      {String(i + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Question */}
                    <TableCell className="pt-5">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-base font-semibold leading-6 text-slate-900">
                          {item.questions}
                        </p>

                        {/* Multiple Choice */}
                        {examQuestion.type_exam === "PG" && (
                          <div className="mt-4 space-y-2">
                            {["a", "b", "c", "d", "e"].map((option) => {
                              const choiceKey = `choice_${option}`;
                              const choiceText =
                                "multipleChoice" in item
                                  ? item.multipleChoice[
                                      choiceKey as keyof Choice
                                    ]
                                  : undefined;

                              const isCorrect =
                                "correctAnswer" in item &&
                                item.correctAnswer === choiceText;

                              return (
                                <div
                                  key={option}
                                  className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                                    isCorrect
                                      ? "border-emerald-200 bg-emerald-50"
                                      : "border-slate-100 bg-white"
                                  }`}
                                >
                                  <span
                                    className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                                      isCorrect
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {option.toUpperCase()}
                                  </span>

                                  <span
                                    className={`min-w-0 wrap-break-word text-sm leading-6 ${
                                      isCorrect
                                        ? "font-semibold text-emerald-700"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {choiceText}
                                  </span>

                                  {isCorrect && (
                                    <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                      Benar
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Essay */}
                        {examQuestion.type_exam === "ESSAY" && (
                          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                              Tipe Jawaban
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-600">
                              Peserta memberikan jawaban dalam bentuk essay.
                            </p>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex flex-col gap-3">
                        {/* Edit */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            getDataBeforeUpdate(examQuestion.type_exam, item)
                          }
                        >
                          <PenLine className="size-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          type="button"
                          onClick={() => getDataBeforeDelete(item)}
                          variant="destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="size-9 text-slate-300" />

                      <p className="mt-3 font-semibold text-slate-500">
                        Belum Ada Soal
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Soal untuk ujian ini belum dibuat.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ================= MANAGE EXAM ================= */}
        {/* edit exam */}
        <Dialog
          open={openDialog.editExam}
          onOpenChange={(open) =>
            setOpenDialog((prev) => ({
              ...prev,
              editExam: open,
            }))
          }
        >
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            id="form-edit-question"
          >
            <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] rounded-lg sm:max-w-xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Soal</DialogTitle>

                <DialogDescription>
                  Perbarui pertanyaan dan jawaban dari soal berikut.
                </DialogDescription>
              </DialogHeader>

              {/* Question */}
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor={`question-${selectedQuestion?.id}`}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Pertanyaan
                  </label>

                  <Textarea
                    id={`question-${selectedQuestion?.id}`}
                    {...register("questions")}
                    className="h-24 rounded-xl border-slate-200"
                  />

                  {errors.questions && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.questions.message}
                    </p>
                  )}
                </div>

                {/* PG */}
                {examQuestion.type_exam === "PG" && (
                  <>
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-slate-700">
                        Pilihan Jawaban
                      </h3>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {(["a", "b", "c", "d", "e"] as const).map((option) => {
                          const choiceKey = `choice_${option}` as const;

                          return (
                            <div key={option}>
                              <label
                                htmlFor={`${choiceKey}-${selectedQuestion?.id}`}
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                              >
                                Opsi {option.toUpperCase()}
                              </label>

                              <Input
                                id={`${choiceKey}-${selectedQuestion?.id}`}
                                className="h-10 rounded-xl border-slate-200"
                                {...register(`multipleChoice.${choiceKey}`)}
                              />

                              {errors.multipleChoice?.[choiceKey] && (
                                <p className="mt-1 text-xs text-red-500">
                                  {errors.multipleChoice[choiceKey].message}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Jawaban Benar
                      </label>

                      <Controller
                        control={control}
                        name="correctAnswer"
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none">
                                <SelectValue placeholder="Pilih jawaban yang benar" />
                              </SelectTrigger>

                              <SelectContent className="rounded-xl bg-white">
                                {(["a", "b", "c", "d", "e"] as const).map(
                                  (option) => {
                                    const answerKey =
                                      `choice_${option}` as const;

                                    const answerText = watch(
                                      `multipleChoice.${answerKey}`,
                                    );

                                    if (!answerText?.trim()) return null;

                                    return (
                                      <SelectItem
                                        key={option}
                                        value={answerText}
                                      >
                                        {answerText}
                                      </SelectItem>
                                    );
                                  },
                                )}
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
                    </div>
                  </>
                )}
              </div>

              <DialogFooter className="space-x-2">
                <DialogClose>Batal</DialogClose>

                <Button
                  type="submit"
                  form="form-edit-question"
                  className=" bg-blue-600 hover:bg-blue-700"
                >
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        {/* delete exam */}
        <Dialog
          open={openDialog.deleteExam}
          onOpenChange={(open) =>
            setOpenDialog((prev) => ({
              ...prev,
              deleteExam: open,
            }))
          }
        >
          <DialogContent className="w-[calc(100%-2rem)] rounded-lg sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Hapus Soal</DialogTitle>

              <DialogDescription>
                Apakah Anda yakin ingin menghapus soal ini ?
                <span className="block font-bold">
                  Tindakan ini tidak dapat dibatalkan.
                </span>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="space-x-2">
              <DialogClose>Batal</DialogClose>

              <Button
                variant="destructive"
                onClick={() => handleDeleteQuestion(selectedQuestion?.id)}
              >
                Hapus Soal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {pagination && pagination.total_pages > 1 && (
          <div className="border-t border-slate-200 px-5 py-5 sm:px-6 flex justify-end">
            <PaginationUi
              currentPage={page}
              totalPage={pagination?.total_pages || 1}
              onPageChange={setPage}
              isLoading={loading}
            />
          </div>
        )}

        {/* Back */}
        <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
          <Link
            href="/Teacher/Dashboard"
            className="inline-flex items-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600/70"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
