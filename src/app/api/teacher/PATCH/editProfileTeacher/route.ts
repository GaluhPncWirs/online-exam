import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleEditProfileTeacher } from "@/src/services/mysql/teacher/data-teacher";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getAuthenticatedUser();

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

    if (user.data.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Hanya guru yang dapat menghapus data ini" },
        { status: 403 },
      );
    }

    const { teachRole, password, noTlp } = body;

    const handleUpdate = await handleEditProfileTeacher({
      idTeacher: user.data.id_teacher,
      fieldInput: {
        teachRole,
        password,
        noTlp,
      },
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
