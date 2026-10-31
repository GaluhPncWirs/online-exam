import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, LayoutDashboard, LogOut, User2 } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
import { useGetDataUser } from "@/src/store/useGetDataUsers/state";

export default function ListSidebar() {
  const dataUser = useGetDataUser((state) => state.dataUser);
  const pathName = usePathname();
  return (
    <div className="flex flex-1 flex-col px-4 py-7">
      <Link
        href={
          dataUser?.role.includes("student")
            ? "/Student/Dashboard"
            : dataUser?.role.includes("teacher")
              ? "/Teacher/dashboard"
              : "/"
        }
      >
        <Image
          src="/images/global/logo.png"
          alt="ExamOnline"
          width={400}
          height={400}
          className="w-52 object-contain"
        />
      </Link>
      <p className="px-3 pt-3 md:pt-8 text-xs font-bold uppercase tracking-wider text-slate-400">
        Menu
      </p>
      <nav className="flex flex-col justify-between gap-1 h-full mt-2 md:mt-5">
        <div className="grid grid-cols-3 md:grid-cols-1 gap-1">
          <Link
            href={
              dataUser?.role.includes("student")
                ? "/Student/Dashboard"
                : dataUser?.role.includes("teacher")
                  ? "/Teacher/dashboard"
                  : "/"
            }
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
              pathName.includes("Dashboard") || pathName.includes("dashboard")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-blue-100">
              <LayoutDashboard className="size-5" />
            </div>

            <span>Dashboard</span>
          </Link>

          <Link
            href={
              dataUser?.role.includes("student")
                ? "/Student/Profile"
                : dataUser?.role.includes("teacher")
                  ? "/Teacher/Profile"
                  : "/"
            }
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
              pathName.includes("Profile")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-blue-100">
              <User2 className="size-5" />
            </div>

            <span>Profil</span>
          </Link>

          <Link
            href="/Introduction"
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
              pathName === "/Introduction"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-blue-100">
              <Home className="size-5" />
            </div>

            <span>Beranda</span>
          </Link>
        </div>

        <Dialog>
          <DialogTrigger className="flex items-center border border-slate-200 rounded-md gap-3 text-sm font-semibold justify-center py-3 hover:bg-blue-100">
            <LogOut className="size-5" />
            Logout
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Logout Akun</DialogTitle>
              <DialogDescription>
                Apakah anda ingin keluar dari sistem ini?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                onClick={useHandleLogout()}
              >
                <LogOut className="size-5" />
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </div>
  );
}
