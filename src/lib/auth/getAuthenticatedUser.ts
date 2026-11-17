import { handleDecodeTokenJWT } from "@/src/services/mysql/auth/login";
import { BaseUser, DataStudent, DataTeacher } from "@/src/types/dataUser";
import { cookies } from "next/headers";

export type AuthenticatedUser = DataStudent | DataTeacher;

type UserRole = AuthenticatedUser["role"];

export type AuthResult<T extends AuthenticatedUser = AuthenticatedUser> =
  | { success: true; data: T }
  | { success: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (isString(value)) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function parseBaseUser(payload: Record<string, unknown>): BaseUser | null {
  const created_at = parseDate(payload.created_at);
  const { fullname, email, no_tlp } = payload;
  const profil_img = payload.profil_img ?? null;

  if (
    !created_at ||
    !isString(fullname) ||
    !isString(email) ||
    !isString(no_tlp) ||
    (profil_img !== null && !isString(profil_img))
  ) {
    return null;
  }

  return { created_at, fullname, email, no_tlp, profil_img };
}

function parseAuthenticatedUser(payload: unknown): AuthenticatedUser | null {
  if (!isRecord(payload)) return null;

  const base = parseBaseUser(payload);
  if (!base) return null;

  switch (payload.role) {
    case "student": {
      const { class: className, type_account, nis, id_student } = payload;

      if (
        !isString(className) ||
        !isString(nis) ||
        !isString(id_student) ||
        (type_account !== "default" && type_account !== "google")
      ) {
        return null;
      }

      return {
        ...base,
        role: "student",
        class: className,
        type_account,
        nis,
        id_student,
      };
    }

    case "teacher": {
      const { teach_role, nisn, id_teacher } = payload;

      if (!isString(teach_role) || !isString(nisn) || !isString(id_teacher)) {
        return null;
      }

      return {
        ...base,
        role: "teacher",
        teach_role,
        nisn,
        id_teacher,
      };
    }

    default:
      return null;
  }
}

export async function getAuthenticatedUser(): Promise<AuthResult>;
export async function getAuthenticatedUser<R extends UserRole>(
  expectedRole: R,
): Promise<AuthResult<Extract<AuthenticatedUser, { role: R }>>>;
export async function getAuthenticatedUser(
  expectedRole?: UserRole,
): Promise<AuthResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("loginSession")?.value;

  // Belum login
  if (!token) {
    return { success: false, message: "Silakan login terlebih dahulu" };
  }

  try {
    const session = await handleDecodeTokenJWT(token);

    // Token gagal didecode
    if (!session.success) {
      return { success: false, message: session.message };
    }

    if (
      expectedRole &&
      session.role !== (expectedRole === "student" ? "siswa" : "guru")
    ) {
      return {
        success: false,
        message:
          expectedRole === "student"
            ? "Halaman ini hanya untuk siswa"
            : "Halaman ini hanya untuk guru",
      };
    }

    const user = parseAuthenticatedUser(session.data);

    if (!user) {
      return { success: false, message: "Sesi login tidak valid" };
    }

    if (expectedRole && user.role !== expectedRole) {
      return { success: false, message: "Sesi login tidak valid" };
    }

    return { success: true, data: user };
  } catch {
    return { success: false, message: "Sesi login tidak valid" };
  }
}
