import { pool } from "@/src/lib/db";

export async function handleGetDataSubjectExams() {
  const query = `
  SELECT 
    manage_exams.*, account_teacher.fullname, subject_exam.name_exam, subject_exam.exam_questions 
  FROM manage_exams 
  LEFT JOIN account_teacher 
    ON manage_exams.id_teacher = account_teacher.id_teacher 
  LEFT JOIN subject_exam 
    ON manage_exams.id_subject = subject_exam.id_subject 
  WHERE manage_exams.class = ?
  `;

  try {
    const [rows] = await pool.execute(query);

    //         if (rows.length=== 0) {
    //   return {
    //     success: false,
    //     message: "Data ujian tidak ditemukan",
    //   };
    // }

    return {
      data: rows,
      success: true,
      message: "Berhasil mengambil data ujian",
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data ujian",
    };
  }
}
