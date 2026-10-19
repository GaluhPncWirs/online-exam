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
  type_account: "default" | "google";
};

type ResultUserLogin = {
  success: boolean;
  message: string;
  status: number;
  data?: UserLoginRow;
  token?: string;
};

type TokenJWT = {
  idUser: string;
  typeAccount: "default" | "google";
  role: "siswa" | "guru";
};

export async function handleUserLogin({
  role,
  email,
  password,
}: PropsUserLogin): Promise<ResultUserLogin> {
  try {
    const query =
      role === "siswa"
        ? `SELECT id_student, type_account
           FROM account_students
           WHERE email = ? AND password = ?
           LIMIT 1`
        : `SELECT id_teacher, type_account
           FROM account_teacher
           WHERE email = ? AND password = ?
           LIMIT 1`;

    const [rows] = await pool.execute<UserLoginRow[]>(query, [email, password]);

    const user = rows[0];

    if (!user) {
      return {
        success: false,
        status: 401,
        message: "Email atau password salah",
      };
    }

    const idUser = role === "siswa" ? user.id_student : user.id_teacher;

    if (!idUser) {
      return {
        success: false,
        status: 401,
        message: "Data akun tidak valid",
      };
    }

    const token: TokenJWT = {
      idUser,
      typeAccount: user.type_account,
      role,
    };

    const tokenJWT = jwt.sign(token, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    });

    return {
      success: true,
      status: 200,
      message: "Berhasil masuk, Selamat datang kembali",
      data: user,
      token: tokenJWT,
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
