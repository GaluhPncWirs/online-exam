"use client";
import FooterComponent from "@/components/global/footer/footerComp";
import NavigasiBar from "@/components/global/navigasiBar/navbar";
import { useGetIdUsers } from "@/src/store/useGetIdUsers/state";
import React, { useEffect } from "react";

export default function Homepage({ children }: React.PropsWithChildren) {
  const getidUsers = useGetIdUsers((state) => state.setHandleGetIdUsers);
  useEffect(() => {
    getidUsers();
  }, []);
  return (
    <main>
      <NavigasiBar />
      <div className="pt-14">{children}</div>
      <FooterComponent />
    </main>
  );
}
