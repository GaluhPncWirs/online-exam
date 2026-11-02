import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";

export async function handleGetDataExams(id_teacher: string) {
  const query = `
        SELECT he.created_at, he.id_student, he.id_subject, he.result_exam, he.status_exam, se.name_exam, se.type_exam, se.id_teacher
        FROM history_exams AS he
        INNER JOIN subject_exam AS se
            ON he.id_subject = se.id_subject
        WHERE se.id_teacher = ? AND he.result_exam = ?
        ORDER BY he.created_at DESC
    `;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      id_teacher,
      "pending",
    ]);

    if (rows.length === 0) {
      return {
        success: false,
        message: "Data ujian tidak ditemukan",
      };
    }

    return {
      success: true,
      message: "Berhasil mengambil data user",
      data: rows,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data user",
    };
  }
}
