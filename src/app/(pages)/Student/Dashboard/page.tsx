import MainContent from "@/src/layout/mainContent/content";
import DashboardClient from "@/components/local/dashboardSiswa/dashboardClient";
import { cookies } from "next/headers";

export default async function DashboardStudent() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await fetch(`http://localhost:3000/api/auth/decodeToken`, {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data user");
  }

  const dataUser = await response.json();

  console.log("Data user dashboard:", dataUser);

  return (
    <div>test</div>
    // <MainContent>
    //   {/* <DashboardClient /> */}
    // </MainContent>
  );
}
