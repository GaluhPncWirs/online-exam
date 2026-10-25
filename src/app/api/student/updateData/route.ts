import { handleUpdateDataStudent } from "@/src/services/mysql/student/data-student";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { idStudent, fieldInput } = body;

    if (!fieldInput) {
      return NextResponse.json(
        { success: false, message: "Data field wajib diisi" },
        {
          status: 401,
        },
      );
    }

    const handleUpdate = await handleUpdateDataStudent({
      idStudent,
      fieldInput: {
        name: fieldInput.name,
        password: fieldInput.password,
        noTlp: fieldInput.noTlp,
      },
    });

    return NextResponse.json(
      { success: handleUpdate.success, message: handleUpdate.message },
      {
        status: handleUpdate.status,
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
