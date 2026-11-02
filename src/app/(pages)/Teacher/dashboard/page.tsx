import { Suspense } from "react";
import DashboardClientTeacher from "@/components/local/teacher/dashboard/dashboardClient";
import DashboardSkeletonTeacher from "@/components/local/teacher/dashboard/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { DataUser } from "@/src/types/dataUser";

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

  return (
    <MainContent>
      <DashboardClientTeacher
        dataExams={}
        dataTeacher={dataTeacher.data as DataUser}
      />
    </MainContent>
  );
}
