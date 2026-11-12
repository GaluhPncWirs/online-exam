import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetDetailExam } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_subject: string }> },
) {
  try {
    const { id_subject } = await params;
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

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
        { success: false, message: "Hanya guru yang dapat mengakses data ini" },
        { status: 403 },
      );
    }

    const result = await handleGetDetailExam(
      id_subject,
      user.data.id_teacher,
      page,
      limit,
    );

    return NextResponse.json(
      {
        success: result?.success,
        message: result?.message,
        data: result?.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error menampilkan data soal:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error menampilkan data soal",
      },
      {
        status: 500,
      },
    );
  }
}
