import { pool } from "@/src/lib/db";

export async function handleGetDataSubjectExams(
  className: string,
  idStudent: string,
) {
  const query = `
    SELECT
      manage_exams.*,
      account_teacher.fullname,
      subject_exam.name_exam,
      history_exams.id_student,
      history_exams.status_exam,
      history_exams.created_at,
      history_exams.result_exam
    FROM manage_exams
    JOIN account_teacher
      ON manage_exams.id_teacher = account_teacher.id_teacher
    JOIN subject_exam
      ON manage_exams.id_subject = subject_exam.id_subject
    JOIN history_exams
      ON manage_exams.id_history_exam = history_exams.id_history_exam
    WHERE manage_exams.class = ?
      AND history_exams.id_student = ?
  `;

  try {
    const [rows] = await pool.execute(query, [className, idStudent]);

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
