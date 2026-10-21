import { pool } from "@/src/lib/db";
import { generateRandomId } from "@/src/lib/utils/generateRandomId";

export async function handleGetDataSubjectExams(
  className: string,
  idStudent: string,
) {
  const query = `
    SELECT
      me.id_manage_exam, me.id_teacher, me.id_subject, me.id_history_exam, me.deadline_exam,
      account_teacher.fullname,
      subject_exam.name_exam,
      history_exams.id_student,
      history_exams.status_exam,
      history_exams.created_at,
      history_exams.result_exam
    FROM manage_exams AS me
    JOIN account_teacher
      ON me.id_teacher = account_teacher.id_teacher
    JOIN subject_exam
      ON me.id_subject = subject_exam.id_subject
    JOIN history_exams
      ON me.id_history_exam = history_exams.id_history_exam
    WHERE me.class = ?
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

type PropsHandleLateExam = {
  id_student: string;
  id_subject: string;
  result_exam: string;
  status_exam: boolean;
  className: string;
};

type ResultHandleLateExam = {
  success: boolean;
  status: number;
  message: string;
};

export async function handleLateExam({
  id_student,
  id_subject,
  result_exam,
  status_exam,
  className,
}: PropsHandleLateExam) {
  const query = `
    INSERT 
      INTO history_exams (id_history_exam, id_student, id_subject, answer_student, result_exam, status_exam, class) 
    VALUES
      (?, ?, ?, ?, ?, ?, ?) 
    WHERE 
      id_student = ? AND id_subject = ?
  `;

  const generateIdHistoryExam = generateRandomId(7, "HIS");

  try {
    await pool.execute(query, [
      generateIdHistoryExam,
      id_student,
      id_subject,
      null,
      result_exam,
      status_exam,
      className,
    ]);

    return {
      success: true,
      status: 201,
      message: "Data berhasil tersimpan",
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
        message: "Data sudah ada tidak boleh terduplikat",
      };
    }

    return {
      success: false,
      status: 500,
      message: "Error terhubung kedalam database",
    };
  }
}
