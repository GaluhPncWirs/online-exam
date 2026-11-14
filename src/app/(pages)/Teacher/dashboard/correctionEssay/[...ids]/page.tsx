import CorrectionEssayClient from "@/components/local/teacher/correctionEssay/correctionEssayClient";
import CorrectionSkeletonTeacher from "@/components/local/teacher/correctionEssay/skeleton";
import MainContent from "@/src/layout/mainContent/content";
import { handleGetDataExamEssayForCorrection } from "@/src/services/mysql/teacher/data-subject-exam";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    ids: string[];
  }>;
};

export default function Loader({ params }: Props) {
  return (
    <Suspense fallback={<CorrectionSkeletonTeacher />}>
      <CorrectionEssay params={params} />
    </Suspense>
  );
}

async function CorrectionEssay({ params }: Props) {
  const { ids } = await params;
  const [idSubject, idStudent] = ids;

  const resultDataCorrections = await handleGetDataExamEssayForCorrection(
    idStudent,
    idSubject,
  );

  console.log(resultDataCorrections);

  return (
    <MainContent>
      <CorrectionEssayClient
        idSubject={idSubject}
        idStudent={idStudent}
        dataCorrections={resultDataCorrections.data}
      />
    </MainContent>
  );
}
