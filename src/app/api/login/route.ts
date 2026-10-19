// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { valueEmail, valuePassword, valueTypeAccount } = await req.json();

//   // if (valueTypeAccount === "siswa") {
//   //   const { data: dataStudent, error }: any = await supabase
//   //     .from("account-student")
//   //     .select("idStudent,typeAccount")
//   //     .eq("email", valueEmail)
//   //     .eq("password", valuePassword)
//   //     .single();
//   //   if (error) {
//   //     return NextResponse.json({
//   //       success: false,
//   //       status: 401,
//   //       message: "Email dan Password Salah Input Kembali",
//   //     });
//   //   }
//   //   const token = jwt.sign(
//   //     {
//   //       idStudent: dataStudent.idStudent,
//   //       typeAccount: dataStudent.typeAccount,
//   //       role: "pelajar",
//   //     },
//   //     process.env.JWT_SECRET || "mySecretKey123",
//   //     { expiresIn: "3h" },
//   //   );

//   //   const res = NextResponse.json({
//   //     success: true,
//   //     tipe: valueTypeAccount,
//   //     message: "Masuk Akun Berhasil",
//   //   });

//   //   res.cookies.set("tokenLogin", token, {
//   //     httpOnly: true,
//   //     secure: true,
//   //     sameSite: "strict",
//   //     path: "/",
//   //   });
//   //   return res;
//   // } else if (valueTypeAccount === "guru") {
//   //   const { data: dataTeacher, error }: any = await supabase
//   //     .from("account_teacher")
//   //     .select("id_teacher")
//   //     .eq("email", valueEmail)
//   //     .eq("password", valuePassword)
//   //     .single();
//   //   if (error) {
//   //     return NextResponse.json({
//   //       success: false,
//   //       status: 401,
//   //       message: "Email dan Password Salah Input Kembali",
//   //     });
//   //   }
//   //   const token = jwt.sign(
//   //     {
//   //       idTeacher: dataTeacher.id_teacher,
//   //       role: "pengajar",
//   //     },
//   //     process.env.JWT_SECRET || "mySecretKey123",
//   //     {
//   //       expiresIn: "3h",
//   //     },
//   //   );
//   //   const res = NextResponse.json({
//   //     success: true,
//   //     tipe: valueTypeAccount,
//   //     message: "Masuk Akun Berhasil",
//   //   });
//   //   res.cookies.set("tokenLogin", token, {
//   //     httpOnly: true,
//   //     secure: true,
//   //     sameSite: "strict",
//   //     path: "/",
//   //   });
//   //   return res;
//   // } else {
//   //   console.log("jenis akun belum dipilih");
//   // }
//   return NextResponse.json({
//     success: false,
//     status: 401,
//     message: "Gagal Fetch Api Autentikasi",
//   });
// }

export async function GET() {
  try {
    const [rows] = await pool.execute(
      "SELECT id_student, fullname, email, created_at FROM account_students ORDER BY created_at DESC",
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Gagal mengambil data akun", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data" },
      { status: 500 },
    );
  }
}
