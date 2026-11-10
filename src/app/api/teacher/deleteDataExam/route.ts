import { handleDeleteExamToStudent } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { idManageExam, idTeacher } = body;

    if (!idManageExam || !idTeacher) {
      return NextResponse.json(
        {
          success: false,
          message: "id ujian harus ada",
        },
        {
          status: 400,
        },
      );
    }
    const deletedData = await handleDeleteExamToStudent(
      idManageExam,
      idTeacher,
    );

    if (!deletedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: deletedData.message,
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: deletedData.message,
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
