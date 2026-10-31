"use client";
import FooterComponent from "@/components/global/footer/footerComp";
import NavigasiBar from "@/components/global/navigasiBar/navbar";
import { useGetDataUser } from "@/src/store/useGetDataUsers/state";
import React, { useEffect } from "react";

export default function Homepage({ children }: React.PropsWithChildren) {
  const getDataUser = useGetDataUser((state) => state.setGetDataUsers);
  useEffect(() => {
    getDataUser();
  }, []);
  return (
    <main>
      <NavigasiBar />
      <div className="pt-14">{children}</div>
      <FooterComponent />
    </main>
  );
}
