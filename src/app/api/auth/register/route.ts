import { handleUserRegister } from "@/src/services/mysql/data-student";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, classes, email, password } = body;

    const result = await handleUserRegister({
      fullName,
      classes,
      email,
      password,
    });

    return NextResponse.json(
      { success: result.success, message: result.message },
      {
        status: result.status,
      },
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      },
    );
  }
}
