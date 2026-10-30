import { pool } from "@/src/lib/db";
import { generateRandomId } from "@/src/lib/utils/generateRandomId";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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
    SELECT ?, ?, ?, ?, ?, ?, ?
    FROM DUAL
    WHERE NOT EXISTS (
      SELECT 1 
      FROM history_exams
      WHERE id_student = ? AND id_subject = ?
    )
  `;

  const generateIdHistoryExam = generateRandomId(7, "HIS");

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      generateIdHistoryExam,
      id_student,
      id_subject,
      null,
      result_exam,
      status_exam,
      className,
      // parameter untuk NOT EXISTS
      id_student,
      id_subject,
    ]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        status: 400,
        message: "Data sudah tersimpan sebelumnya",
      };
    }

    return {
      success: true,
      status: 201,
      message: "Data berhasil tersimpan",
    };
  } catch (error) {
    // Pengaman jika dua request masuk bersamaan (race condition)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return {
        success: false,
        status: 400,
        message: "Data sudah tersimpan sebelumnya",
      };
    }

    console.error(error);

    return {
      success: false,
      status: 500,
      message: "Error terhubung kedalam database",
    };
  }
}

export async function handleGetDataResultExam(
  id_subject: string,
  id_student: string,
) {
  const query = `
    SELECT 
      history_exams.answer_student, subject_exam.name_exam, subject_exam.type_exam, subject_exam.exam_questions 
    FROM subject_exam
    JOIN history_exams
      ON subject_exam.id_subject = history_exams.id_subject
    WHERE 
      subject_exam.id_subject = ? AND history_exams.id_student = ?
  `;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      id_subject,
      id_student,
    ]);
    const dataResultExam = rows[0];

    return {
      data: dataResultExam,
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

export async function handleGetExams(id_subject: string, className: string) {
  const query = `
    SELECT 
      me.duration_exam, me.id_subject, me.class, se.exam_questions, se.name_exam, se.type_exam
    FROM manage_exams AS me
    JOIN subject_exam AS se
      ON me.id_subject = se.id_subject
    WHERE 
      me.id_subject = ? AND me.class = ?
    LIMIT 1
  `;

  if (!id_subject) {
    return {
      data: [],
      success: false,
      message: "Tidak ada id ujian!",
    };
  }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      id_subject,
      className,
    ]);

    return {
      data: rows[0],
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

type PropsHandleSaveExam = {
  id_student: string;
  id_subject: string;
  answer_student: Record<string, string>;
  result_exam: string;
  status_exam: boolean;
  className: string;
};

export async function handleSaveResultExam({
  id_student,
  id_subject,
  answer_student,
  result_exam,
  status_exam,
  className,
}: PropsHandleSaveExam) {
  const query = `INSERT INTO history_exams (id_history_exam, id_student, id_subject, answer_student, result_exam, status_exam, class) VALUES ?,?,?,?,?,?,?`;

  const generateIdHistoryExam = generateRandomId(7, "HIS");

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      generateIdHistoryExam,
      id_student,
      id_subject,
      answer_student,
      result_exam,
      status_exam,
      className,
    ]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        status: 400,
        message: "Data sudah tersimpan sebelumnya",
      };
    }

    return {
      success: true,
      status: 201,
      message: "Data ujian berhasil tersimpan",
    };
  } catch (error) {
    // Pengaman jika dua request masuk bersamaan (race condition)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return {
        success: false,
        status: 400,
        message: "Data sudah tersimpan sebelumnya",
      };
    }

    console.error(error);

    return {
      success: false,
      status: 500,
      message: "Error terhubung kedalam database",
    };
  }
}
