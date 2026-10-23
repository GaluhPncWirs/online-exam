import DashboardClient from "@/components/local/student/dashboard/dashboardClient";
import DashboardSkeletonStudent from "@/components/local/student/dashboard/skeleton";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleDecodeTokenJWT } from "@/src/services/mysql/data-student";
import { handleGetDataSubjectExams } from "@/src/services/mysql/data-subject-exam";
import { ScheduleExams } from "@/src/types/student/dataExams";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default function Loader() {
  return (
    <Suspense fallback={<DashboardSkeletonStudent />}>
      <DashboardStudent />
    </Suspense>
  );
}

async function DashboardStudent() {
  const result = await getAuthenticatedUser();

  if (!result.success) {
    return <h3>{result.message}</h3>;
  }

  // else{
  //   // Login menggunakan Google
  //   // Validasi session Google di server menggunakan NextAuth.
  //   // Contoh implementasinya ada di bawah.
  //   const session = await getServerSession(authOptions);

  //   if (!session?.user) {
  //     return <h3>Silakan login terlebih dahulu</h3>;
  //   }

  //   // Sesuaikan dengan struktur data user milikmu.
  //   dataUser = session.user;
  // }

  const dataExams = await handleGetDataSubjectExams(
    result.data.class,
    result.data.id_student,
  );

  if (!dataExams.success) {
    return <h3>Error mengambil data ujian</h3>;
  }

  return (
    <MainContent>
      <DashboardClient dataExams={dataExams.data as ScheduleExams[]} />
    </MainContent>
  );
}
