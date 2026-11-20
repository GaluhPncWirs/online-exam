import DialogFormAddDataUser from "@/components/global/dialogTipeAkun/content";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleExistingUserAccount } from "@/src/services/mysql/student/data-student";
import type { DataStudent } from "@/src/types/dataUser";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let studentData: Pick<
    DataStudent,
    "id_student" | "type_account" | "class" | "nis" | "no_tlp"
  >;

  if (session?.user?.email) {
    const googleUser = await handleExistingUserAccount(session.user.email);
    if (!googleUser || googleUser.role !== "student") {
      return <h3>Data akun siswa tidak ditemukan</h3>;
    }

    studentData = {
      id_student: googleUser.id_student,
      type_account: googleUser.type_account,
      class: googleUser.class,
      nis: googleUser.nis ?? "",
      no_tlp: googleUser.no_tlp ?? "",
    };
  } else {
    const authenticatedUser = await getAuthenticatedUser("student");
    if (!authenticatedUser.success) {
      return <h3>{authenticatedUser.message}</h3>;
    }

    studentData = authenticatedUser.data;
  }

  const isProfileIncomplete =
    studentData.type_account === "google" &&
    (!studentData.class ||
      studentData.class === "not filled" ||
      !studentData.nis ||
      !studentData.no_tlp);

  if (isProfileIncomplete) {
    return <DialogFormAddDataUser dataStudent={studentData} />;
  }

  return children;
}
