import ResultExamClient from "@/components/local/student/resultExam/resultExamClient";
import MainContent from "@/src/layout/mainContent/content";
import { handleGetDataResultExam } from "@/src/services/mysql/data-subject-exam";
import { DataResultExam } from "@/src/types/student/dataExams";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResultExamComponent({ params }: Props) {
  const { id } = await params;
  const dataExam = await handleGetDataResultExam(id, "STD-aMClguF");

  if (!dataExam.success) {
    return <h3>Error ambil data</h3>;
  }

  return (
    <MainContent>
      <ResultExamClient
        dataResultExam={dataExam?.data as unknown as DataResultExam}
      />
    </MainContent>
  );
}
