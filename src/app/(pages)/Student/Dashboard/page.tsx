import DashboardClient from "@/components/local/student/dashboard/dashboardClient";
import DashboardSkeletonStudent from "@/components/local/student/dashboard/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { handleDecodeTokenJWT } from "@/src/services/mysql/data-student";
import { handleGetDataSubjectExams } from "@/src/services/mysql/data-subject-exam";
import { ScheduleExams } from "@/src/types/student/dataExams";
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
  const cookieStore = await cookies();

  const tokenJWTFromLoginDefaultCookies =
    cookieStore.get("loginSession")?.value;

  const tokenFromGoogleCookies = cookieStore.get(
    "next-auth.session-token",
  )?.value;

  let dataUser;

  if (tokenJWTFromLoginDefaultCookies) {
    // Login menggunakan email/password
    const session = await handleDecodeTokenJWT(tokenJWTFromLoginDefaultCookies);

    if (!session.success) {
      return <h3>{session.message}</h3>;
    }

    dataUser = session.data;
  } else {
    return <h3>Silakan login terlebih dahulu</h3>;
  }

  // else if (tokenFromGoogleCookies) {
  //   // Login menggunakan Google
  //   // Validasi session Google di server menggunakan NextAuth.
  //   // Contoh implementasinya ada di bawah.
  //   const session = await auth();

  //   if (!session?.user) {
  //     return <h3>Silakan login terlebih dahulu</h3>;
  //   }

  //   // Sesuaikan dengan struktur data user milikmu.
  //   dataUser = session.user;
  // }

  if (!dataUser?.class || !dataUser?.id_student) {
    return <h3>Data pengguna tidak valid</h3>;
  }

  const dataExams = await handleGetDataSubjectExams(
    dataUser.class,
    dataUser.id_student,
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
