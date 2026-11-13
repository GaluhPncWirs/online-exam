import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import { handleGetDataResultScoreExams } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const from = Number(searchParams.get("from"));
    const to = Number(searchParams.get("to"));

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

    const result = await handleGetDataResultScoreExams(
      user.data.id_teacher,
      from,
      to,
    );

    return NextResponse.json(
      {
        success: result?.success,
        message: result?.message,
        data: result?.data,
        total: result?.total,
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
