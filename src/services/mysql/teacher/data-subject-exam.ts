"server-only";
import { pool } from "@/src/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ExamSchema, SchemaExamQuestion } from "@/src/schemas/addDataExam";
import { getMysqlErrorCode } from "@/src/lib/utils/errorMysql";
import { generateRandomId } from "@/src/lib/utils/generateRandomId";
import {
  ExamScheduleListParsed,
  examScheduleListSchema,
  ExamScheduleParsed,
  examScheduleSchema,
} from "@/src/schemas/manageDataExam";
import {
  findConflict,
  lockClasses,
  ScheduleConflictError,
} from "@/src/repositories/findConfictExam";
import { withTransaction } from "@/src/repositories/transaction";
import { queryRows } from "@/src/lib/utils/queryPool";
import {
  Choice,
  EssayQuestion,
  MultipleChoiceQuestion,
} from "@/src/types/dataExam";

export async function handleGetDataResultExamsPending(id_teacher: string) {
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

    // if (rows.length === 0) {
    //   return {
    //     success: false,
    //     message: "Data ujian tidak ditemukan",
    //   };
    // }

    return {
      success: true,
      message: rows.length
        ? "Berhasil mengambil data ujian"
        : "Belum ada ujian pending",
      data: rows,
    };
  } catch (error) {
    console.error("Error handleGetDataResultExamsPending:", error);
    return {
      success: false,
      message: "Gagal mengambil data guru",
    };
  }
}

type ManagedClassRow = RowDataPacket & {
  class_id: number;
};

type HistoryScoreRow = RowDataPacket & {
  result_exam: string | number | null;
};

type ClassRow = RowDataPacket & {
  id: number;
  name: string;
};

export async function handleGetStatisticsStudent(id_teacher: string) {
  const queryManagedExams = `
    SELECT DISTINCT me.class_id 
    FROM manage_exams AS me
    INNER JOIN classes AS c
      ON me.class_id = c.id
    WHERE id_teacher = ?
  `;

  const queryHistoryExams = `
    SELECT he.result_exam
    FROM history_exams AS he
    INNER JOIN subject_exam AS se
      ON he.id_subject = se.id_subject
    WHERE se.id_teacher = ?
  `;

  const queryStudent = `
    SELECT DISTINCT a.id_student
    FROM account_students AS a
    WHERE a.class_id IN (?)
  `;

  try {
    const [[managedExams], [historyExams]] = await Promise.all([
      pool.query<ManagedClassRow[]>(queryManagedExams, [id_teacher]),
      pool.query<HistoryScoreRow[]>(queryHistoryExams, [id_teacher]),
    ]);

    const classes = managedExams
      .map((row) => row.class_id)
      .filter(
        (value): value is number => value !== null && value !== undefined,
      );

    let jumlahSiswa = 0;

    if (classes.length > 0) {
      const [students] = await pool.query<StudentRow[]>(queryStudent, [
        classes,
      ]);
      jumlahSiswa = students.length;
    }

    const examScores = historyExams
      .map((item) => item.result_exam)
      .filter(
        (value) =>
          value !== null &&
          value !== "" &&
          value !== "pending" &&
          value !== "telat",
      )
      .map(Number)
      .filter(Number.isFinite);

    const averageValueExam =
      examScores.length > 0
        ? examScores.reduce((sum, val) => sum + val, 0) / examScores.length
        : 0;

    return {
      success: true,
      data: { jumlahSiswa, averageValueExam },
    };
  } catch (error) {
    console.error("Error mengambil statistik:", error);

    return {
      success: false,
      message: "Gagal mengambil statistik",
      data: { jumlahSiswa: 0, averageValueExam: 0 },
    };
  }
}

type ManagedExamRow = RowDataPacket & {
  created_at: Date;
  class: string;
  class_id: number;
  id_subject: string;
  exam_date: Date;
  exam_start_at: string;
  exam_end_at: string;
  deadline_exam: Date;
  name_exam: string | null;
};

