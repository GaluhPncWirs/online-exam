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

const examOptions = ["a", "b", "c", "d", "e"] as const;
type ExamOption = (typeof examOptions)[number];

type ConfigExam = {
  name_exam: string;
  type_exam: "PG" | "ESSAY";
};

export default function CreateNewQuestions() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dataExam, setDataExam] = useState<ConfigExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExamSchemaType>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      typeUjian: "PG",
      namaUjian: "",
      namaUjianBaru: "",
      pertanyaan: "",

      // pilihan ganda
      pilihanGanda: {
        choice_a: "",
        choice_b: "",
        choice_c: "",
        choice_d: "",
        choice_e: "",
      },
      correctAnswer: "",
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

  const isNewNameExam = watch("namaUjian");
  const isTypeExam = watch("typeUjian");

  const selectedValueNameExam = watch("namaUjian");

  const answer = {
    choice_a: watch("pilihanGanda.choice_a") ?? "",
    choice_b: watch("pilihanGanda.choice_b") ?? "",
    choice_c: watch("pilihanGanda.choice_c") ?? "",
    choice_d: watch("pilihanGanda.choice_d") ?? "",
    choice_e: watch("pilihanGanda.choice_e") ?? "",
  };
  const selectCorrectAnswer = watch("correctAnswer");

  async function onSubmit(dataNewExam: CreateExamSchemaType) {
    const isNewExam = selectedValueNameExam === "buatUjianBaru";
    const isMultipleChoice = isTypeExam === "PG";

    // try {
    //   // =========================================================
    //   // 1. Jika membuat ujian baru, cek nama ujian terlebih dahulu
    //   // =========================================================

    //   if (isNewExam) {
    //     const { data: existingExam, error: checkError } = await supabase
    //       .from("exams")
    //       .select("id")
    //       .eq("nama_ujian", dataNewExam.namaUjianBaru)
    //       .eq("idTeacher", idTeacher)
    //       .maybeSingle();

    //     if (checkError) {
    //       console.error("Check exam error:", checkError);

    //       toast("Gagal ❌", {
    //         description: "Gagal memeriksa nama ujian.",
    //       });

    //       return;
    //     }

    //     if (existingExam) {
    //       toast("Gagal ❌", {
    //         description: "Nama ujian tersebut sudah pernah dibuat.",
    //       });

    //       return;
    //     }

    //     // =======================================================
    //     // 2. Buat question pertama
    //     // =======================================================

    //     const question = isMultipleChoice
    //       ? {
    //           id: useRandomId(7, "EX"),
    //           questions: dataNewExam.pertanyaan,
    //           answerPg: dataNewExam.pilihanGanda,
    //           correctAnswer: dataNewExam.correctAnswer,
    //         }
    //       : {
    //           id: useRandomId(7, "EX"),
    //           questions: dataNewExam.pertanyaan,
    //         };

    //     const { error: insertError } = await supabase.from("exams").insert({
    //       created_at_exams: new Date().toISOString(),
    //       nama_ujian: dataNewExam.namaUjianBaru,
    //       questions_exam: [question],
    //       idTeacher,
    //       tipeUjian: dataNewExam.typeUjian,
    //     });

    //     if (insertError) {
    //       console.error("Insert exam error:", insertError);

    //       toast("Gagal ❌", {
    //         description: "Ujian gagal ditambahkan. Periksa kembali data ujian.",
    //       });

    //       return;
    //     }

    //     toast("Berhasil ✅", {
    //       description: isMultipleChoice
    //         ? "Soal pilihan ganda berhasil ditambahkan."
    //         : "Soal essay berhasil ditambahkan.",
    //     });

    //     setOpenDialog(false);
    //     return;
    //   }

    //   // =========================================================
    //   // 3. Tambahkan soal ke ujian yang sudah ada
    //   // =========================================================

    //   const { data: exam, error: examError } = await supabase
    //     .from("exams")
    //     .select("id, questions_exam, idTeacher")
    //     .eq("nama_ujian", selectedValueNameExam)
    //     .eq("idTeacher", idTeacher)
    //     .maybeSingle();

    //   if (examError) {
    //     console.error("Get exam error:", examError);

    //     toast("Gagal ❌", {
    //       description: "Gagal mengambil data ujian.",
    //     });

    //     return;
    //   }

    //   if (!exam) {
    //     toast("Gagal ❌", {
    //       description: "Ujian tidak ditemukan.",
    //     });

    //     return;
    //   }

    //   // =========================================================
    //   // 4. Buat question baru
    //   // =========================================================

    //   const newQuestion = isMultipleChoice
    //     ? {
    //         id: useRandomId(7, "EX"),
    //         questions: dataNewExam.pertanyaan,
    //         answerPg: dataNewExam.pilihanGanda,
    //         correctAnswer: dataNewExam.correctAnswer,
    //       }
    //     : {
    //         id: useRandomId(7, "EX"),
    //         questions: dataNewExam.pertanyaan,
    //       };

    //   const currentQuestions = Array.isArray(exam.questions_exam)
    //     ? exam.questions_exam
    //     : [];

    //   const updatedQuestions = [...currentQuestions, newQuestion];

    //   // =========================================================
    //   // 5. Update questions
    //   // =========================================================

    //   const { error: updateError } = await supabase
    //     .from("exams")
    //     .update({
    //       questions_exam: updatedQuestions,
    //     })
    //     .eq("id", exam.id)
    //     .eq("idTeacher", idTeacher);

    //   if (updateError) {
    //     console.error("Update exam error:", updateError);

    //     toast("Gagal ❌", {
    //       description: "Soal gagal ditambahkan. Periksa kembali data soal.",
    //     });

    //     return;
    //   }

    //   toast("Berhasil ✅", {
    //     description: "Soal berhasil ditambahkan.",
    //   });

    //   setOpenDialog(false);
    // } catch (error) {
    //   console.error("Unexpected error:", error);

    //   toast("Gagal ❌", {
    //     description: "Terjadi kesalahan. Silakan coba lagi.",
    //   });
    // }
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
            Buat pertanyaan baru untuk ujian yang sudah tersedia atau buat ujian
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
                  name="typeUjian"
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
                {errors.typeUjian && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.typeUjian?.message}
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
                  name="namaUjian"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                {errors.namaUjian && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.namaUjian?.message}
                  </p>
                )}
              </div>
            </div>

            {/* New Exam Name */}
            {isNewNameExam === "buatUjianBaru" && (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <label
                  htmlFor="nama_ujian"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Ujian Baru
                </label>

                <Input
                  id="nama_ujian"
                  {...register("namaUjianBaru")}
                  className="h-12 rounded-xl border-slate-200 bg-white"
                  placeholder="Contoh: Ujian Matematika Semester 1"
                />
                {errors.namaUjianBaru && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.namaUjianBaru?.message}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ================= QUESTION ================= */}
          <section className="border-t border-slate-100">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Pertanyaan</h3>

              <p className="text-sm text-slate-500">
                Tulis pertanyaan yang akan diberikan kepada peserta.
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
                {...register("pertanyaan")}
                placeholder="Tulis pertanyaan ujian di sini..."
                className="min-h-32 resize-y rounded-xl border-slate-200 bg-white p-4 text-sm leading-6"
              />
              {errors.pertanyaan && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.pertanyaan?.message}
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
                {examOptions.map((option: ExamOption) => {
                  const answerKey = `choice_${option}` as keyof typeof answer;
                  const optionField = `pilihanGanda.choice_${option}` as const;
                  const optionError =
                    errors.pilihanGanda?.[
                      `choice_${option}` as keyof NonNullable<
                        typeof errors.pilihanGanda
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="correct-answer"
                        className="h-12 w-full rounded-xl border-slate-200 bg-white sm:w-1/2"
                      >
                        <SelectValue placeholder="Pilih jawaban yang benar" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl bg-white">
                        {examOptions.map((option: ExamOption) => {
                          const answerKey =
                            `choice_${option}` as keyof typeof answer;

                          return (
                            <SelectItem key={option} value={option}>
                              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold uppercase text-blue-600">
                                {option}
                              </span>
                              {answer[answerKey] ||
                                `Opsi ${option.toUpperCase()}`}
                            </SelectItem>
                          );
                        })}
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

                  <DialogDescription className="pt-2 leading-6">
                    Pastikan pertanyaan dan jawaban sudah benar sebelum
                    menambahkan soal.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  {/* Question Preview */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Pertanyaan
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                      {isNewNameExam === "buatUjianBaru"
                        ? isNewNameExam
                        : selectedValueNameExam}
                    </p>
                  </div>

                  {/* Multiple Choice Preview */}
                  {isTypeExam === "PG" && (
                    <>
                      <div className="space-y-2">
                        {examOptions.map((option) => {
                          const answerKey =
                            `choice_${option}` as keyof typeof answer;

                          return (
                            <div
                              key={option}
                              className={`flex items-start gap-3 rounded-xl border p-3 ${
                                selectCorrectAnswer === option
                                  ? "border-emerald-200 bg-emerald-50"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold uppercase text-slate-600">
                                {option}
                              </span>

                              <span className="text-sm leading-6 text-slate-700">
                                {answer[answerKey] ||
                                  `Opsi ${option.toUpperCase()}`}
                              </span>

                              {selectCorrectAnswer === option && (
                                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-600">
                                  Benar
                                </span>
                              )}
                            </div>
                          );
                        })}
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

                <DialogFooter className="mt-5 gap-2">
                  <DialogClose>
                    <Button variant="outline" className="rounded-xl">
                      Batal
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    form="create-exam-form"
                    variant="default"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700"
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
