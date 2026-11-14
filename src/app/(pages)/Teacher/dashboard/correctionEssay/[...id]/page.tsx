import CorrectionEssayClient from "@/components/local/teacher/correctionEssay/correctionEssayClient";
import MainContent from "@/src/layout/mainContent/content";

type Props = {
  params: Promise<{
    ids: string[];
  }>;
};

export default async function CorrectionEssay({ params }: Props) {
  const { ids } = await params;
  const [idExam, idStudent] = ids;

  return (
    <MainContent>
      <CorrectionEssayClient idExam={idExam} idStudent={idStudent} />
    </MainContent>
  );
}
