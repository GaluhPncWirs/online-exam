import { Button } from "@/components/ui/button";
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
import { useHandleLogout } from "@/hooks/getHandleLogout";
import { useGetIdUsers } from "@/src/store/useGetIdUsers/state";
import Link from "next/link";

export default function ButtonAutentications() {
  const getidUsers = useGetIdUsers((state) => state.idUser);
  const handleLogout = useHandleLogout();
  return (
    <>
      {getidUsers ? (
        <Dialog>
          <DialogTrigger>
            <Button className="bg-blue-400 hover:bg-blue-500 hover:text-slate-200 py-1.5 px-5 rounded-lg cursor-pointer font-semibold text-lg">
              Logout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Keluar Sistem</DialogTitle>
              <DialogDescription className="mt-2">
                Apakah Anda Yakin Ingin Logout Dari Sistem ini ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose>
                <Button variant="secondary">Batal</Button>
              </DialogClose>
              <DialogClose>
                <Button onClick={handleLogout}>Oke</Button>
              </DialogClose>
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
