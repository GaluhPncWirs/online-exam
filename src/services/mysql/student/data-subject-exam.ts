"server-only";
import { MAX_PAGE_SIZE } from "@/src/lib/constants";
import { pool } from "@/src/lib/db";
import { generateRandomId } from "@/src/lib/utils/generateRandomId";
import { parseJsonColumn } from "@/src/lib/utils/parseJSONColumn";
import { queryRows } from "@/src/lib/utils/queryPool";
import {
  EssayQuestion,
  MultipleChoiceQuestion,
} from "@/src/types/dataExam";
import { ScheduleExams } from "@/src/types/student/dataExams";
import { ResultSetHeader, RowDataPacket } from "mysql2";

type ScheduleExamsRow = RowDataPacket & ScheduleExams;

export async function handleGetDataSubjectExams(
  className: string,
  idStudent: string,
  from: number = 0,
  to: number = 9,
) {
  const offset = Number.isFinite(from) ? Math.max(0, Math.floor(from)) : 0;
  const lastIndex = Number.isFinite(to)
    ? Math.max(offset, Math.floor(to))
    : offset + 9;
  const limit = Math.min(lastIndex - offset + 1, MAX_PAGE_SIZE);

  const query = `
    SELECT
      me.id_manage_exam,
      me.id_teacher,
      me.id_subject,
      me.exam_date,
      JSON_OBJECT(
        'start', me.exam_start_at,
        'end', me.exam_end_at
      ) AS deadline_exam,
      account_teacher.fullname,
      subject_exam.name_exam,
      he.id_history_exam,
      ? AS id_student,
      COALESCE(he.status_exam, 0) AS status_exam,
      COALESCE(he.result_exam, 'pending') AS result_exam,
      he.created_at AS history_created_at
    FROM manage_exams AS me
    JOIN account_teacher
      ON me.id_teacher = account_teacher.id_teacher
    JOIN subject_exam
      ON me.id_subject = subject_exam.id_subject
    JOIN classes AS c
      ON c.id = me.class_id
    LEFT JOIN history_exams AS he
      ON he.id_history_exam = (
        SELECT h2.id_history_exam
        FROM history_exams AS h2
        WHERE h2.id_subject = me.id_subject
          AND h2.class_id = me.class_id
          AND h2.id_student = ?
        ORDER BY h2.created_at DESC, h2.id_history_exam DESC
        LIMIT 1
      )
    WHERE c.name = ?
    ORDER BY me.created_at DESC, me.id_manage_exam DESC
    LIMIT ? OFFSET ?
  `;

  try {
    const data = await queryRows<ScheduleExamsRow[]>(query, [
      idStudent,
      idStudent,
      className,
      limit,
      offset,
    ]);

    if (data.length === 0) {
      return {
        data: [],
        success: false,
        message: "Data ujian tidak di temukan",
      };
    }

    return {
      data,
      success: true,
      message: "Berhasil mengambil data ujian",
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      data: [],
      success: false,
      message: "Gagal mengambil data ujian",
    };
  }
}

export async function handleGetDataResultExamPerClass(idStudent: string) {
  const query = `
    SELECT
      he.id_student,
      he.id_subject,
      he.result_exam,
      c.name AS class
    FROM history_exams AS he
    LEFT JOIN classes AS c
      ON c.id = he.class_id
    WHERE he.id_student = ?
  `;

  try {
    const [rows] = await pool.execute(query, [idStudent]);

    return {
      data: rows,
      success: true,
      message: "Berhasil mengambil data hasil ujian",
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data hasil ujian",
    };
  }
}

type PropsHandleLateExam = {
  id_student: string;
  id_subject: string;
  className: string;
};

