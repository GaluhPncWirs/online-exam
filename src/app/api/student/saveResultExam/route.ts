import { handleSaveResultExam } from "@/src/services/mysql/student/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id_student,
      id_subject,
      answer_student,
      result_exam,
      status_exam,
      className,
    } = body;

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Data hasil ujian tidak ada",
        },
        {
          status: 401,
        },
      );
    }

    const result = await handleSaveResultExam({
      id_student,
      id_subject,
      answer_student,
      result_exam,
      status_exam,
      className,
    });

    return NextResponse.json(
      { success: result.success, message: result.message },
      {
        status: result.status,
      },
    );
  } catch (error) {
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
