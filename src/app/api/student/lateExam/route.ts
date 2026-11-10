import { handleLateExam } from "@/src/services/mysql/student/data-subject-exam";
import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user.success) {
      return NextResponse.json(
        {
          success: false,
          message: user.message,
        },
        {
          status: 401,
        },
      );
    }

    if (user.data.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Hanya siswa yang dapat mengirim data ini" },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("id_subject" in body) ||
      typeof body.id_subject !== "string" ||
      !body.id_subject.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "ID mata pelajaran tidak valid" },
        { status: 400 },
      );
    }

    const result = await handleLateExam({
      id_student: user.data.id_student,
      id_subject: body.id_subject,
      className: user.data.class,
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