export async function handleLateExam({
  id_student,
  id_subject,
  className,
}: PropsHandleLateExam) {
  const query = `
    INSERT INTO history_exams (
      id_history_exam,
      id_student,
      id_subject,
      answer_student,
      result_exam,
      status_exam,
      class_id
    )
    SELECT ?, ?, ?, ?, ?, ?, c.id
    FROM manage_exams AS me
    JOIN classes AS c
      ON c.id = me.class_id
    WHERE c.name = ?
      AND me.id_subject = ?
      AND TIMESTAMP(DATE(me.exam_date), me.exam_end_at) <= NOW()
      AND NOT EXISTS (
        SELECT 1
        FROM history_exams
        WHERE id_student = ? AND id_subject = ?
      )
  `;

  const alreadySaved = {
    success: true,
    status: 200,
    alreadySaved: true,
    message: "Data sudah tersimpan sebelumnya",
  };

  const generateIdHistoryExam = generateRandomId(7, "HIS");

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      generateIdHistoryExam,
      id_student,
      id_subject,
      null,
      "telat",
      true,
      className,
      id_subject,
      id_student,
      id_subject,
    ]);

    if (result.affectedRows === 0) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `
          SELECT
            EXISTS (
              SELECT 1
              FROM history_exams
              WHERE id_student = ? AND id_subject = ?
            ) AS already_saved
        `,
        [id_student, id_subject],
      );

      if (rows[0]?.already_saved) return alreadySaved;

      return {
        success: false,
        status: 409,
        message: "Tenggat ujian belum berakhir atau jadwal tidak ditemukan",
      };
    }

    return {
      success: true,
      status: 201,
      alreadySaved: false,
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
      return alreadySaved;
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
  page: number = 1,
  limit: number = 10,
) {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit) || 10));

  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit - 1;
  const jsonPath = `$[${start} to ${end}]`;

  const query = `
    SELECT 
      se.name_exam, se.type_exam, se.exam_questions, JSON_EXTRACT(se.exam_questions, ?) AS exam_questions,
      he.answer_student, JSON_LENGTH(se.exam_questions) AS total_questions
    FROM subject_exam AS se
    JOIN history_exams AS he
      ON se.id_subject = he.id_subject
    WHERE 
      se.id_subject = ? AND he.id_student = ?
    LIMIT 1
  `;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      jsonPath,
      id_subject,
      id_student,
    ]);

    if (rows.length === 0) {
      return { success: false, message: "Ujian tidak ditemukan" };
    }

    const row = rows[0];
    const totalItems = Number(row.total_questions ?? 0);
    const totalPages = Math.ceil(totalItems / safeLimit);

    if (totalPages > 0 && safePage > totalPages) {
      return {
        success: false,
        message: "Halaman tidak ditemukan",
      };
    }

    return {
      data: {
        name_exam: row.name_exam,
        type_exam: row.type_exam,
        exam_questions: parseJsonColumn<
          Array<MultipleChoiceQuestion | EssayQuestion>
        >(row.exam_questions, []),
        answer_student: parseJsonColumn<Record<string, string>>(
          row.answer_student,
          {},
        ),
      },
      pagination: {
        page: safePage,
        limit: safeLimit,
        total_items: totalItems,
        total_pages: totalPages,
        has_next: safePage < totalPages,
        has_prev: safePage > 1,
      },
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
      me.duration_exam,
      me.id_subject,
      c.name AS class,
      se.exam_questions,
      se.name_exam,
      se.type_exam
    FROM manage_exams AS me
    JOIN subject_exam AS se
      ON me.id_subject = se.id_subject
    JOIN classes AS c
      ON c.id = me.class_id
    WHERE me.id_subject = ? AND c.name = ?
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
  const query = `
    INSERT INTO history_exams (
      id_history_exam,
      id_student,
      id_subject,
      answer_student,
      result_exam,
      status_exam,
      class_id
    )
    SELECT ?, ?, ?, ?, ?, ?, c.id
    FROM classes AS c
    WHERE c.name = ?
  `;

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

export async function handleValidateStartExam(
  id_subject: string,
  id_student: string,
) {
  const query = `
    SELECT 
      id_student, status_exam, result_exam
    FROM history_exams
    WHERE 
      id_subject = ? AND id_student = ?
    LIMIT 1
  `;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [
      id_subject,
      id_student,
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
