"use client";
import React, { useEffect } from "react";
import ListSidebar from "@/components/global/listSidebar/content";
import { useGetDataUser } from "@/src/store/useGetDataUsers/state";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

export default function MainContent({ children }: React.PropsWithChildren) {
  const getDataUser = useGetDataUser((state) => state.setGetDataUsers);
  const { isSuccess, message } = useGetDataUser(
    useShallow((state) => ({
      isSuccess: state.isSuccess,
      message: state.message,
    })),
  );

  useEffect(() => {
    getDataUser();
  }, []);

  if (!isSuccess) {
    toast.error("Error", {
      description: message,
    });
    return;
  }

  return (
    <div>
      {/* <DialogFormAddDataUser idUsers={idUsers} /> */}
      <div className="relative mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-0 z-40 hidden h-screen w-72 shrink-0 overflow-y-auto border-x border-slate-200 bg-white md:flex md:flex-col">
          <ListSidebar />
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
