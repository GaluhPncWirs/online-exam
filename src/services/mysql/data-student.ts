"use server";
import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

type PropsUserLogin = {
  role: "siswa" | "guru";
  email: string;
  password: string;
};

type UserLoginRow = RowDataPacket & {
  id_student?: string;
  id_teacher?: string;
  type_account: string;
};

type ResultUserLogin = {
  success: boolean;
  message: string;
  status: number;
  data?: UserLoginRow;
  token? : string
};

export async function handleUserLogin({
  role,
  email,
  password,
}: PropsUserLogin): Promise<ResultUserLogin> {
  try {
    const query =
      role === "siswa"
        ? `SELECT id_student, role FROM account_students WHERE email = ? AND password = ? LIMIT 1`
        : `SELECT id_teacher, role FROM account_teacher WHERE email = ? AND password = ? LIMIT 1`;

    const [rows] = await pool.execute<UserLoginRow[]>(query, [email, password]);

    const user = rows[0];

    if (!user) {
      return {
        success: false,
        status: 401,
        message: "Email atau password salah",
      };
    }

        const token = jwt.sign(
      {
        idUser: user[],
        typeAccount: userLogin.data?.type_account,
        role: "pelajar",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "3h" },
    );

    return {
      success: true,
      status: 200,
      message: "Berhasil masuk, Selamat datang kembali",
      data: user,
      token
    };
  } catch (error) {
    console.error("Gagal mengambil data akun", error);
    return {
      success: false,
      status: 500,
      message: "Error terhubung kedalam database",
    };
  }
}
