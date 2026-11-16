import ProfileSkeletonTeacher from "@/components/local/teacher/profile/teacherProfile/skeleton";
import ProfileTeacherClient from "@/components/local/teacher/profile/teacherProfile/teacherProfileClient";
import MainContent from "@/src/layout/mainContent/content";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { Suspense } from "react";

export default function Loader() {
  return (
    <Suspense fallback={<ProfileSkeletonTeacher />}>
      <TeacherProfile />
    </Suspense>
  );
}

async function TeacherProfile() {
  const dataTeacher = await getAuthenticatedUser();

  if (!dataTeacher.success) {
    return <h3>{dataTeacher.message}</h3>;
  }

  if (dataTeacher.data.role !== "teacher") {
    return <h3>Halaman ini hanya untuk guru</h3>;
  }

  return (
    <MainContent>
      <ProfileTeacherClient dataTeacher={dataTeacher.data} />
    </MainContent>
  );
}
