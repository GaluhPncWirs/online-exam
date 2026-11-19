import type { AuthenticatedUser } from "@/src/types/dataUser";
import { create } from "zustand";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringOrNull(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "bigint") return String(v);
  return null;
}

function toDate(v: unknown): Date | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function parseAuthenticatedUser(value: unknown): AuthenticatedUser | null {
  if (!isRecord(value)) {
    return null;
  }

  const fullname = toStringOrNull(value.fullname) ?? toStringOrNull(value.name);
  const email = toStringOrNull(value.email);
  const createdAt = toDate(value.created_at) ?? toDate(value.createdAt);

  if (!fullname || !email || !createdAt) {
    return null;
  }

  const baseUser = {
    created_at: createdAt,
    fullname,
    email,
    no_tlp: toStringOrNull(value.no_tlp) ?? toStringOrNull(value.noTlp) ?? "",
    profil_img:
      toStringOrNull(value.profil_img) ??
      toStringOrNull(value.image) ??
      toStringOrNull(value.profileImage) ??
      toStringOrNull(value.picture),
  };

  if (value.role === "student") {
    const idStudent =
      toStringOrNull(value.id_student) ?? toStringOrNull(value.idStudent);
    const typeAccount = value.type_account ?? value.typeAccount;

    if (idStudent && (typeAccount === "default" || typeAccount === "google")) {
      return {
        ...baseUser,
        role: "student",
        class: toStringOrNull(value.class) ?? toStringOrNull(value.classes) ?? "",
        type_account: typeAccount,
        nis: toStringOrNull(value.nis) ?? "",
        id_student: idStudent,
      };
    }
  }

  if (value.role === "teacher") {
    const idTeacher =
      toStringOrNull(value.id_teacher) ?? toStringOrNull(value.idTeacher);

    if (idTeacher) {
      return {
        ...baseUser,
        role: "teacher",
        teach_role:
          toStringOrNull(value.teach_role) ?? toStringOrNull(value.teachRole) ?? "",
        nisn: toStringOrNull(value.nisn) ?? "",
        id_teacher: idTeacher,
      };
    }
  }

  return null;
}

type GetDataUsersState = {
  dataUser: AuthenticatedUser | null;
  message: string;
  isSuccess: boolean;
  setGetDataUser: () => Promise<void>;
};

export const useGetDataUser = create<GetDataUsersState>((set) => ({
  dataUser: null,
  message: "",
  isSuccess: false,

  setGetDataUser: async () => {
    try {
      const request = await fetch("/api/auth/decodeToken", {
        credentials: "include",
      });
      const response: unknown = await request.json();

      if (!request.ok || !isRecord(response) || response.success !== true) {
        set({
          dataUser: null,
          message:
            isRecord(response) && typeof response.message === "string"
              ? response.message
              : "Data pengguna gagal diambil.",
          isSuccess: false,
        });
        return;
      }

      const dataUser = parseAuthenticatedUser(response.data);

      if (!dataUser) {
        set({
          dataUser: null,
          message: "Format data pengguna tidak valid.",
          isSuccess: false,
        });
        return;
      }

      set({ dataUser, message: "", isSuccess: true });
    } catch (error) {
      set({
        dataUser: null,
        message: "Data gagal diambil, error pada database",
        isSuccess: false,
      });
      console.error("Gagal mengambil data pengguna", error);
    }
  },
}));
