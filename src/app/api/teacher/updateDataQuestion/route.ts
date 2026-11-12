import { handleUpdateQuestionExam } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    if (
      body === null ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field harus diisi",
        },
        {
          status: 400,
        },
      );
    }

    const { id_subject, id_teacher, questionId, updates } = body as Record<
      string,
      unknown
    >;

    if (
      typeof id_subject !== "string" ||
      typeof id_teacher !== "string" ||
      typeof questionId !== "string" ||
      updates === null ||
      typeof updates !== "object" ||
      Array.isArray(updates)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ID ujian, ID guru, ID soal, dan updates harus valid",
        },
        {
          status: 400,
        },
      );
    }

    const handleUpdate = await handleUpdateQuestionExam({
      id_subject,
      id_teacher,
      questionId,
      updates: Object.fromEntries(Object.entries(updates)),
    });

    return NextResponse.json(
      {
        success: handleUpdate.success,
        message: handleUpdate.message,
        data: handleUpdate.data,
      },
      {
        status: handleUpdate.status,
      },
    );
  } catch (error) {
    console.error("Error memperbarui data ujian:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error memperbarui data ujian",
      },
      {
        status: 500,
      },
    );
  }
}
