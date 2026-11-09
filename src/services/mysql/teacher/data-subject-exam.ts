"server-only";
import { pool } from "@/src/lib/db";
import { TypeExamQuestions } from "@/src/types/dataExam";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ExamQuestion, ExamSchema } from "@/src/schemas/addDataExam";
import { getMysqlErrorCode } from "@/src/lib/utils/errorMysql";
import { generateRandomId } from "@/src/lib/utils/generateRandomId";
import {
  ExamScheduleParsed,
  examScheduleSchema,
} from "@/src/schemas/manageDataExam";
import {
  findConflict,
  lockClasses,
  ScheduleConflictError,
} from "@/src/repositories/findConfictExam";
import { withTransaction } from "@/src/repositories/transaction";

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

async function queryRows<T extends RowDataPacket[]>(
  sql: string,
  params: unknown[],
  skip = false,
) {
  if (skip) return [] as unknown as T;
  const [rows] = await pool.query<T>(sql, params);
  return rows;
}

export async function handleGetDataManageExams(
  id_teacher: string,
  from: number,
  to: number,
) {
  // offset
  const limit = to - from + 1;
  const offset = from;

  const queryManageExams = `
    SELECT me.created_at, c.name AS class, me.class_id, me.id_subject, me.exam_date, me.exam_start_at, me.exam_end_at, se.name_exam, se.type_exam
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
  exam_questions: TypeExamQuestions;
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
  const parsed = ExamQuestion.safeParse(payloadAddDataQuestion);

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

export function handleSendExamToStudent(
  teacherId: string,
  input: ExamScheduleParsed,
) {
  const parsed = examScheduleSchema.parse(input);
  const { startAt, endAt } = parsed;

  try {
    const transaction = withTransaction(pool, async (conn) => {
      await lockClasses(conn, [parsed.class_id]);

      const conflict = await findConflict(
        conn,
        parsed.class_id,
        startAt,
        endAt,
      );
      if (conflict) throw new ScheduleConflictError(conflict);

      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO manage_exams
         (id_teacher, id_subject, class_id, exam_start_at, exam_end_at, duration_exam)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          teacherId,
          parsed.id_subject,
          parsed.class_id,
          startAt,
          endAt,
          parsed.exam_duration,
        ],
      );
      return res.insertId;
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
        code: "EXAM_SCHEDULE_CONFLICT",
        message: "Jadwal berbenturan dengan ujian yang sudah terjadwal.",
        conflict: error.conflict,
        status: 409,
      };
    }
  }
}

// export function updateExam(
//   pool: Pool,
//   teacherId: number,
//   examId: number,
//   input: ExamScheduleInput,
// ) {
//   const startAt = input.exam_start_at;
//   const endAt = addMinutes(startAt, input.exam_duration);

//   return withTransaction(pool, async (conn) => {
//     // 1. Ketahui kelas lama agar bisa dikunci bersama kelas baru
//     const [cur] = await conn.execute<RowDataPacket[]>(
//       "SELECT class_id FROM manage_exams WHERE id = ? AND id_teacher = ?",
//       [examId, teacherId],
//     );
//     if (cur.length === 0)
//       throw new Error("Ujian tidak ditemukan atau bukan milik Anda");
//     const oldClassId = cur[0].class_id;

//     // 2. Kunci kelas lama dan baru (jika guru memindahkan ujian ke kelas lain)
//     await lockClasses(conn, [oldClassId, input.class_id]);

//     // 3. Pastikan ujian tidak dipindah kelas oleh transaksi lain sebelum lock didapat
//     const [again] = await conn.execute<RowDataPacket[]>(
//       "SELECT class_id FROM manage_exams WHERE id = ? FOR UPDATE",
//       [examId],
//     );
//     if (again[0]?.class_id !== oldClassId)
//       throw new Error("Data berubah, silakan coba lagi");

//     // 4. Cek bentrok dengan mengecualikan ujian ini sendiri
//     const conflict = await findConflict(
//       conn,
//       input.class_id,
//       startAt,
//       endAt,
//       examId,
//     );
//     if (conflict) throw new ScheduleConflictError(conflict);

//     await conn.execute(
//       `UPDATE manage_exams
//           SET id_subject = ?, class_id = ?, exam_start_at = ?, exam_end_at = ?, duration_exam = ?
//         WHERE id = ?`,
//       [
//         input.id_subject,
//         input.class_id,
//         startAt,
//         endAt,
//         input.exam_duration,
//         examId,
//       ],
//     );
//   });
// }

// export async function handleInsertManagedExams(values: unknown) {
//   const parsed = sendExamToStudentSchema.safeParse(values);

//   if (!parsed.success) {
//     return {
//       success: false,
//       status: 400,
//       message: "Data untuk edit ujian tidak valid.",
//       errors: parsed.error.issues.map((issue) => ({
//         path: issue.path.join("."),
//         message: issue.message,
//       })),
//     };
//   }

//   const idTeacher =
//     typeof (values as { id_teacher?: string })?.id_teacher === "string"
//       ? (values as { id_teacher?: string }).id_teacher
//       : undefined;

//   if (!idTeacher) {
//     return {
//       success: false,
//       status: 400,
//       message: "ID guru tidak ditemukan.",
//     };
//   }

//   const classNames = [...new Set(parsed.data.exams.map((exam) => exam.kelas))];

//   const [classRows] = await pool.query<ClassRow[]>(
//     `
//       SELECT id, name
//       FROM classes
//       WHERE name IN (?)
//     `,
//     [classNames],
//   );

//   const classMap = new Map(classRows.map((row) => [row.name, Number(row.id)]));

//   const invalidClass = parsed.data.exams.find(
//     (exam) => exam.kelas && !classMap.has(exam.kelas),
//   );

//   if (invalidClass) {
//     return {
//       success: false,
//       status: 400,
//       message: `Kelas ${invalidClass.kelas} tidak ditemukan.`,
//     };
//   }

//   const rowsToInsert = parsed.data.exams
//     .filter((exam) => exam.kelas)
//     .map((exam) => {
//       const idManageExam = generateRandomId(8, "MNG");
//       const classId = classMap.get(exam.kelas)!;

//       return [
//         idManageExam,
//         idTeacher,
//         exam.examId,
//         classId,
//         exam.tanggalUjian ? new Date(exam.tanggalUjian) : new Date(),
//         exam.mulai,
//         exam.selesai,
//         Number(exam.durasi),
//       ];
//     });

//   if (!rowsToInsert.length) {
//     return {
//       success: false,
//       status: 400,
//       message: "Pilih minimal satu kelas untuk jadwal ujian.",
//     };
//   }

//   const query = `
//     INSERT INTO manage_exams (
//       id_manage_exam,
//       id_teacher,
//       id_subject,
//       class_id,
//       exam_date,
//       exam_start_at,
//       exam_end_at,
//       duration_exam
//     ) VALUES ?
//   `;

//   try {
//     await pool.query(query, [rowsToInsert]);

//     return {
//       success: true,
//       status: 201,
//       message: "Jadwal ujian berhasil disimpan.",
//     };
//   } catch (error) {
//     console.error("Gagal menyimpan jadwal ujian:", error);
//     return {
//       success: false,
//       status: 500,
//       message: "Gagal menyimpan jadwal ujian.",
//     };
//   }
// }
