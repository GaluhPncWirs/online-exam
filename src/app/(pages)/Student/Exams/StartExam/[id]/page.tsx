import BeginExam from "@/components/local/student/exam/beginExam";
import ExamSkeleton from "@/components/local/student/exam/skeleton";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
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
  const dataStudent = await getAuthenticatedUser();

  if (!dataStudent.success) {
    return <h3>{dataStudent.message}</h3>;
  }

  if (dataStudent.data.role !== "student") {
    return <h3>Halaman ini hanya untuk siswa</h3>;
  }

  const dataExam = await handleGetExams(id, dataStudent.data.class);

  if (!dataExam.success) {
    return <h3>Error ambil data</h3>;
  }

  return <BeginExam dataExam={dataExam.data as Exam} />;
}
