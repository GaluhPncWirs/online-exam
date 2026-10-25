"use client";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
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
import { useDataExams } from "@/hooks/getScheduleExam";
import MainContent from "@/src/layout/mainContent/content";
import HeaderProfile from "@/src/layout/headerProfile/content";
import { useGetDataUser } from "@/src/store/useGetDataUsers/state";
import { ScheduleExams } from "@/src/types/student/dataExams";

type DataHistoryExams = {
  student_id: string;
  exam_id: number;
  hasil_ujian: string;
  kelas: string;
};

type DataExamsStudent = {
  dataExams: ScheduleExams[];
};

export default function ProfilClient({ dataExams }: DataExamsStudent) {
  const dataUser = useGetDataUser((state) => state.dataUser);
  // const [resultExamPerClass, setResultExamPerClass] = useState<
  //   DataHistoryExams[]
  // >([]);

  useEffect(() => {
    async function getHistoryResultExams() {
      const { data, error } = await supabase
        .from("history-exam-student")
        .select("student_id,exam_id,hasil_ujian,kelas")
        .eq("idStudent", getIdStudent)
        .limit(1);
      if (error) {
        console.log("Gagal mengambil data");
        setResultExamPerClass([]);
      } else {
        setResultExamPerClass(data);
      }
    }
    getHistoryResultExams();
  }, []);

  function rankingClasses() {
    if (!resultExamPerClass?.length || !dataUser?.class) {
      return { ranking: 0, lenStudentPerClass: 0 };
    }

    const normalizedResults = resultExamPerClass.map((item) => ({
      ...item,
      hasil_ujian:
        item.hasil_ujian !== "telat" && item.hasil_ujian !== "pending"
          ? item.hasil_ujian
          : "0",
    }));

    type StudentScores = {
      student_id: string;
      pointExams: number[];
    };

    type ClassGroup = {
      kelas: string;
      resultExam: StudentScores[];
    };

    const groupedByClass = normalizedResults.reduce<ClassGroup[]>(
      (acc, cur) => {
        const classGroup = acc.find((group) => group.kelas === cur.kelas);
        const score = Number(cur.hasil_ujian);

        if (!classGroup) {
          acc.push({
            kelas: cur.kelas,
            resultExam: [
              {
                student_id: cur.student_id,
                pointExams: [score],
              },
            ],
          });
        } else {
          const studentItem = classGroup.resultExam.find(
            (item) => item.student_id === cur.student_id,
          );

          if (studentItem) {
            studentItem.pointExams.push(score);
          } else {
            classGroup.resultExam.push({
              student_id: cur.student_id,
              pointExams: [score],
            });
          }
        }

        return acc;
      },
      [],
    );

    // Step 3: Calculate total scores for current class
    const currentClassData = groupedByClass.find(
      (group) => group.kelas === dataUser.class,
    );

    if (!currentClassData?.resultExam.length) {
      return { ranking: 0, lenStudentPerClass: 0 };
    }

    const totalScores = currentClassData.resultExam.map((item) => ({
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
      (item) => item.student_id === dataUser.id_student,
    );

    return {
      ranking: studentRanking?.ranking ?? 0,
      lenStudentPerClass: totalScores.length,
    };
  }

  // async function handleEditProfileStudent(
  //   event: React.FormEvent<HTMLFormElement>,
  // ) {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const resultPayload = Object.fromEntries(formData.entries());

  //   const { error } = await supabase
  //     .from("account-student")
  //     .update(resultPayload)
  //     .eq("idStudent", getIdStudent);

  //   if (error) {
  //     toast("Gagal ❌", {
  //       description: "Edit Profil Gagal",
  //     });
  //   } else {
  //     toast("Berhasil ✅", {
  //       description: "Edit Profil Berhasil Di Update",
  //     });
  //   }
  // }
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

            <DialogContent className="rounded-2xl sm:max-w-lg">
              <form
                className="grid gap-5"
                // onSubmit={(event) => handleEditProfileStudent(event)}
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
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email
                  </label>

                  <Input
                    type="email"
                    name="email"
                    id="email"
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
                    name="password"
                    id="password"
                    className="h-11 rounded-xl"
                  />
                </div>

                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-700">
                  Kosongkan field yang tidak ingin diubah.
                </p>

                <DialogFooter className="gap-2">
                  <DialogClose>
                    <Button variant="outline" className="rounded-xl">
                      Batal
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    Simpan Perubahan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                    {/* {getHistoryStudent.length || 0} */}0
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
                    {/* {rankingClasses().ranking || 0} */} 0
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {/* Dari {rankingClasses().lenStudentPerClass || 0} siswa */}
                    Dari 0 siswa
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

              {/* <TableBody>
                    {getHistoryStudent.length > 0 ? (
                      getHistoryStudent.map((item: any, i: number) => (
                        <TableRow
                          key={i}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <TableCell className="font-medium text-slate-500">
                            {i + 1}
                          </TableCell>

                          <TableCell className="font-semibold text-slate-800">
                            {item.exams?.nama_ujian || "-"}
                          </TableCell>

                          <TableCell className="text-sm text-slate-500">
                            {convertDate(item.created_at_historyExams, {
                              minute: "numeric",
                              hour: "numeric",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </TableCell>

                          <TableCell>
                            <span className="font-bold text-slate-800">
                              {item.hasil_ujian ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            {item.status_exam === true ? (
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
                  </TableBody> */}
            </Table>
          </div>
        </section>
      </div>
    </section>
  );
}
