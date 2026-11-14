import { handleGetDataExamEssayForCorrection } from "@/src/services/mysql/teacher/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const body = await req.json();
    const { idStudent, idSubject } = body;

    if (!idStudent || !idSubject) {
      return NextResponse.json(
        {
          success: false,
          message: "ID yang diperlukan tidak ada",
        },
        {
          status: 401,
        },
      );
    }

    const { searchParams } = new URL(req.url);

    const from = Number(searchParams.get("from"));
    const to = Number(searchParams.get("to"));

    const result = await handleGetDataExamEssayForCorrection(
      idStudent,
      idSubject,
      from,
      to,
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
