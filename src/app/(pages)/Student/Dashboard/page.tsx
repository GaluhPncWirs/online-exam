import DialogFormAddDataUser from "@/components/global/dialogTipeAkun/content";
import DashboardClientStudent from "@/components/local/student/dashboard/dashboardClient";
import DashboardSkeletonStudent from "@/components/local/student/dashboard/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetDataSubjectExams } from "@/src/services/mysql/student/data-subject-exam";
import { ScheduleExams } from "@/src/types/student/dataExams";
import { Suspense } from "react";

export default function Loader() {
  return (
    <Suspense fallback={<DashboardSkeletonStudent />}>
      <DashboardStudent />
    </Suspense>
  );
}

async function DashboardStudent() {
  const dataStudent = await getAuthenticatedUser("student");

  if (!dataStudent.success) {
    return <h3>{dataStudent.message}</h3>;
  }

  const dataExams = await handleGetDataSubjectExams(
    dataStudent.data.class,
    dataStudent.data.id_student,
  );

  if (!dataExams.success) {
    return <h3>Error mengambil data ujian</h3>;
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

  return (
    <MainContent>
      {/* <DialogFormAddDataUser idUsers={dataStudent.data.id_student} /> */}
      <DashboardClientStudent
        dataExams={dataExams.data as ScheduleExams[]}
        dataStudent={dataStudent.data}
      />
    </MainContent>
  );
}
