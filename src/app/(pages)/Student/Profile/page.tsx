"use server";
import MainContent from "@/src/layout/mainContent/content";
import { Suspense } from "react";
import SkeletonProfil from "@/components/local/student/profil/skeleton";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import {
  handleGetDataHistoryResultExamPerClass,
  handleGetDataSubjectExams,
} from "@/src/services/mysql/student/data-subject-exam";
import ProfilClient from "@/components/local/student/profil/profilClient";
import { ExamResult, ScheduleExams } from "@/src/types/student/dataExams";
import { DataStudent } from "@/src/types/dataUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { handleExistingUserAccount } from "@/src/services/mysql/student/data-student";

export default async function Loader() {
  return (
    <Suspense fallback={<SkeletonProfil />}>
      <Profil />
    </Suspense>
  );
}

async function Profil() {
  const session = await getServerSession(authOptions);

  let studentData: DataStudent;

  if (session?.user?.email) {
    const googleUser = await handleExistingUserAccount(session?.user?.email);

    if (!googleUser || googleUser.role !== "student") {
      return <h3>Data akun siswa tidak ditemukan</h3>;
    }

    studentData = {
      id_student: googleUser.id_student,
      created_at: googleUser.created_at,
      fullname: googleUser.fullname,
      class: googleUser.class,
      email: googleUser.email,
      type_account: googleUser.type_account,
      role: "student",
      nis: googleUser.nis ?? "",
      no_tlp: googleUser.no_tlp ?? "",
      profil_img: googleUser.profil_img,
    };
  } else {
    const dataStudent = await getAuthenticatedUser("student");
    if (!dataStudent.success) {
      return <h3>{dataStudent.message}</h3>;
    }
    studentData = dataStudent.data;
  }

  const dataExams = await handleGetDataSubjectExams(
    studentData.class,
    studentData.id_student,
  );

  if (!dataExams.success) {
    return <h3>Error mengambil data ujian</h3>;
  }

  const dataResultExam = await handleGetDataHistoryResultExamPerClass(
    studentData.id_student,
  );

  if (!dataResultExam.success) {
    return <h3>Error mengambil data hasil ujian</h3>;
  }

  return (
    <MainContent>
      <ProfilClient
        initialDataExams={dataExams.data as ScheduleExams[]}
        initialDataHistoryResultExam={dataResultExam.data as ExamResult[]}
        dataStudent={studentData}
      />
    </MainContent>
  );
}