type HistoryExamRow = RowDataPacket & {
  id_subject: string;
  id_student: string;
  class: string;
  result_exam: unknown;
};

type StudentRow = RowDataPacket & {
  class: string;
  class_id: number;
  id_student: string;
};

type CountRow = RowDataPacket & {
  total: number;
};

export async function handleGetDataManageExams(
  id_teacher: string,
  from: number,
  to: number,
) {
  // offset
  const limit = to - from + 1;
  const offset = from;

  const queryManageExams = `
    SELECT me.id_manage_exam, me.created_at, c.name AS class, me.class_id, me.id_subject, me.exam_date, me.exam_start_at, me.exam_end_at, me.is_manage_exam, se.name_exam, se.type_exam
    FROM manage_exams AS me
    LEFT JOIN classes AS c
      ON c.id = me.class_id
    LEFT JOIN subject_exam AS se
      ON me.id_subject = se.id_subject
    WHERE me.id_teacher = ?
    ORDER BY me.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const queryCountRows = `
    SELECT COUNT(*) AS total 
    FROM manage_exams 
    WHERE id_teacher = ?
  `;

  const queryHistoryExams = `
    SELECT h.id_subject, h.id_student, c.name AS class, h.result_exam
    FROM history_exams AS h
    LEFT JOIN classes AS c
      ON c.id = h.class_id
    WHERE h.id_subject IN (?)
      AND h.class_id IN (?)
  `;

  const queryStudent = `
    SELECT c.name AS class, a.class_id, a.id_student
    FROM account_students AS a
    LEFT JOIN classes AS c
      ON c.id = a.class_id
    WHERE a.class_id IN (?)
  `;

  try {
    const [managedExams, countRows] = await Promise.all([
      queryRows<ManagedExamRow[]>(queryManageExams, [
        id_teacher,
        limit,
        offset,
      ]),
      queryRows<CountRow[]>(queryCountRows, [id_teacher]),
    ]);

    const total = Number(countRows?.[0]?.total ?? 0);

    if (!managedExams.length) {
      return { success: true, data: [], total };
    }

    const examIds = [
      ...new Set(managedExams.map((e) => e.id_subject).filter(Boolean)),
    ];
    const classIds = [
      ...new Set(
        managedExams
          .map((e) => e.class_id)
          .filter(
            (value): value is number => value !== null && value !== undefined,
          ),
      ),
    ];

    const [historyExams, students] = await Promise.all([
      queryRows<HistoryExamRow[]>(
        queryHistoryExams,
        [examIds, classIds],
        !examIds.length || !classIds.length,
      ),
      queryRows<StudentRow[]>(queryStudent, [classIds], !classIds.length),
    ]);

    const completeExamMap = new Map<
      string,
      { studentIds: string[]; hasilUjian: unknown[] }
    >();

    historyExams.forEach((item) => {
      const key = `${item.class}_${item.id_subject}`;
      const existing = completeExamMap.get(key);

      if (existing) {
        existing.studentIds.push(item.id_student);
        existing.hasilUjian.push(item.result_exam);
      } else {
        completeExamMap.set(key, {
          studentIds: [item.id_student],
          hasilUjian: [item.result_exam],
        });
      }
    });

    const studentMap = new Map<string, string[]>();

    students.forEach((student) => {
      const key = student.class ?? String(student.class_id);
      const list = studentMap.get(key) ?? [];
      list.push(student.id_student);
      studentMap.set(key, list);
    });

    const mergedData = managedExams.map((exam) => {
      const examHistory = completeExamMap.get(
        `${exam.class}_${exam.id_subject}`,
      );

      return {
        ...exam,
        lengthStudent: studentMap.get(exam.class) ?? [],
        lengthStudentCompleteExams: examHistory?.studentIds ?? [],
        hasil_ujian: examHistory?.hasilUjian ?? [],
      };
    });

    return { success: true, data: mergedData, total };
  } catch (error) {
    console.error("Error mengambil managed exams:", error);

    return {
      success: false,
      message: "Gagal mengambil data ujian",
      data: [],
      total: 0,
    };
  }
}

export async function handleGetDataExam(id_teacher: string) {
  const query = `
    SELECT id_subject, name_exam, type_exam
    FROM subject_exam
    WHERE id_teacher = ?
  `;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id_teacher]);

    if (rows.length === 0) {
      return {
        success: false,
        message: "Data ujian tidak ditemukan",
      };
    }

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "Gagal mengambil data ujian",
    };
  }
}

type PayloadDataExam = {
  id_teacher: string;
  name_exam: string;
  type_exam: "PG" | "ESSAY";
  exam_questions: MultipleChoiceQuestion | EssayQuestion;
};

export async function handleAddDataExam({
  id_teacher,
  name_exam,
  type_exam,
  exam_questions,
}: PayloadDataExam) {
  const parsed = ExamSchema.safeParse({
    id_teacher,
    name_exam,
    type_exam,
    exam_questions,
  });

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Data ujian tidak valid.",
      errors: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  const idSubject = generateRandomId(6, "SUB");

  const query = `
    INSERT INTO subject_exam (id_subject, id_teacher, exam_questions, name_exam, type_exam)
    SELECT ?, ?, CAST(? AS JSON), ?, ?
    FROM DUAL
    WHERE NOT EXISTS (
      SELECT 1 FROM subject_exam
      WHERE id_teacher = ? AND name_exam = ?
    )
  `;

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      idSubject,
      parsed.data.id_teacher,
      JSON.stringify(parsed.data.exam_questions),
      parsed.data.name_exam,
      parsed.data.type_exam,
      id_teacher,
      name_exam,
    ]);

    if (result.affectedRows === 0) {
      return { success: false, status: 409, message: "Soal ujian sudah ada." };
    }

    return {
      success: true,
      status: 201,
      message: "Berhasil membuat soal ujian baru.",
      data: { id_subject: idSubject },
    };
  } catch (error: unknown) {
    const code = getMysqlErrorCode(error);

    if (code === "ER_DUP_ENTRY") {
      return { success: false, status: 409, message: "Soal ujian sudah ada." };
    }
    if (code === "ER_NO_REFERENCED_ROW_2") {
      return {
        success: false,
        status: 400,
        message: "Data guru tidak ditemukan.",
      };
    }

    console.error("Gagal membuat ujian:", error);
    return {
      success: false,
      status: 500,
      message: "Terjadi kesalahan pada server.",
    };
  }
}

export async function handleAddDataExamQuestion(
  payloadAddDataQuestion: unknown,
  id_subject: string,
  id_teacher: string,
) {
  const parsed = SchemaExamQuestion.safeParse(payloadAddDataQuestion);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Data untuk edit ujian tidak valid.",
      errors: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  const query = `
    UPDATE subject_exam 
    SET exam_questions = JSON_ARRAY_APPEND(
      COALESCE(exam_questions, JSON_ARRAY()), '$', CAST(? AS JSON)
    )
    WHERE id_subject = ? AND id_teacher = ?
  `;

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      JSON.stringify(parsed.data),
      id_subject,
      id_teacher,
    ]);

    if (result.affectedRows === 0) {
      return { success: false, status: 404, message: "Ujian tidak ditemukan." };
    }

    return {
      success: true,
      status: 201,
      message: "Berhasil tambah soal ujian.",
      // data: { id: payloadAddDataQuestion?.exam_questions.id },
    };
  } catch (error: unknown) {
    const code = getMysqlErrorCode(error);

    if (code === "ER_DUP_ENTRY") {
      return {
        success: false,
        status: 409,
        message: "Soal ujian sudah ada.",
      };
    }
    console.error("Gagal membuat soal", error);
    return {
      success: false,
      status: 500,
      message: "Terjadi kesalahan pada server.",
    };
  }
}

export async function handleSendExamToStudent(
  teacherId: string,
  exams: ExamScheduleListParsed[],
) {
  const parsed = examScheduleListSchema.safeParse(exams);
  const idManageExam = generateRandomId(6, "MNG");

  if (!parsed.success) {
    return {
      code: "VALIDATION_ERROR",
      errors: parsed.error.issues.map((i) => ({
        row: typeof i.path[0] === "number" ? i.path[0] : null, // posisi di array payload
        field: i.path[1] != null ? String(i.path[1]) : null,
        message: i.message,
      })),
    };
  }

  try {
    const transaction = await withTransaction(pool, async (conn) => {
      await lockClasses(
        conn,
        parsed.data.map((i) => i.class_id),
      );

      const insertIds: number[] = [];
      for (const [index, exam] of parsed.data.entries()) {
        const conflict = await findConflict(
          conn,
          exam.class_id,
          exam.startAt,
          exam.endAt,
        );
        if (conflict) throw new ScheduleConflictError(conflict, index);

        const [res] = await conn.execute<ResultSetHeader>(
          `INSERT INTO manage_exams
           (id_manage_exam, id_teacher, id_subject, class_id, exam_start_at, exam_end_at, duration_exam, is_manage_exam)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            idManageExam,
            teacherId,
            exam.id_subject,
            exam.class_id,
            exam.startAt,
            exam.endAt,
            exam.exam_duration,
            true,
          ],
        );
        insertIds.push(res.insertId);
      }
      return insertIds;
    });

    return {
      success: true,
      status: 201,
      message: "Berhasil kirim soal ujian ke siswa.",
      data: transaction,
    };
  } catch (error: unknown) {
    console.error("Error create exam:", error);

    if (error instanceof ScheduleConflictError) {
      return {
        success: false,
        code: "EXAM_SCHEDULE_CONFLICT",
        message: "Jadwal berbenturan dengan ujian yang sudah terjadwal.",
        conflict: error.conflict,
        status: 409,
      };
    }

    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat menyimpan jadwal ujian.",
      status: 500,
    };
  }
}

