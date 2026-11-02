import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useHandleLogout } from "@/hooks/useHandleLogout";
import { useGetDataUser } from "@/src/store/useGetDataUsers/state";
import Link from "next/link";

export default function ButtonAutentications() {
  const dataUser = useGetDataUser((state) => state.dataUser);
  const handleLogout = useHandleLogout();
  return (
    <>
      {dataUser ? (
        <Dialog>
          <DialogTrigger className="bg-blue-400 hover:bg-blue-500 hover:text-slate-200 py-1.5 px-5 rounded-lg cursor-pointer font-semibold text-lg">
            Logout
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Keluar Sistem</DialogTitle>
              <DialogDescription className="mt-2">
                Apakah Anda Yakin Ingin Logout Dari Sistem ini ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose>Batal</DialogClose>
              <DialogClose onClick={handleLogout}>Oke</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <Link
            href="/Auth/Daftar"
            className="border border-blue-600 hover:text-blue-500 py-1.5 px-5 rounded-md cursor-pointer font-semibold"
          >
            Daftar
          </Link>
          <Link
            href="/Auth/Login"
            className="border-white border bg-blue-500 hover:bg-blue-400 py-1.5 px-5 rounded-lg cursor-pointer font-semibold text-white"
          >
            Login
          </Link>
        </>
      )}
    </>
  );
}
