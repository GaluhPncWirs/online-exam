import { DataUser } from "@/src/types/dataUser";
import { create } from "zustand";

type GetDataUsersState = {
  dataUser: DataUser | null;
  message: string;
  isSuccess: boolean;
  setGetDataUsers: () => Promise<void>;
};

export const useGetDataUser = create<GetDataUsersState>((set) => ({
  dataUser: null,
  message: "",
  isSuccess: true,

  setGetDataUsers: async () => {
    try {
      const request = await fetch("/api/auth/decodeToken", {
        credentials: "include",
      });

      const response = await request.json();

      if (!response.success) {
        set({ dataUser: null, message: response.message, isSuccess: false });
        return;
      }

      set({ dataUser: response.data, message: "", isSuccess: true });
    } catch {
      set({
        dataUser: null,
        message: "Data gagal diambil, error pada database",
        isSuccess: false,
      });
      console.log("Data gagal diambil, error pada database");
    }
  },
}));
