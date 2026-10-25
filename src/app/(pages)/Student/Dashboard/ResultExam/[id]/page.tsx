import ResultExamClient from "@/components/local/student/resultExam/resultExamClient";
import ResultExamSkeleton from "@/components/local/student/resultExam/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetDataResultExam } from "@/src/services/mysql/student/data-subject-exam";
import { DataResultExam } from "@/src/types/student/dataExams";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function Loader({ params }: Props) {
  return (
    <Suspense fallback={<ResultExamSkeleton />}>
      <ResultExamComponent params={params} />
    </Suspense>
  );
}

async function ResultExamComponent({ params }: Props) {
  const result = await getAuthenticatedUser();
  const { id } = await params;

  if (!result.success) {
    return <h3>{result.message}</h3>;
  }
  const dataExam = await handleGetDataResultExam(id, result.data.id_student);

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
