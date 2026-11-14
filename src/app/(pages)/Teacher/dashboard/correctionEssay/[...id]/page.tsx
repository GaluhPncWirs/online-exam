import CorrectionEssayClient from "@/components/local/teacher/correctionEssay/correctionEssayClient";
import MainContent from "@/src/layout/mainContent/content";
import { handleGetDataExamEssayForCorrection } from "@/src/services/mysql/teacher/data-subject-exam";

type Props = {
  params: Promise<{
    ids: string[];
  }>;
};

export default async function CorrectionEssay({ params }: Props) {
  const { ids } = await params;
  const [idSubject, idStudent] = ids;

  const resultDataCorrections = await handleGetDataExamEssayForCorrection(
    idStudent,
    idSubject,
  );

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
