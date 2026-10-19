"use server";
import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

type PropsUserLogin = {
  role: "student" | "teacher";
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
  status?: number;
  data?: UserLoginRow;
};

export async function handleUserLogin({
  role,
  email,
  password,
}: PropsUserLogin): Promise<ResultUserLogin> {
  try {
    const query =
      role === "student"
        ? "SELECT id_student, type_account FROM account_students WHERE email = ? AND password = ? LIMIT 1"
        : "SELECT id_teacher, type_account FROM account_teacher WHERE email = ? AND password = ? LIMIT 1";

    const [rows] = await pool.execute<UserLoginRow[]>(query, [email, password]);

    const user = rows[0];

    if (!user) {
      return {
        success: false,
        status: 401,
        message: "Email atau password salah",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Berhasil masuk, Selamat datang kembali",
      data: user,
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
