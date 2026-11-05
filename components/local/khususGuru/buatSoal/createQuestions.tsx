import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  createExamSchema,
  CreateExamSchemaType,
} from "@/src/schemas/addDataExam";
import { getDataExam } from "@/src/actions/dataExams";
import { DataTeacher } from "@/src/types/dataUser";
import { toast } from "sonner";
import { generateRandomId } from "@/src/lib/utils/generateRandomId";

const OPTION_LABELS = ["a", "b", "c", "d", "e"] as const;
type ExamOption = (typeof OPTION_LABELS)[number];

type ConfigExam = {
  id_subject: string;
  name_exam: string;
  type_exam: "PG" | "ESSAY";
};

type CreateNewQuestionsProps = {
  dataTeacher: DataTeacher;
};

export default function CreateNewQuestions({
  dataTeacher,
}: CreateNewQuestionsProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [dataExam, setDataExam] = useState<ConfigExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    control,
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateExamSchemaType>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      type_exam: "PG",
      name_exam: "",
      new_name_exam: "",
      questions: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function getDataManageExams() {
      setIsLoading(true);
      try {
        const result = await getDataExam();
        if (!isMounted) return;

        if (!result.success) {
          console.error(result.message);
          return;
        }

        setDataExam(result.data as ConfigExam[]);
      } catch (error) {
        console.error("Gagal mengambil data manage exams:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    getDataManageExams();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedExamName = watch("name_exam");
  const isTypeExam = watch("type_exam");
  const question = watch("questions");

  const selectedValueNameExam = watch("name_exam");

  const answer = watch("multipleChoice");
  const selectCorrectAnswer = watch("correctAnswer");

  const seen = new Set<string>();
  const options = OPTION_LABELS.flatMap((label) => {
    const text = answer?.[`choice_${label}` as const]?.trim();
    if (!text || seen.has(text)) return [];
    seen.add(text);
    return [{ label, text }];
  });

  const isStale =
    !!selectCorrectAnswer &&
    !options.some((option) => option.text === selectCorrectAnswer);

  useEffect(() => {
    if (isStale) setValue("correctAnswer", "");
  }, [isStale, setValue]);

  async function onSubmit(data: CreateExamSchemaType) {
    const isNewExam = selectedValueNameExam === "buatUjianBaru";
    const isMultipleChoice = isTypeExam === "PG";
    const idEveryQuestion = generateRandomId(10, "EX");

    try {
      if (isNewExam) {
        const dataPayloadAddExam = {
          type_exam: data.type_exam,
          id_teacher: dataTeacher.id_teacher,
          name_exam: data.name_exam,
          exam_questions: isMultipleChoice
            ? {
                id: idEveryQuestion,
                question: data.questions,
                multipleChoice: data.multipleChoice,
                correctAnswer: data.correctAnswer,
              }
            : {
                id: idEveryQuestion,
                question: data.questions,
              },
        };

        const req = await fetch("/api/teacher/addDataExam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataPayloadAddExam),
        });

        const res = await req.json();

        if (!res.success) {
          toast.error("Error tambah data", {
            description: res.message,
          });
          return;
        }

        toast("Berhasil ✅", {
          description: isMultipleChoice
            ? "Soal pilihan ganda berhasil ditambahkan."
            : "Soal essay berhasil ditambahkan.",
        });

        setOpenDialog(false);
      }

      const dataPayloadAddQuestion = {
        exam_questions: isMultipleChoice
          ? {
              id: idEveryQuestion,
              questions: data.questions,
              multipleChoice: data.multipleChoice,
              correctAnswer: data.correctAnswer,
            }
          : {
              id: idEveryQuestion,
              question: data.questions,
            },
      };

      const req = await fetch("/api/teacher/addDataQuestion", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payloadAddDataQuestion: dataPayloadAddQuestion,
          id_subject: data.id_subject,
          id_teacher: dataTeacher.id_teacher,
        }),
      });

      const res = await req.json();

      if (!res.success) {
        toast.error("Error tambah data", {
          description: res.message,
        });
        return;
      }

      toast.success("Soal berhasil ditambahkan.");

      setOpenDialog(false);
    } catch (error) {
      console.error("Unexpected error:", error);

      toast("Gagal ❌", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Question Builder
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Buat Soal Ujian
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Buat question baru untuk ujian yang sudah tersedia atau buat ujian
            baru sebelum menambahkan soal.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <form
          className="space-y-8"
          onSubmit={handleSubmit(onSubmit)}
          id="create-exam-form"
        >
          {/* ================= EXAM SETTINGS ================= */}
          <section>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Pengaturan Ujian
              </h3>

              <p className="text-sm text-slate-500">
                Tentukan tipe dan ujian yang akan digunakan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Exam Type */}
              <div>
                <label
                  htmlFor="exam-type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tipe Ujian
                </label>

                <Controller
                  control={control}
                  name="type_exam"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="exam-type"
                        className="h-12 rounded-xl w-full border-slate-200 bg-slate-50 px-4 shadow-none"
                      >
                        <SelectValue placeholder="Pilih tipe ujian" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl bg-white">
                        <SelectItem value="PG">Pilihan Ganda</SelectItem>
                        <SelectItem value="ESSAY">Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type_exam && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.type_exam?.message}
                  </p>
                )}
              </div>

              {/* Exam Name */}
              <div>
                <label
                  htmlFor="exam-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Ujian
                </label>

                <Controller
                  control={control}
                  name="name_exam"
                  render={({ field }) => (
                    <Select
                      onValueChange={(name) => {
                        field.onChange(name);

                        const exam = dataExam?.find(
                          (e) => e.name_exam === name,
                        );
                        setValue("id_subject", exam?.id_subject ?? "");
                      }}
                      value={field.value}
                    >
                      <SelectTrigger
                        id="exam-name"
                        className="h-12 rounded-xl w-full border-slate-200 bg-slate-50 px-4 shadow-none"
                      >
                        <SelectValue placeholder="Pilih nama ujian" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl bg-white p-1">
                        <SelectItem
                          value="buatUjianBaru"
                          className="rounded-lg bg-blue-50 font-semibold text-blue-600"
                        >
                          + Buat Ujian Baru
                        </SelectItem>

                        {dataExam.map((nameExam, i: number) => {
                          const isCorrectType =
                            nameExam.type_exam === isTypeExam;

                          return (
                            isCorrectType && (
                              <SelectItem
                                key={i}
                                value={nameExam.name_exam || "Nama ujian"}
                              >
                                {nameExam.name_exam || "Nama Ujian"}
                              </SelectItem>
                            )
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.name_exam && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.name_exam?.message}
                  </p>
                )}
              </div>
            </div>

            {/* New Exam Name */}
            {selectedExamName === "buatUjianBaru" && (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <label
                  htmlFor="nama_ujian"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Ujian Baru
                </label>

                <Input
                  id="nama_ujian"
                  {...register("new_name_exam")}
                  className="h-12 rounded-xl border-slate-200 bg-white"
                  placeholder="Contoh: Ujian Matematika Semester 1"
                />
                {errors.new_name_exam && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.new_name_exam?.message}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ================= QUESTION ================= */}
          <section className="border-t border-slate-100">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Soal Ujian</h3>

              <p className="text-sm text-slate-500">
                Tulis soal yang akan diberikan kepada peserta.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <label
                htmlFor="questions"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Isi Pertanyaan
              </label>

              <Textarea
                id="questions"
                {...register("questions")}
                placeholder="Tulis soal ujian di sini..."
                className="min-h-32 resize-y rounded-xl border-slate-200 bg-white p-4 text-sm leading-6"
              />
              {errors.questions && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.questions?.message}
                </p>
              )}
            </div>
          </section>

          {/* ================= MULTIPLE CHOICE ================= */}
          {isTypeExam === "PG" && (
            <section className="border-t border-slate-100 pt-8">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Pilihan Jawaban
                </h3>

                <p className="text-sm text-slate-500">
                  Isi setiap opsi jawaban, kemudian tentukan jawaban yang benar.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {OPTION_LABELS.map((option: ExamOption) => {
                  const answerKey = `choice_${option}` as keyof typeof answer;
                  const optionField =
                    `multipleChoice.choice_${option}` as const;
                  const optionError =
                    errors.multipleChoice?.[
                      `choice_${option}` as keyof NonNullable<
                        typeof errors.multipleChoice
                      >
                    ];
                  const optionErrorMessage =
                    typeof optionError === "object" && optionError !== null
                      ? "message" in optionError && optionError.message
                      : undefined;

                  return (
                    <div
                      key={`answer-option-${option}`}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <label
                        htmlFor={answerKey}
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                      >
                        <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold uppercase text-blue-600">
                          {option}
                        </span>
                        Opsi {option.toUpperCase()}
                      </label>

                      <Input
                        id={answerKey}
                        type="text"
                        {...register(optionField)}
                        placeholder={`Masukkan opsi ${option.toUpperCase()}`}
                        className="h-11 rounded-xl border-slate-200"
                      />
                      {optionErrorMessage && (
                        <p className="text-red-500 text-xs mt-0.5">
                          {optionErrorMessage}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Correct Answer */}
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-100/50 p-5">
                <label
                  htmlFor="correct-answer"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Jawaban yang Benar
                </label>

                <Controller
                  control={control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      disabled={options.length === 0}
                    >
                      <SelectTrigger
                        id="correct-answer"
                        className="h-12 w-full rounded-xl border-slate-200 bg-white sm:w-1/2"
                      >
                        <SelectValue
                          placeholder={
                            options.length === 0
                              ? "Isi opsi jawaban terlebih dahulu"
                              : "Pilih jawaban yang benar"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl bg-white">
                        {options.map(({ label, text }) => (
                          <SelectItem key={label} value={text}>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold uppercase text-blue-600">
                              {label}
                            </span>
                            {text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.correctAnswer && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.correctAnswer?.message}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ================= ACTION ================= */}
          <div className="flex flex-col gap-3 border-t pt-5 border-slate-200 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">
              Pastikan seluruh informasi soal sudah benar sebelum disimpan.
            </p>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger className="w-full text-slate-100 rounded-lg bg-blue-500 px-5 py-3 font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                Buat Soal
              </DialogTrigger>

              <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Periksa Soal
                  </DialogTitle>

                  <DialogDescription>
                    Pastikan question dan jawaban sudah benar sebelum
                    menambahkan soal.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Question Preview */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {selectedExamName === "buatUjianBaru"
                        ? selectedExamName
                        : selectedValueNameExam}
                    </p>

                    <p className="text-base font-semibold text-slate-800">
                      Pertanyaan
                    </p>

                    <p>{question}</p>
                  </div>

                  {/* Multiple Choice Preview */}
                  {isTypeExam === "PG" && (
                    <>
                      <div className="space-y-2">
                        {options.map((option) => (
                          <div
                            key={option.label}
                            className={`flex items-start gap-3 rounded-xl border p-3 ${
                              selectCorrectAnswer === option.text
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold uppercase text-slate-600">
                              {option.label}
                            </span>

                            <span className="text-sm leading-6 text-slate-700">
                              {option.text}
                            </span>

                            {selectCorrectAnswer === option.text && (
                              <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-600">
                                Benar
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Essay Preview */}
                  {isTypeExam === "ESSAY" && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Tipe Jawaban
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        Essay
                      </p>
                    </div>
                  )}
                </div>

                <DialogFooter className="space-x-1">
                  <DialogClose>Batal</DialogClose>

                  <Button
                    type="submit"
                    form="create-exam-form"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Simpan Soal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>
  );
}
