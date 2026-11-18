import { getAuthenticatedUser } from "@/src/lib/auth/getAuthenticatedUser";
import {
  handleGetAllExamQuestions,
  handleSaveResultExam,
} from "@/src/services/mysql/student/data-subject-exam";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const dataStudent = await getAuthenticatedUser("student");
    if (!dataStudent.success) {
      return NextResponse.json(
        { success: false, message: dataStudent.message },
        { status: 401 },
      );
    }

    const body = await req.json();
    if (
      typeof body?.id_subject !== "string" ||
      typeof body?.answer_student !== "object" ||
      body.answer_student === null ||
      Array.isArray(body.answer_student)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data jawaban ujian tidak valid",
        },
        { status: 400 },
      );
    }

    const { id_subject, answer_student } = body;
    const exam = await handleGetAllExamQuestions(
      id_subject,
      dataStudent.data.class,
    );
    if (!exam.success) {
      return NextResponse.json(
        { success: false, message: exam.message },
        { status: 404 },
      );
    }

    const result_exam =
      exam.type_exam === "PG"
        ? String(
            Math.round(
              (exam.exam_questions.filter(
                (question) =>
                  "correctAnswer" in question &&
                  answer_student[question.id] === question.correctAnswer,
              ).length /
                (exam.exam_questions.length || 1)) *
                100,
            ),
          )
        : "pending";

    const result = await handleSaveResultExam({
      id_student: dataStudent.data.id_student,
      id_subject,
      answer_student,
      result_exam,
      status_exam: true,
      className: dataStudent.data.class,
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
