import ExamSkeleton from "@/components/local/student/exam/skeleton";
import { handleGetExams } from "@/src/services/mysql/student/data-subject-exam";
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

  console.log(dataExam.data);

  return (
    <div>
      <h1>start exam</h1>
    </div>
  );
}
