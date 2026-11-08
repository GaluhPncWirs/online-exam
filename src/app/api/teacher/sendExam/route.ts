import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/src/lib/db";
import { examScheduleSchema } from "@/src/schemas/manageDataExam";
import {
  createExam,
  ScheduleConflictError,
} from "@/src/services/mysql/teacher/data-subject-exam";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = examScheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data ujian tidak valid",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const teacherId = body.teacherId;
    const examId = await createExam(pool, teacherId, parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Ujian berhasil dibuat",
        examId,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error create exam:", error);

    if (error instanceof ScheduleConflictError) {
      return NextResponse.json(
        {
          code: "EXAM_SCHEDULE_CONFLICT",
          message: "Jadwal berbenturan dengan ujian yang sudah terjadwal.",
          conflict: error.conflict,
        },
        {
          status: 409,
        },
      );
    }
  }
}
