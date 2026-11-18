"use server";
import BeginExam from "@/components/local/student/exam/beginExam";
import ExamSkeleton from "@/components/local/student/exam/skeleton";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetExams } from "@/src/services/mysql/student/data-subject-exam";
import { Pagination } from "@/src/types/dataExam";
import { Exam } from "@/src/types/student/dataExams";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Loader({ params }: Props) {
  return (
    <Suspense fallback={<ExamSkeleton />}>
      <StartExamPage params={params} />
    </Suspense>
  );
}

async function StartExamPage({ params }: Props) {
  const { id } = await params;
  const dataStudent = await getAuthenticatedUser("student");

  if (!dataStudent.success) {
    return <h3>{dataStudent.message}</h3>;
  }

  const dataExam = await handleGetExams(id, dataStudent.data.class);

  if (!dataExam.success) {
    return <h3>Error ambil data</h3>;
  }

  return (
    <BeginExam
      initialDataExam={dataExam.data as Exam}
      initialPagination={dataExam.pagination as Pagination}
      idSubject={id}
    />
  );
}
