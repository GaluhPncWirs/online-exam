import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { handleUserLogin } from "@/src/services/mysql/data-student";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.valueTypeAccount === "siswa") {
    const userLogin = await handleUserLogin({
      role: body.valueTypeAccount,
      email: body.valueEmail,
      password: body.valuePassword,
    });
    const token = jwt.sign(
      {
        idStudent: userLogin.data?.id_student,
        typeAccount: userLogin.data?.type_account,
        role: "pelajar",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "3h" },
    );

    const res = NextResponse.json({
      success: true,
      status: userLogin.status,
      tipe: userLogin.data?.type_account,
      message: userLogin.message,
    });

    res.cookies.set("loginSession", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    return res;
  } else if (body.valueTypeAccount === "guru") {
    const userLogin = await handleUserLogin({
      role: body.valueTypeAccount,
      email: body.valueEmail,
      password: body.valuePassword,
    });
    const token = jwt.sign(
      {
        idTeacher: userLogin.data?.id_teacher,
        typeAccount: userLogin.data?.type_account,
        role: "pengajar",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "3h",
      },
    );
    const res = NextResponse.json({
      success: true,
      tipe: userLogin.data?.type_account,
      message: userLogin.message,
    });
    res.cookies.set("loginSession", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    return res;
  } else {
    console.log("jenis akun belum dipilih");
  }
  return NextResponse.json({
    success: false,
    status: 401,
    message: "Gagal Fetch Api Autentikasi",
  });
}
