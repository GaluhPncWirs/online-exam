import { NextResponse } from "next/server";
import { handleUserLogin } from "@/src/services/mysql/data-student";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const userLogin = await handleUserLogin({
      role: body.valueTypeAccount,
      email: body.valueEmail,
      password: body.valuePassword,
    });

    if (!userLogin.success) {
      return NextResponse.json({
        success: false,
        status: userLogin.status,
        message: userLogin.message,
      });
    }

    const res = NextResponse.json({
      success: true,
      status: userLogin.status,
      tipe: userLogin.data?.type_account,
      message: userLogin.message,
    });

    if (userLogin.token) {
      res.cookies.set("loginSession", userLogin.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }
    return res;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
}