export async function handleDeleteExamToStudent(
  idSubject: string,
  idTeacher: string,
) {
  const query = `
    DELETE FROM subject_exam
    WHERE id_subject = ? AND id_teacher = ?
  `;

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      idSubject,
      idTeacher,
    ]);

    if (result.affectedRows === 0) {
      return { success: false, message: "Jadwal ujian tidak ditemukan" };
    }

    return { success: true, message: "Jadwal ujian berhasil dihapus" };
  } catch (error) {
    console.error("Gagal menghapus jadwal ujian:", error);
    return { success: false, message: "Gagal menghapus jadwal ujian" };
  }
}

export async function handleGetDetailExam(
  id_subject: string,
  id_teacher: string,
  page: number = 1,
  limit: number = 10,
) {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit) || 10));

  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit - 1;
  const jsonPath = `$[${start} to ${end}]`;

  const query = `
    SELECT name_exam, type_exam, JSON_LENGTH(exam_questions) AS total_questions, JSON_EXTRACT(exam_questions, ?) AS exam_questions
    FROM subject_exam
    WHERE id_subject = ? AND id_teacher = ?
    LIMIT 1
  `;

  try {
    const [result] = await pool.execute<RowDataPacket[]>(query, [
      jsonPath,
      id_subject,
      id_teacher,
    ]);

    if (result.length === 0) {
      return { success: false, message: "Ujian tidak ditemukan" };
    }

    const row = result[0];
    const totalItems = Number(row.total_questions ?? 0);
    const totalPages = Math.ceil(totalItems / safeLimit);

    const questions =
      typeof row.exam_questions === "string"
        ? JSON.parse(row.exam_questions)
        : (row.exam_questions ?? []);

    return {
      success: true,
      data: {
        name_exam: row.name_exam,
        type_exam: row.type_exam,
        exam_questions: questions,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total_items: totalItems,
          total_pages: totalPages,
          has_next: safePage < totalPages,
          has_prev: safePage > 1,
        },
      },
    };
  } catch (error) {
    console.error("Gagal ambil data ujian:", error);
    return { success: false, message: "Gagal ambil data ujian" };
  }
}

