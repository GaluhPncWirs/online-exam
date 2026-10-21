import { handleLateExam } from "@/src/services/mysql/data-subject-exam";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_student, id_subject, result_exam, status_exam, className } =
      body;

    const result = await handleLateExam({
      id_student,
      id_subject,
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
