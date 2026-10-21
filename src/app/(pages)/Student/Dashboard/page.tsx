import DashboardClient from "@/components/local/dashboardSiswa/dashboardClient";
import MainContent from "@/src/layout/mainContent/content";
import { handleGetDataSubjectExams } from "@/src/services/mysql/data-subject-exam";

export default async function DashboardStudent() {
  const dataExam = await handleGetDataSubjectExams("3A", "STD-aMClguF");

  console.log(dataExam);

  return (
    <MainContent>
      <DashboardClient />
    </MainContent>
  );
}
