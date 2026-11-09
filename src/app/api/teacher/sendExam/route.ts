import { NextRequest, NextResponse } from "next/server";
import { handleSendExamToStudent } from "@/src/services/mysql/teacher/data-subject-exam";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Data ujian tidak valid",
        },
        {
          status: 401,
        },
      );
    }

    const { teacherId, exams } = body;

    const result = handleSendExamToStudent(teacherId, exams);

    return NextResponse.json(
      {
        success: result?.success,
        message: result?.message,
        data: result?.data,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error simpan data ujian:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error simpan data ujian",
      },
      {
        status: 500,
      },
    );
  }
}
