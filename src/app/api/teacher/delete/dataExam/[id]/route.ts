import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleDeleteExamToStudent } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "id program harus ada",
        },
        {
          status: 400,
        },
      );
    }

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

    if (user.data.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Hanya guru yang dapat menghapus data ini" },
        { status: 403 },
      );
    }

    const deletedData = await handleDeleteExamToStudent(
      id,
      user.data.id_teacher,
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
