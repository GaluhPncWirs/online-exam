import { handleGetDataManageExams } from "@/src/services/mysql/teacher/data-teacher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body) {
    return NextResponse.json(
      {
        success: false,
        message: "Error, Tidak ada data body",
      },
      {
        status: 401,
      },
    );
  }

  const { id_teacher, from, to } = body;

  try {
    const result = await handleGetDataManageExams(id_teacher, from, to);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json({
      success: result.success,
      data: result.data,
      total: result.total,
    });
  } catch (error) {
    console.error("Error ambil data ujian:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error ambil data ujian",
      },
      {
        status: 500,
      },
    );
  }
}
