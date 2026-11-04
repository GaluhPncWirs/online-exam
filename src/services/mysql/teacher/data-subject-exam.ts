"server-only";
import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";

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
  class: string;
};

type HistoryScoreRow = RowDataPacket & {
  result_exam: string | number | null;
};

export async function handleGetStatisticsStudent(id_teacher: string) {
  const queryManagedExams = `
    SELECT DISTINCT class 
    FROM manage_exams
    WHERE id_teacher = ?
  `;

  const queryHistoryExams = `
    SELECT he.result_exam
    FROM history_exams AS he
    INNER JOIN subject_exam as se
      ON he.id_subject = se.id_subject
    WHERE se.id_teacher = ?
  `;

  const queryStudent = `
    SELECT DISTINCT id_student 
    FROM account_students 
    WHERE class IN (?)
  `;

  try {
    const [[managedExams], [historyExams]] = await Promise.all([
      pool.query<ManagedClassRow[]>(queryManagedExams, [id_teacher]),
      pool.query<HistoryScoreRow[]>(queryHistoryExams, [id_teacher]),
    ]);

    const classes = managedExams.map((row) => row.class).filter(Boolean);

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
  id_subject: string;
  deadline_exam: Date;
  name_exam: string | null;
};

type HistoryExamRow = RowDataPacket & {
  id_subject: string;
  id_student: string;
  class: string;
  exam_result: unknown;
};

type StudentRow = RowDataPacket & {
  classes: string;
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
  SELECT me.created_at, me.class, me.id_subject, me.deadline_exam, se.name_exam
  FROM manage_exams as me
  LEFT JOIN subject_exam as se
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
    SELECT id_subject, id_student, class, result_exam
    FROM history_exams
    WHERE id_subject IN (?) 
      AND class IN (?)
  `;

  const queryStudent = `
    SELECT class, id_student 
    FROM account_students 
    WHERE class IN (?)
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
    const classes = [
      ...new Set(managedExams.map((e) => e.class).filter(Boolean)),
    ];

    const [historyExams, students] = await Promise.all([
      queryRows<HistoryExamRow[]>(
        queryHistoryExams,
        [examIds, classes],
        !examIds.length || !classes.length,
      ),
      queryRows<StudentRow[]>(queryStudent, [classes], !classes.length),
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
        existing.hasilUjian.push(item.exam_result);
      } else {
        completeExamMap.set(key, {
          studentIds: [item.id_student],
          hasilUjian: [item.exam_result],
        });
      }
    });

    const studentMap = new Map<string, string[]>();

    students.forEach((student) => {
      const list = studentMap.get(student.classes) ?? [];
      list.push(student.id_student);
      studentMap.set(student.classes, list);
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
    SELECT name_exam, type_exam
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
