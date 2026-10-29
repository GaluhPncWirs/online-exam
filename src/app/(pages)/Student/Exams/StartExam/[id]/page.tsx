import BeginExam from "@/components/local/student/exam/beginExam";
import ExamSkeleton from "@/components/local/student/exam/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { handleGetExams } from "@/src/services/mysql/student/data-subject-exam";
import { Exam } from "@/src/types/student/dataExams";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function Loader({ params }: Props) {
  return (
    <Suspense fallback={<ExamSkeleton />}>
      <StartExamPage params={params} />
    </Suspense>
  );
}

async function StartExamPage({ params }: Props) {
  const { id } = await params;
  const dataExam = await handleGetExams(id);

  if (!dataExam.success) {
    return <h3>Error ambil data</h3>;
  }

  return (
    <MainContent>
      <BeginExam dataExam={dataExam.data as unknown as Exam} />
    </MainContent>
  );
}
