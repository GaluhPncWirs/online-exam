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
      <div className="min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col">
          <ListSidebar />
        </aside>

        {/* Main Content */}
        <main className="min-h-screen md:ml-64">
          {/* Page Content */}
          <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