type ExamField =
  | "questions"
  | "correctAnswer"
  | "multipleChoice.choice_a"
  | "multipleChoice.choice_b"
  | "multipleChoice.choice_c"
  | "multipleChoice.choice_d"
  | "multipleChoice.choice_e";

type UpdateExamPayload = {
  id_subject: string;
  id_teacher: string;
  questionId: string;
  updates: Partial<Record<ExamField, unknown>>;
};

export async function handleUpdateQuestionExam(data: UpdateExamPayload) {
  const { id_subject, id_teacher, questionId, updates } = data;

  const entries = Object.entries(updates);

  if (entries.length === 0) {
    return {
      success: false,
      message: "Tidak ada field yang diperbarui",
      status: 400,
    };
  }

  const allowedFields: ExamField[] = [
    "questions",
    "correctAnswer",
    "multipleChoice.choice_a",
    "multipleChoice.choice_b",
    "multipleChoice.choice_c",
    "multipleChoice.choice_d",
    "multipleChoice.choice_e",
  ];

  const serializedUpdates: Array<[ExamField, string]> = [];

  for (const [field, value] of entries) {
    if (!allowedFields.includes(field as ExamField)) {
      return {
        success: false,
        message: `Field ${field} tidak valid`,
        status: 400,
      };
    }

    const serializedValue = JSON.stringify(value);

    if (serializedValue === undefined) {
      return {
        success: false,
        message: `Nilai field ${field} tidak valid`,
        status: 400,
      };
    }

    serializedUpdates.push([field as ExamField, serializedValue]);
  }

  const updateClauses = serializedUpdates
    .map(
      () =>
        "CONCAT(REPLACE(JSON_UNQUOTE(JSON_SEARCH(exam_questions, 'one', ?, NULL, '$[*].id')), '.id', ''), '.', ?), CAST(? AS JSON)",
    )
    .join(", ");

  const updateQuery = `
    UPDATE subject_exam
    SET exam_questions = JSON_SET(
      exam_questions,
      ${updateClauses}
    )
    WHERE id_subject = ?
      AND id_teacher = ?
      AND JSON_SEARCH(
        exam_questions, 'one', ?, NULL, '$[*].id'
      ) IS NOT NULL
  `;

  const params = [
    ...serializedUpdates.flatMap(([field, value]) => [
      questionId,
      field,
      value,
    ]),
    id_subject,
    id_teacher,
    questionId,
  ];

  try {
    const [result] = await pool.execute<ResultSetHeader>(updateQuery, params);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Soal ujian tidak ditemukan",
        status: 404,
      };
    }

    return {
      success: true,
      data: { questionId, updates: Object.fromEntries(entries) },
      message: "Berhasil memperbarui soal ujian",
      status: 200,
    };
  } catch (error) {
    console.error("Gagal memperbarui soal ujian:", error);
    return {
      success: false,
      message: "Gagal memperbarui soal ujian",
      status: 500,
    };
  }
}

