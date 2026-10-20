import { create } from "zustand";

// type dataUserManual = {
//   idUser: string;
//   role: string;
//   typeAccount: string;
// };

// type dataUserGoogle = {
//   classes: string;
//   email: string;
//   idUser: string;
//   name: string;
//   nis: number;
//   noTlp: string;
//   picture: string;
//   role: string;
//   typeAccount: string;
// };

type dataUserFromGoogleHasNotFilled = {
  classes: string;
  nis: number;
  noTlp: string;
};

type GetIdUsersState = {
  idUser: string;
  role: string;
  hasNotFilled: dataUserFromGoogleHasNotFilled | null;
  typeAccount: string;
  isLoading: boolean;
  message: string;
  setHandleGetIdUsers: () => Promise<void>;
};

export const useGetIdUsers = create<GetIdUsersState>((set) => ({
  idUser: "",
  role: "",
  hasNotFilled: null,
  typeAccount: "",
  isLoading: false,
  message: "",

  setHandleGetIdUsers: async () => {
    try {
      set({ isLoading: true });
      const request = await fetch(`/api/auth/decodeToken`, {
        credentials: "include",
      });
      const response = await request.json();

      if (!response.success) {
        set({
          idUser: "",
          isLoading: false,
          message: response.message,
        });
      }

      if (response.role === "pengajar") {
        set({
          idUser: response.data.idTeacher,
          role: response.data.role,
          isLoading: false,
          message: "ID berhasil di ambil",
        });
      }

      set({
        idUser: response.data.idStudent,
        role: response.data.role,
        typeAccount: response.data.typeAccount,
        hasNotFilled: {
          classes: response.data.classes,
          nis: response.data.nis,
          noTlp: response.data.noTlp,
        },
        isLoading: false,
        message: "ID berhasil di ambil",
      });
    } catch {
      set({
        idUser: "",
        isLoading: false,
        message: "Gagal decode token / token tidak valid",
      });
    }
  },
}));
