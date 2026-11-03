import { handleDecodeTokenJWT } from "@/src/services/mysql/auth/login";
import { DataStudent, DataTeacher } from "@/src/types/dataUser";
import { cookies } from "next/headers";

export type AuthenticatedUser = DataStudent | DataTeacher;

export type AuthResult =
  | { success: true; data: AuthenticatedUser }
  | { success: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAuthenticatedUser(payload: unknown): AuthenticatedUser | null {
  if (!isRecord(payload)) return null;

  switch (payload.role) {
    case "student":
      if (
        typeof payload.id_student === "string" &&
        typeof payload.class === "string"
      ) {
        return {
          role: "student",
          id_student: payload.id_student,
          class: payload.class,
        };
      }
      return null;

    case "teacher":
      if (typeof payload.id_teacher === "string") {
        return { role: "teacher", id_teacher: payload.id_teacher };
      }
      return null;

    default:
      return null;
  }
}

export async function getAuthenticatedUser(): Promise<AuthResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("loginSession")?.value;

  // Belum login
  if (!token) {
    return { success: false, message: "Silakan login terlebih dahulu" };
  }

  try {
    const session = await handleDecodeTokenJWT(token);

    // Token gagal didecode (expired, signature salah, dll.)
    if (!session.success) {
      return { success: false, message: session.message };
    }

    const user = parseAuthenticatedUser(session.data);

    if (!user) {
      return { success: false, message: "Sesi login tidak valid" };
    }

    return { success: true, data: user };
  } catch {
    return { success: false, message: "Sesi login tidak valid" };
  }
}
