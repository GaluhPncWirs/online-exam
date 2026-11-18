"use server";
import ResultExamClient from "@/components/local/student/resultExam/resultExamClient";
import ResultExamSkeleton from "@/components/local/student/resultExam/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetDataResultExam } from "@/src/services/mysql/student/data-subject-exam";
import { Pagination } from "@/src/types/dataExam";
import { DataResultExam } from "@/src/types/student/dataExams";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Loader({ params }: Props) {
  return (
    <Suspense fallback={<ResultExamSkeleton />}>
      <ResultExamComponent params={params} />
    </Suspense>
  );
}

async function ResultExamComponent({ params }: Props) {
  const dataStudent = await getAuthenticatedUser("student");
  const { id } = await params;

  if (!dataStudent.success) {
    return <h3>{dataStudent.message}</h3>;
  }

  const dataExam = await handleGetDataResultExam(
    id,
    dataStudent.data.id_student,
    1,
    10,
  );

  if (!dataExam.success) {
    return <h3>Error ambil data</h3>;
  }

  return (
    <MainContent>
      <ResultExamClient
        initialDataResultExam={dataExam.data as unknown as DataResultExam}
        initialPagination={dataExam.pagination as Pagination}
        idSubject={id}
        idStudent={dataStudent.data.id_student}
      />
    </MainContent>
  );
}
