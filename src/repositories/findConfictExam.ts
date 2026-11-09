import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export type ConflictInfo = {
  examId: number;
  subjectName: string;
  teacherName: string;
  startAt: Date;
  endAt: Date;
};

export class ScheduleConflictError extends Error {
  constructor(
    public readonly conflict: ConflictInfo,
    public readonly index?: number,
  ) {
    super("Jadwal ujian bentrok dengan ujian lain pada kelas yang sama");
  }
}

export async function lockClasses(conn: PoolConnection, classIds: number[]) {
  const ids = [...new Set(classIds)].sort((a, b) => a - b);
  for (const id of ids) {
    const [rows] = await conn.execute<RowDataPacket[]>(
      "SELECT id FROM classes WHERE id = ? FOR UPDATE",
      [id],
    );
    if (rows.length === 0) throw new Error(`Kelas ${id} tidak ditemukan`);
  }
}

export async function findConflict(
  conn: PoolConnection,
  classId: number,
  startAt: Date,
  endAt: Date,
  excludeExamId?: number,
): Promise<ConflictInfo | null> {
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT e.id_manage_exam, e.exam_start_at, e.exam_end_at,
            s.name_exam AS subject_name, t.fullname AS teacher_name
       FROM manage_exams e
       JOIN subject_exam s ON s.id_subject = e.id_subject
       JOIN account_teacher t ON t.id_teacher = e.id_teacher
      WHERE e.class_id = ?
        AND e.exam_start_at < ?     
        AND e.exam_end_at   > ?      
        AND e.id_manage_exam <> ?               
      LIMIT 1`,
    [classId, endAt, startAt, excludeExamId ?? 0],
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    examId: r.id,
    subjectName: r.subject_name,
    teacherName: r.teacher_name,
    startAt: r.exam_start_at,
    endAt: r.exam_end_at,
  };
}
