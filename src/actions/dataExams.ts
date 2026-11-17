"use server";
import { getAuthenticatedUser } from "../lib/auth/getAuthenticatedUser";
import { PAGE_SIZE } from "../lib/constants";
import {
  handleGetDataExam,
  handleGetDataManageExams,
  handleGetTeacherExamHistory,
} from "../services/mysql/teacher/data-subject-exam";

const session = await getAuthenticatedUser("teacher");

export async function getTeacherExamHistoryAction(page: number) {
  if (!session.success) {
    return {
      success: false,
      message: session.message,
      data: [],
      total: 0,
    };
  }

  const safePage = Math.max(1, Math.floor(page) || 1);
  return handleGetTeacherExamHistory(
    session.data.id_teacher,
    safePage,
    PAGE_SIZE,
  );
}

export async function getManageExamsAction(page: number) {
  if (!session.success) {
    return { success: false, message: "Error ambil data", data: [], total: 0 };
  }

  if (!session?.data.id_teacher) {
    return { success: false, message: "Unauthorized", data: [], total: 0 };
  }

  const safePage = Math.max(1, Math.floor(page) || 1);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  return handleGetDataManageExams(session.data.id_teacher, from, to);
}

export async function getDataExams() {
  if (!session.success) {
    return { success: false, message: "Error ambil data", data: [], total: 0 };
  }

  if (!session?.data.id_teacher) {
    return { success: false, message: "Unauthorized", data: [], total: 0 };
  }

  return handleGetDataExam(session.data.id_teacher);
}
