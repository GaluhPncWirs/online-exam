import DashboardClient from "@/components/local/dashboardSiswa/dashboardClient";
import DashboardSkeletonStudent from "@/components/local/dashboardSiswa/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { handleGetDataSubjectExams } from "@/src/services/mysql/data-subject-exam";
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
  const dataExams = await handleGetDataSubjectExams("3A", "STD-aMClguF");

  if (!dataExams.success) {
    return <h3>Error ambil data</h3>;
  }

  return (
    <MainContent>
      <DashboardClient dataExams={dataExams.data as ScheduleExams[]} />
    </MainContent>
  );
}
