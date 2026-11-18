import { handleGetDataResultExam } from "@/src/services/mysql/student/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const idStudent = searchParams.get("idStudent") || "";
    const idSubject = searchParams.get("idSubject") || "";

    const result = await handleGetDataResultExam(
      idSubject,
      idStudent,
      page,
      limit,
    );

    return NextResponse.json(
      {
        success: result?.success,
        message: result?.message,
        data: result?.data,
        pagination: result?.pagination,
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
