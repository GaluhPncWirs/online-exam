import ManageExamComponent from "@/components/local/teacher/manageExam/manageExamClient";
import ManageExamSkeletonTeacher from "@/components/local/teacher/manageExam/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetDetailExam } from "@/src/services/mysql/teacher/data-subject-exam";
import { ExamQuestion } from "@/src/types/dataExam";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Loader({ params }: Props) {
  return (
    <Suspense fallback={<ManageExamSkeletonTeacher />}>
      <ManageExamTeacher params={params} />
    </Suspense>
  );
}

async function ManageExamTeacher({ params }: Props) {
  const dataTeacher = await getAuthenticatedUser();
  const { id } = await params;

  if (!dataTeacher.success) {
    return <h3>{dataTeacher.message}</h3>;
  }

  if (dataTeacher.data.role !== "teacher") {
    return <h3>Halaman ini hanya untuk guru</h3>;
  }

  const dataDetailExam = await handleGetDetailExam(
    id,
    dataTeacher.data.id_teacher,
  );

  if (!dataDetailExam.success) {
    return <h3>{dataDetailExam.message}</h3>;
  }

  return (
    <MainContent>
      <ManageExamComponent examQuestion={dataDetailExam.data as ExamQuestion} />
    </MainContent>
  );
}