export async function handleDeleteQuestionExam(
  idSubject: string,
  idQuestion: string,
  idTeacher: string,
) {
  const query = `
    UPDATE subject_exam
    SET exam_questions = JSON_REMOVE(
    exam_questions,
      REPLACE(
        JSON_UNQUOTE(JSON_SEARCH(exam_questions, 'one', ?, NULL, '$[*].id')),
        '.id',
        ''
      )
    )
    WHERE id_subject = ?
    AND id_teacher = ?
    AND JSON_SEARCH(exam_questions, 'one', ?, NULL, '$[*].id') IS NOT NULL
  `;

  try {
    const [result] = await pool.execute<ResultSetHeader>(query, [
      idQuestion,
      idSubject,
      idTeacher,
      idQuestion,
    ]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Soal ujian tidak ditemukan",
        status: 404,
      };
    }

    return {
      success: true,
      message: "Berhasil menghapus soal ujian",
      status: 200,
    };
  } catch (error) {
    console.error("Gagal menghapus soal ujian:", error);
    return {
      success: false,
      message: "Gagal menghapus soal ujian",
      status: 500,
    };
  }
}

type ResultScoreStudentRow = RowDataPacket & {
  id_student: string;
  fullname: string;
  classes: string | null;
};

type ResultScoreHistoryRow = RowDataPacket & {
  id_student: string;
  id_subject: string;
  name_exam: string | null;
  type_exam: string | null;
  result_exam: string | null;
  status_exam: boolean;
  created_at: Date | null;
};

