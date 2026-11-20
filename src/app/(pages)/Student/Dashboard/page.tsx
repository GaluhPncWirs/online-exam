"use server";
import DialogFormAddDataUser from "@/components/global/dialogTipeAkun/content";
import DashboardClientStudent from "@/components/local/student/dashboard/dashboardClient";
import DashboardSkeletonStudent from "@/components/local/student/dashboard/skeleton";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleExistingUserAccount } from "@/src/services/mysql/student/data-student";
import { handleGetDataSubjectExams } from "@/src/services/mysql/student/data-subject-exam";
import { DataStudent } from "@/src/types/dataUser";
import { ScheduleExams } from "@/src/types/student/dataExams";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export default async function Loader() {
  return (
    <Suspense fallback={<DashboardSkeletonStudent />}>
      <DashboardStudent />
    </Suspense>
  );
}

async function DashboardStudent() {
  const session = await getServerSession(authOptions);
  let studentData: DataStudent;

  if (session?.user?.email) {
    const googleUser = await handleExistingUserAccount(session.user.email);

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

  if (
    !dataExams.success &&
    dataExams.message !== "Data ujian tidak di temukan"
  ) {
    return <h3>Error mengambil data ujian</h3>;
  }

  const initialDataExams: ScheduleExams[] = dataExams.success
    ? dataExams.data
    : [];

  return (
    <MainContent>
      {studentData.type_account === "google" && (
        <DialogFormAddDataUser dataStudent={studentData} />
      )}
      <DashboardClientStudent
        initialDataExams={initialDataExams}
        dataStudent={studentData}
      />
    </MainContent>
  );
}
