import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleDecodeTokenJWT } from "@/src/services/mysql/auth/login";
import { handleGetDataUser } from "@/src/services/mysql/student/data-student";

export async function GET(req: NextRequest) {
  try {
    const tokenFromGoogle = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (tokenFromGoogle) {
      const idStudent = tokenFromGoogle.idStudent;

      if (tokenFromGoogle.role !== "student" || typeof idStudent !== "string") {
        return NextResponse.json(
          {
            success: false,
            status: 401,
            message: "Data akun Google tidak valid",
          },
          { status: 401 },
        );
      }

      const user = await handleGetDataUser(idStudent, "siswa");
      if (!user.success || !user.data) {
        return NextResponse.json(
          { success: false, status: 404, message: user.message },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        status: 200,
        message: "Berhasil Decode Token",
        data: user.data,
        role: user.data?.role,
        expired: tokenFromGoogle.exp,
      });
    }

    const cookieStore = await cookies();
    const tokenJWTFromLoginDefaultCookies =
      cookieStore.get("loginSession")?.value;

    if (!tokenJWTFromLoginDefaultCookies) {
      return NextResponse.json(
        {
          success: false,
          status: 401,
          message: "Token tidak ada, silahkan login terlebih dahulu",
        },
        { status: 401 },
      );
    }

    const session = await handleDecodeTokenJWT(tokenJWTFromLoginDefaultCookies);

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
