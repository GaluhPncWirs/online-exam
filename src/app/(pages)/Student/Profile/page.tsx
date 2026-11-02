import MainContent from "@/src/layout/mainContent/content";
import { Suspense } from "react";
import SkeletonProfil from "@/components/local/student/profil/skeleton";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import {
  handleGetDataResultExamPerClass,
  handleGetDataSubjectExams,
} from "@/src/services/mysql/student/data-subject-exam";
import ProfilClient from "@/components/local/student/profil/profilClient";
import { ExamResult, ScheduleExams } from "@/src/types/student/dataExams";
import { DataUser } from "@/src/types/dataUser";

export default function Loader() {
  return (
    <Suspense fallback={<SkeletonProfil />}>
      <Profil />
    </Suspense>
  );
}

async function Profil() {
  const dataStudent = await getAuthenticatedUser();

  if (!dataStudent.success) {
    return <h3>{dataStudent.message}</h3>;
  }

  const dataExams = await handleGetDataSubjectExams(
    dataStudent.data.class,
    dataStudent.data.id_student,
  );

  if (!dataExams.success) {
    return <h3>Error mengambil data ujian</h3>;
  }

  const dataResultExam = await handleGetDataResultExamPerClass(
    dataStudent.data.id_student,
  );

  if (!dataResultExam.success) {
    return <h3>Error mengambil data hasil ujian</h3>;
  }

  return (
    <MainContent>
      <ProfilClient
        dataExams={dataExams.data as ScheduleExams[]}
        dataResultExam={dataResultExam.data as ExamResult[]}
        dataStudent={dataStudent.data as DataUser}
      />
    </MainContent>
  );
}
