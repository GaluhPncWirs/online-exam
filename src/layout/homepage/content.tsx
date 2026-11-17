import FooterComponent from "@/components/global/footer/footerComp";
import NavigasiBar from "@/components/global/navigasiBar/navbar";

export default function Homepage({ children }: React.PropsWithChildren) {
  return (
    <main>
      <NavigasiBar />
      <div className="pt-14">{children}</div>
      <FooterComponent />
    </main>
  );
}
