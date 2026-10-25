import { handleDecodeTokenJWT } from "@/src/services/mysql/student/data-student";
import { cookies } from "next/headers";

type AuthenticatedUser = {
  class: string;
  id_student: string;
  [key: string]: unknown;
};

type AuthResult =
  | {
      success: true;
      data: AuthenticatedUser;
    }
  | {
      success: false;
      message: string;
    };

export async function getAuthenticatedUser(): Promise<AuthResult> {
  const cookieStore = await cookies();

  const tokenJWT = cookieStore.get("loginSession")?.value;

  // Belum login
  if (!tokenJWT) {
    return {
      success: false,
      message: "Silakan login terlebih dahulu",
    };
  }

  // Login menggunakan email/password
  const session = await handleDecodeTokenJWT(tokenJWT);

  if (!session.success) {
    return {
      success: false,
      message: session.message,
    };
  }

  const dataUser = session.data;

  // Validasi data pengguna
  if (!dataUser?.class || !dataUser?.id_student) {
    return {
      success: false,
      message: "Data pengguna tidak valid",
    };
  }

  return {
    success: true,
    data: dataUser as AuthenticatedUser,
  };
}
