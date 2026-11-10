import ManageExamComponent from "@/components/local/teacher/manageExam/manageExamClient";
import ManageExamSkeletonTeacher from "@/components/local/teacher/manageExam/skeleton";
import MainContent from "@/src/layout/mainContent/content";
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
  console.log(params);

  return (
    <MainContent>
      <ManageExamComponent />
    </MainContent>
  );
}
