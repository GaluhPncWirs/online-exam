import { handleSaveAsesmentExam } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
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

    const { resultAsesment, idSubject, idStudent } = body;

    const handleUpdate = await handleSaveAsesmentExam({
      resultAsesment,
      idSubject,
      idStudent,
    });

    return NextResponse.json(
      {
        success: handleUpdate.success,
        message: handleUpdate.message,
      },
      {
        status: handleUpdate.status,
      },
    );
  } catch (error) {
    console.error("Error menilai data ujian ini:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error menilai data ujian ini",
      },
      {
        status: 500,
      },
    );
  }
}
