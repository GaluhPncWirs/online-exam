import { handleDecodeTokenJWT } from "@/src/services/mysql/data-student";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tokenJWTFromLoginDefaultCookies =
    req.cookies.get("loginSession")?.value;
  const tokenFromGoogleCookies = req.cookies.get(
    "next-auth.session-token",
  )?.value;

  if (!tokenJWTFromLoginDefaultCookies || !tokenFromGoogleCookies) {
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

    const resultDecodeJWT = await handleDecodeTokenJWT(
      tokenJWTFromLoginDefaultCookies,
    );

    return NextResponse.json({
      success: true,
      status: 200,
      message: resultDecodeJWT.message,
      data: resultDecodeJWT.data,
      role: resultDecodeJWT.role,
      idUser: resultDecodeJWT.idUser,
      expired: resultDecodeJWT.expired,
    });
  } catch {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Token Gagal Di Decode",
    });
  }
}
