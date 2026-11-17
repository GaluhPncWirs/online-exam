import type { AuthenticatedUser } from "@/src/types/dataUser";
import { create } from "zustand";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAuthenticatedUser(value: unknown): AuthenticatedUser | null {
  if (!isRecord(value)) {
    return null;
  }

  const createdAt =
    value.created_at instanceof Date
      ? value.created_at
      : typeof value.created_at === "string"
        ? new Date(value.created_at)
        : null;
  const { fullname, email, no_tlp, profil_img } = value;

  if (
    !createdAt ||
    Number.isNaN(createdAt.getTime()) ||
    typeof fullname !== "string" ||
    typeof email !== "string" ||
    typeof no_tlp !== "string" ||
    (profil_img !== null && typeof profil_img !== "string")
  ) {
    return null;
  }

  const baseUser = {
    created_at: createdAt,
    fullname,
    email,
    no_tlp,
    profil_img,
  };

  if (
    value.role === "student" &&
    typeof value.class === "string" &&
    (value.type_account === "default" || value.type_account === "google") &&
    typeof value.nis === "string" &&
    typeof value.id_student === "string"
  ) {
    return {
      ...baseUser,
      role: "student",
      class: value.class,
      type_account: value.type_account,
      nis: value.nis,
      id_student: value.id_student,
    };
  }

  if (
    value.role === "teacher" &&
    typeof value.teach_role === "string" &&
    typeof value.nisn === "string" &&
    typeof value.id_teacher === "string"
  ) {
    return {
      ...baseUser,
      role: "teacher",
      teach_role: value.teach_role,
      nisn: value.nisn,
      id_teacher: value.id_teacher,
    };
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
