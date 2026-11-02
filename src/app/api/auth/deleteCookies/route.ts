import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("loginSession");
  cookieStore.delete("next-auth.session-token");

  return NextResponse.json({
    status: 200,
    message: "Logout Telah Berhasil",
  });
}