export async function handleGetDataResultScoreExams(
  id_teacher: string,
  from: number,
  to: number,
) {
  const limit = to - from + 1;
  const offset = from;

  const queryStudents = `
    SELECT a.id_student, a.fullname, c.name AS classes
    FROM account_students AS a
    LEFT JOIN classes AS c
      ON a.class_id = c.id
    ORDER BY a.fullname ASC, a.id_student ASC
    LIMIT ? OFFSET ?
  `;

  const queryCount = `
    SELECT COUNT(*) AS total
    FROM account_students
  `;

  try {
    const [students, countRows] = await Promise.all([
      queryRows<ResultScoreStudentRow[]>(queryStudents, [limit, offset]),
      queryRows<CountRow[]>(queryCount, []),
    ]);

    const total = Number(countRows[0]?.total ?? 0);

    if (!students.length) {
      return { success: true, data: [], total };
    }

    const studentIds = students.map((student) => student.id_student);
    const placeholders = studentIds.map(() => "?").join(", ");
    const queryHistoryExams = `
      SELECT
        he.id_student,
        he.id_subject,
        he.result_exam,
        he.status_exam,
        he.created_at,
        se.name_exam,
        se.type_exam
      FROM history_exams AS he
      INNER JOIN subject_exam AS se
        ON he.id_subject = se.id_subject
      WHERE se.id_teacher = ?
        AND he.id_student IN (${placeholders})
    `;

    const historyExams = await queryRows<ResultScoreHistoryRow[]>(
      queryHistoryExams,
      [id_teacher, ...studentIds],
    );

    const studentResultMap = new Map(
      students.map((student) => [
        student.id_student,
        {
          student_id: student.id_student,
          resultUjian: [] as {
            namaUjian: string | null;
            idUjian: string;
            tipe_ujian: string | null;
            hasil_ujian: string | null;
            status_exam: boolean;
          }[],
          created_at: [] as Date[],
          fullName: student.fullname ?? null,
          classes: student.classes ?? null,
        },
      ]),
    );

    historyExams.forEach((history) => {
      const student = studentResultMap.get(history.id_student);
      if (!student) return;

      student.resultUjian.push({
        namaUjian: history.name_exam ?? null,
        idUjian: history.id_subject,
        tipe_ujian: history.type_exam ?? null,
        hasil_ujian: history.result_exam,
        status_exam: history.status_exam,
      });

      if (history.created_at) {
        student.created_at.push(history.created_at);
      }
    });

    return {
      success: true,
      data: Array.from(studentResultMap.values()),
      total,
    };
  } catch (error) {
    console.error("Gagal mengambil data hasil ujian:", error);
    return {
      success: false,
      message: "Gagal mengambil data hasil ujian",
      data: [],
      total: 0,
    };
  }
}
