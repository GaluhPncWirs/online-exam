import { handleDeleteQuestionExam } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { idSubject, idQuestion, idTeacher } = body;

    if (!idSubject || !idQuestion || !idTeacher) {
      return NextResponse.json(
        {
          success: false,
          message: "id yang diperlukan harus ada semua",
        },
        {
          status: 400,
        },
      );
    }

    const result = await handleDeleteQuestionExam(
      idSubject,
      idQuestion,
      idTeacher,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
