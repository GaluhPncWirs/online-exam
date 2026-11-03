import { Suspense } from "react";
import DashboardClientTeacher from "@/components/local/teacher/dashboard/dashboardClient";
import DashboardSkeletonTeacher from "@/components/local/teacher/dashboard/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetDataResultExamsPending } from "@/src/services/mysql/teacher/data-teacher";

export default function Loader() {
  return (
    <Suspense fallback={<DashboardSkeletonTeacher />}>
      <DashboardTeacher />
    </Suspense>
  );
}

async function DashboardTeacher() {
  const dataTeacher = await getAuthenticatedUser();

  if (!dataTeacher.success) {
    return <h3>{dataTeacher.message}</h3>;
  }

  if (dataTeacher.data.role !== "teacher") {
    return <h3>Halaman ini hanya untuk guru</h3>;
  }

  const dataResultExamPending = await handleGetDataResultExamsPending(
    dataTeacher.data.id_teacher,
  );

  if (!dataResultExamPending.success) {
    return <h3>{dataResultExamPending.message}</h3>;
  }

  return (
    <MainContent>
      <DashboardClientTeacher
        dataExamsResultPending={dataResultExamPending.data}
        dataTeacher={dataTeacher.data}
      />
    </MainContent>
  );
}
