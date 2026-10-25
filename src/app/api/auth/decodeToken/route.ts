import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleDecodeTokenJWT } from "@/src/services/mysql/student/data-student";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const tokenJWTFromLoginDefaultCookies =
    cookieStore.get("loginSession")?.value;
  const tokenFromGoogleCookies = cookieStore.get(
    "next-auth.session-token",
  )?.value;

  if (!tokenJWTFromLoginDefaultCookies && !tokenFromGoogleCookies) {
    return NextResponse.json({
      success: false,
      status: 401,
      message: "Token tidak ada, silahkan login terlebih dahulu",
    });
  }

  try {
    if (tokenFromGoogleCookies) {
      const tokenFromGoogle = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      return NextResponse.json({
        success: true,
        status: 200,
        message: "Berhasil Decode Token",
        data: tokenFromGoogle,
        role: tokenFromGoogle?.role,
        expired: tokenFromGoogle?.exp,
      });
    }

    const session = await handleDecodeTokenJWT(
      tokenJWTFromLoginDefaultCookies!,
    );

    if (!session.success) {
      const response = NextResponse.json(
        { success: false, message: session.message, code: session.code },
        { status: session.status },
      );

      if (
        session.code === "TOKEN_EXPIRED" ||
        session.code === "INVALID_TOKEN"
      ) {
        response.cookies.delete("loginSession");
      }

      return response;
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: session.message,
      data: session.data,
      role: session.role,
      idUser: session.idUser,
    });
  } catch {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Token Gagal Di Decode",
    });
  }
}
