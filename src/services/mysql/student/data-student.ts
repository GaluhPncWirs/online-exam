"server-only";
import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";
import { generateRandomId } from "@/src/lib/utils/generateRandomId";

// untuk tambah akun siswa

type PropsUserRegister = {
  fullName: string;
  classes: string;
  email: string;
  password?: string;
  profilImage?: string;
  role?: "student" | "teacher";
  type_account?: "default" | "google";
  id_student?: string;
};

type ResultUserRegister = {
  success: boolean;
  status: number;
  message: string;
};

export async function handleUserRegister({
  fullName,
  classes,
  email,
  id_student,
  password,
  profilImage,
  role,
  type_account,
}: PropsUserRegister): Promise<ResultUserRegister> {
  const idStudent = generateRandomId(7, "STD");

  try {
    const queryClassId = `
      SELECT id
      FROM classes
      WHERE name = ?
      LIMIT 1
    `;

    const [classRows] = await pool.execute<RowDataPacket[]>(queryClassId, [
      classes,
    ]);

    if (!classRows.length) {
      return {
        success: false,
        status: 400,
        message: "Kelas tidak ditemukan.",
      };
    }

    const classId = classRows[0].id;

    const query = `
      INSERT INTO account_students
        (id_student, fullname, class_id, email, password, profil_img, type_account, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [
      id_student ?? idStudent,
      fullName,
      classId,
      email,
      password ?? null,
      profilImage ?? null,
      type_account ?? "default",
      role ?? "student",
    ]);

    return {
      success: true,
      status: 201,
      message: "Berhasil membuat akun. Silakan login.",
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return {
        success: false,
        status: 409,
        message: "Email sudah terdaftar. Gunakan email yang berbeda.",
      };
    }

    console.error("Gagal membuat akun", error);
    return {
      success: false,
      status: 500,
      message: "Error terhubung kedalam database",
    };
  }
}

// untuk ambil data user
export async function handleGetDataUser(
  idUser: string,
  role: "siswa" | "guru",
) {
  const query =
    role === "siswa"
      ? `
        SELECT 
          a.id_student,
          a.created_at,
          a.fullname,
          c.name AS class,
          a.email,
          a.type_account,
          a.role,
          a.nis,
          a.no_tlp,
          a.profil_img
        FROM account_students AS a
        LEFT JOIN classes AS c
          ON c.id = a.class_id
        WHERE a.id_student = ?
        LIMIT 1
      `
      : `
        SELECT id_teacher, created_at, fullname, email, role, teach_role, nisn, no_tlp, profil_img 
        FROM account_teacher 
        WHERE id_teacher = ? 
        LIMIT 1
      `;
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [idUser]);

    if (rows.length === 0) {
      return {
        success: false,
        message: "Data user tidak ditemukan",
      };
    }

    const dataUser = rows[0];

    return {
      success: true,
      message: "Berhasil mengambil data user",
      data: dataUser,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data user",
    };
  }
}

// untuk update data student
type FieldInputUpdateDataStudent = {
  idStudent: string;
  fieldInput: {
    name?: string;
    password?: string;
    noTlp?: string;
  };
};

export async function handleUpdateDataStudent({
  idStudent,
  fieldInput,
}: FieldInputUpdateDataStudent) {
  const fields: string[] = [];
  const values: string[] = [];

  if (fieldInput?.name !== undefined) {
    fields.push("fullname = ?");
    values.push(fieldInput.name);
  }

  if (fieldInput?.password !== undefined) {
    fields.push("password = ?");
    values.push(fieldInput.password);
  }

  if (fieldInput?.noTlp !== undefined) {
    fields.push("no_tlp = ?");
    values.push(fieldInput.noTlp);
  }

  if (fields.length === 0) {
    throw new Error("Tidak ada data yang ingin diperbarui.");
  }

  const query = `UPDATE account_students SET ${fields.join(", ")} WHERE id_student = ?`;

  try {
    await pool.execute(query, [...values, idStudent]);

    return {
      success: true,
      status: 201,
      message: "Berhasil update data kamu.",
    };
  } catch (error) {
    console.error("Gagal update data", error);
    return {
      success: false,
      status: 500,
      message: "Error terhubung kedalam database",
    };
  }
}

export async function handleExistingUserAccount(email: string) {
  type ExistingUserAccount = RowDataPacket & {
    id_student: string;
    email: string;
    nis: string | null;
    no_tlp: string | null;
    type_account: "default" | "google";
    role: "student" | "teacher";
    class: string;
    created_at: Date;
    fullname: string;
    profil_img: string | null;
  };

  const query = `
    SELECT
      student.id_student,
      student.email,
      student.nis,
      student.no_tlp,
      student.type_account,
      student.role,
      student.fullname,
      student.created_at,
      student.profil_img,
      c.name AS class
    FROM account_students AS student
    INNER JOIN classes AS c
      ON student.class_id = c.id
    WHERE student.email = ?
    LIMIT 1
  `;

  try {
    const [rows] = await pool.execute<ExistingUserAccount[]>(query, [email]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Gagal mengambil data akun Google", error);
    throw error;
  }
}
