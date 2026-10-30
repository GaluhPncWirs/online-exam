"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Flag, List, Timer, X } from "lucide-react";
import { Exam, TypeExamQuestions } from "@/src/types/student/dataExams";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  clearExamStorage,
  examKey,
  readStorage,
  shuffle,
  writeStorage,
} from "@/src/lib/utils/dataAnswerExam";

type BeginExamProps = {
  dataExam: Exam;
};

export default function BeginExam({ dataExam }: BeginExamProps) {
  const router = useRouter();
  const [clickedAnswerPg, setClickedAnswerPg] = useState<{
    [questions: string]: string;
  }>({});
  const [isClosedContent, setIsClosedContent] = useState<boolean>(false);
  const [dataUjianRandom, setDataUjianRandom] = useState<TypeExamQuestions>([]);
  const isSizeMobile = useIsMobile(1024);
  const [time, setTime] = useState<number>(0);
  const [answerEssayExams, setAnswerEssayExams] = useState<{
    [questions: string]: string;
  }>({});
  const [markQuestions, setMarkQuestions] = useState<Record<string, boolean>>(
    {},
  );
  const [timeOutDone, setTimeOutDone] = useState<boolean>(false);
  const [showInformationExam, setShowInformationExam] = useState<boolean>(true);
  const clickedOutsideCheked = useRef<HTMLInputElement | null>(null);
  const handleClickedOutsideContent = useRef<HTMLDivElement | null>(null);
  const clickedMarkQuestions = useRef<HTMLButtonElement | null>(null);
  const clickedAnswerQuestions = useRef<HTMLInputElement | null>(null);

  const examId = dataExam?.id_subject;
  const typeExam = dataExam.type_exam;

  const [isHydrated, setIsHydrated] = useState(false);
  const hydrateExamId = useRef<string | null>(null);

  // 1) HYDRATE: baca semua data dari localStorage, sekali per ujian
  useEffect(() => {
    if (!dataExam || hydrateExamId.current === dataExam.id_subject) return;
    hydrateExamId.current = dataExam.id_subject;

    const key = (name: string) => examKey(dataExam.id_subject, name);

    const savedMark = readStorage(key("mark"));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedMark) setMarkQuestions(savedMark);

    if (dataExam.type_exam === "PG") {
      const saved = readStorage(key("answer-pg"));
      if (saved) setClickedAnswerPg(saved);
    }

    if (dataExam.type_exam === "ESSAY") {
      const saved = readStorage(key("answer-essay"));
      if (saved) setAnswerEssayExams(saved);
    }

    // urutan soal acak
    const saveOrder = readStorage(key("random"));
    if (saveOrder?.length) {
      setDataUjianRandom(saveOrder);
    } else {
      const shuffled = shuffle(dataExam.exam_questions ?? []);
      setDataUjianRandom(shuffled);
      if (shuffled.length) writeStorage(key("random"), shuffled);
    }

    // timer
    const savedTime = readStorage(key("timer"));
    setTime(typeof savedTime === "number" ? savedTime : dataExam.duration);

    setIsHydrated(true);
  }, [dataExam]);

  // 2) SAVE jawaban & tanda soal (hanya setelah hydrate)
  useEffect(() => {
    if (!isHydrated || examId == null) return;

    writeStorage(examKey(examId, "mark"), markQuestions);
    if (typeExam === "PG") {
      writeStorage(examKey(examId, "answer-pg"), clickedAnswerPg);
    }
    if (typeExam === "ESSAY") {
      writeStorage(examKey(examId, "answer-essay"), answerEssayExams);
    }
  }, [
    isHydrated,
    examId,
    typeExam,
    markQuestions,
    clickedAnswerPg,
    answerEssayExams,
  ]);

  // 3) TIMER: interval dibuat sekali selama timer berjalan
  const isRunning = isHydrated && time != null && time > 0;

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTime((prev) => (prev == null ? prev : Math.max(prev - 1, 0)));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // simpan sisa waktu
  useEffect(() => {
    if (!isHydrated || examId == null || time == null) return;
    writeStorage(examKey(examId, "timer"), time);
  }, [isHydrated, examId, time]);

  const minute = Math.floor(time! / 60);
  const second = time! % 60;
  const formatedTime = `${minute}:${String(second).padStart(2, "0")}`;

  // useEffect(() => {
  //   const handleSelectStart = (e: Event) => {
  //     e.preventDefault();
  //     return false;
  //   };

  //   const handleContextMenu = (e: Event) => {
  //     e.preventDefault();
  //     return false;
  //   };

  //   const handleDragStart = (e: Event) => {
  //     e.preventDefault();
  //     return false;
  //   };

  //   document.addEventListener("selectstart", handleSelectStart);
  //   document.addEventListener("contextmenu", handleContextMenu);
  //   document.addEventListener("dragstart", handleDragStart);

  //   document.body.classList.add("no-select");

  //   return () => {
  //     document.removeEventListener("selectstart", handleSelectStart);
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("dragstart", handleDragStart);
  //     document.body.classList.remove("no-select");
  //   };
  // }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast("❌ Tidak Bisa Kembali", {
        description: "Tombol dinonaktifkan selama ujian!",
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleOutsideContent = (e: MouseEvent) => {
      const refs = [
        clickedOutsideCheked.current,
        handleClickedOutsideContent.current,
        clickedMarkQuestions.current,
        clickedAnswerQuestions.current,
      ];
      const isOutside = refs.every(
        (ref) => ref && !ref.contains(e.target as Node),
      );
      if (isOutside) {
        setIsClosedContent(true);
      }
    };

    window.addEventListener("click", handleOutsideContent);
    return () => window.removeEventListener("click", handleOutsideContent);
  }, []);

  useEffect(() => {
    if (isClosedContent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowInformationExam(false);
      setIsClosedContent(false);
    }
  }, [isClosedContent]);

  const handleSelectedAnswer = (questionsId: string, answer: string) => {
    setClickedAnswerPg((prev) => ({
      ...prev,
      [questionsId]: answer,
    }));
  };

  const handleAnswerEmpty = () => {
    const idSoalYangSudah = Object.keys(clickedAnswerPg);
    const dataUjian = dataUjianRandom.filter(
      (data) => !idSoalYangSudah.includes(data.id),
    );
    return dataUjian.length === 0;
  };

  const handleSendExam = async () => {
    const pilihanSiswa = Object.values(clickedAnswerPg);
    const jawabanYangBenar = dataExam?.exam_questions
      .flatMap((item) => item.correctAnswer)
      .filter((jawabanBenar) => pilihanSiswa.includes(jawabanBenar));
    const resultExam = Math.round(
      (jawabanYangBenar.length / (dataExam?.exam_questions?.length ?? 0)) * 100,
    );

    const payload = {
      // id_student: getIdStudent,
      id_subject: dataExam.id_subject,
      answer_student:
        dataExam?.type_exam === "PG" ? clickedAnswerPg : answerEssayExams,
      result_exam: dataExam?.type_exam === "PG" ? resultExam : "pending",
      status_exam: true,
      // className: dataStudent?.classes,
    };

    const response = await fetch("/api/student/saveResultExam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    if (res.success) {
      toast.success("Berhasil", { description: "Ujian Telah Selesai" });
      clearExamStorage(examId);
      router.push("/Student/Dashboard");
    } else {
      toast.error("Gagal", { description: "Gagal menyimpan data hasil ujian" });
    }
  };

  return (
    <div className="bg-slate-100">
      <div className="flex max-w-7xl mx-auto relative">
        {/* ================= SIDEBAR ================= */}
        <div className="lg:w-96 lg:shrink-0">
          {/* Overlay mobile */}
          {isSizeMobile && showInformationExam && (
            <button
              type="button"
              aria-label="Tutup navigasi soal"
              onClick={() => {
                setShowInformationExam(false);
                setIsClosedContent(true);
              }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
          )}

          {/* Sidebar */}
          <aside
            ref={handleClickedOutsideContent}
            className={`fixed inset-y-0 left-0 z-50 w-75 max-w-[85vw] bg-slate-700 text-white shadow-2xl transition-transform duration-300 ease-out ${isSizeMobile && !showInformationExam ? "-translate-x-full" : "translate-x-0"} lg:sticky lg:inset-y-auto lg:top-0 lg:left-auto lg:h-screen lg:w-full lg:max-w-none lg:translate-x-0 lg:shadow-xl`}
          >
            <div className="flex h-screen flex-col">
              {/* Header */}
              <div className="shrink-0 border-b border-white/10 p-4 sm:p5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300 sm:text-xs">
                      Exam Session
                    </p>

                    <h2 className="mt-1 truncate text-lg font-bold sm:text-xl">
                      Navigasi Soal
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowInformationExam(false);
                      setIsClosedContent(true);
                    }}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 lg:hidden"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Timer */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="min-w-0 rounded-xl bg-white/5 p-3 shadow-md shadow-slate-500">
                    <p className="text-[11px] text-slate-400">Tipe Ujian</p>

                    <p className="mt-1 truncate text-sm font-semibold">
                      {dataExam?.type_exam === "PG" ? "Pilihan Ganda" : "Essay"}
                    </p>
                  </div>

                  {formatedTime !== "NaN:NaN" && (
                    <div
                      className={`flex min-h-14.5 items-center justify-center gap-2 rounded-xl px-2 ${minute === 0 && second <= 20 ? "animate-pulse bg-red-500" : "bg-emerald-500"}`}
                    >
                      <Timer className="size-5 shrink-0" />

                      <span className="truncate font-mono text-sm font-bold tabular-nums">
                        {formatedTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">
                    Daftar Soal
                  </h3>

                  <span className="text-xs text-slate-300">
                    {dataUjianRandom.length} soal
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:gap-3">
                  {dataUjianRandom.map((item, i: number) => {
                    const isAnswerPg = clickedAnswerPg[item.id];
                    const isAnswerEssay = answerEssayExams[item.id];
                    const isMarking = markQuestions[item.id];

                    const isAnswered =
                      dataExam?.type_exam === "PG"
                        ? Boolean(isAnswerPg)
                        : Boolean(isAnswerEssay);

                    return (
                      <button
                        type="button"
                        key={item.id ?? i}
                        className={`relative aspect-square shadow-md shadow-slate-500 min-w-0 rounded-lg text-xs font-bold sm:rounded-xl sm:text-sm ${
                          isAnswered
                            ? "bg-emerald-500 text-white hover:bg-emerald-400"
                            : "bg-white/10 text-slate-300 hover:bg-white/20"
                        }`}
                      >
                        {isMarking &&
                          ((dataExam?.type_exam === "PG" && !isAnswerPg) ||
                            (dataExam?.type_exam === "ESSAY" &&
                              !isAnswerEssay)) && (
                            <Flag className="absolute left-1 top-1 size-2.5 text-amber-300 sm:size-3" />
                          )}

                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-white/10 p-4 sm:p-5">
                <div className="rounded-xl bg-white/5 p-3 sm:rounded-2xl sm:p-4">
                  <p className="text-[11px] leading-5 text-slate-400 sm:text-xs">
                    Pastikan seluruh jawaban telah diperiksa sebelum mengakhiri
                    ujian.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="basis-full min-w-0">
          <div className="p-3 sm:p-5 lg:p-6">
            {/* Exam Header */}
            <section className="sticky z-30 mb-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-xl top-3 sm:mb-5 sm:rounded-2xl sm:p-5 lg:p-6 lg:static">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600 sm:text-xs">
                    Ujian Aktif
                  </p>

                  <h1 className="mt-1 truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                    {dataExam?.name_exam}
                  </h1>
                </div>

                {/* Mobile Controls */}
                <div className="flex shrink-0 items-center gap-2 lg:hidden">
                  {formatedTime !== "NaN:NaN" && (
                    <div
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-mono text-xs font-bold tabular-nums sm:gap-2 sm:rounded-xl sm:px-3 sm:text-sm ${minute === 0 && second <= 20 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      <Timer className="size-4 sm:size-5" />
                      <span>{formatedTime}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowInformationExam(true);
                      setIsClosedContent(false);
                    }}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white sm:size-10 sm:rounded-xl"
                    aria-label="Buka navigasi soal"
                  >
                    <List className="size-4 sm:size-5" />
                  </button>
                </div>
              </div>
            </section>

            {/* ================= QUESTIONS ================= */}
            <div className="space-y-4 sm:space-y-5">
              {dataUjianRandom.map((item, i: number) => (
                <section
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 lg:p-7"
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-extrabold text-white sm:size-10 sm:rounded-xl sm:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                        Pertanyaan {i + 1}
                      </p>

                      <h2 className="mt-1 wrap-break-word text-base font-bold leading-6 text-slate-900 sm:text-lg sm:leading-7 lg:text-xl">
                        {item.questions}
                      </h2>
                    </div>
                  </div>

                  {/* PG */}
                  {dataExam?.type_exam === "PG" ? (
                    <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                      {["a", "b", "c", "d", "e"].map((opt) => {
                        const choiceKey = `choice_${opt}`;
                        const choiceText = item.multipleChoice[choiceKey];
                        const isSelected =
                          clickedAnswerPg[item.id] === choiceText;

                        return (
                          <label
                            key={opt}
                            className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-all sm:gap-3 sm:p-4 ${isSelected ? "border-blue-300 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"}`}
                          >
                            <Input
                              type="radio"
                              name={item.id}
                              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-blue-600 sm:size-5"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleSelectedAnswer(item.id, choiceText);
                                }
                              }}
                              ref={clickedAnswerQuestions}
                            />

                            <span
                              className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold sm:size-8 sm:text-xs ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
                            >
                              {opt.toUpperCase()}
                            </span>

                            <span className="min-w-0 flex-1 wrap-break-word text-sm font-medium leading-6 text-slate-700 sm:text-base">
                              {choiceText}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    /* Essay */
                    <div className="mt-5 sm:mt-6">
                      <label
                        htmlFor={item.id}
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Jawaban Anda
                      </label>

                      <Textarea
                        id={item.id}
                        placeholder="Tuliskan jawaban Anda di sini..."
                        className="min-h-32 w-full resize-y rounded-xl border-slate-200 bg-slate-50 p-3 text-sm leading-6 focus:bg-white sm:min-h-36 sm:p-4"
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onChange={(e) =>
                          setAnswerEssayExams((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        value={answerEssayExams[item.id] || ""}
                      />
                    </div>
                  )}

                  {/* Mark */}
                  <div className="mt-4 flex justify-end sm:mt-5">
                    <Button
                      type="button"
                      variant="outline"
                      className={`h-9 rounded-lg px-3 text-xs sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm ${markQuestions[item.id] ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100" : "border-slate-200"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMarkQuestions((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }));
                      }}
                      ref={clickedMarkQuestions}
                    >
                      <Flag className="mr-1.5 size-3.5 sm:mr-2 sm:size-4" />

                      {markQuestions[item.id] ? "Batal Tandai" : "Tandai Soal"}
                    </Button>
                  </div>
                </section>
              ))}
            </div>

            {/* ================= SUBMIT ================= */}
            <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:rounded-2xl sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                    Sudah selesai mengerjakan?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    Pastikan jawaban sudah diperiksa sebelum mengakhiri ujian.
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger className="rounded-lg bg-blue-500 px-6 text-slate-50 py-3 font-medium text-sm hover:bg-blue-500/80">
                    Selesai Ujian
                  </DialogTrigger>

                  <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
                    <DialogHeader>
                      {handleAnswerEmpty() === false ? (
                        <>
                          <DialogTitle className="text-lg font-bold sm:text-xl">
                            Jawaban Belum Lengkap
                          </DialogTitle>

                          <DialogDescription className="pt-2 text-sm leading-6">
                            Masih terdapat jawaban yang belum diisi. Apakah Anda
                            yakin ingin mengakhiri sesi ujian ini?
                          </DialogDescription>
                        </>
                      ) : (
                        <>
                          <DialogTitle className="text-lg font-bold sm:text-xl">
                            Konfirmasi Ujian
                          </DialogTitle>

                          <DialogDescription className="pt-2 text-sm leading-6">
                            Apakah Anda yakin ingin menyelesaikan ujian ini?
                          </DialogDescription>
                        </>
                      )}
                    </DialogHeader>

                    <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
                      <DialogClose>
                        <Button
                          variant="outline"
                          className="w-full rounded-xl sm:w-auto"
                        >
                          Kembali
                        </Button>
                      </DialogClose>

                      <DialogClose>
                        <Button
                          onClick={handleSendExam}
                          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
                        >
                          Akhiri Ujian
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* ================= TIMEOUT ================= */}
      <AlertDialog open={timeOutDone} onOpenChange={setTimeOutDone}>
        <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold sm:text-xl">
              Waktu Telah Habis
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-6">
              Ujian telah mencapai batas waktu yang telah ditentukan. Jawaban
              Anda akan disimpan secara otomatis.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
              onClick={handleSendExam}
            >
              Oke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
