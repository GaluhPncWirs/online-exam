import { handleAddDataExamQuestion } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Data payload ujian belum ada",
        },
        {
          status: 401,
        },
      );
    }

    const { payloadAddDataQuestion, id_subject, id_teacher } = body;

    const result = await handleAddDataExamQuestion(
      payloadAddDataQuestion,
      id_subject,
      id_teacher,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: result.success,
          message: result.message,
        },
        {
          status: result.status,
        },
      );
    }

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        // data: result.data,
      },
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
