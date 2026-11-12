import { handleUpdateQuestionExam } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_subject, id_teacher, questionId, field, value } = body;

    if (!id_subject || !id_teacher || !questionId || !field || !value) {
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

    const handleUpdate = await handleUpdateQuestionExam({
      id_subject,
      id_teacher,
      questionId,
      field,
      value,
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
