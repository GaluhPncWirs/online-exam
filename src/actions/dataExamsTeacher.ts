"use server";
import { getAuthenticatedUser } from "../lib/auth/getAuthenticatedUser";
import { MAX_PAGE_SIZE } from "../lib/constants";
import { getDataPagination } from "../lib/utils/getDataPagination";
import {
  handleGetDataExam,
  handleGetDataManageExams,
  handleGetTeacherExamHistory,
} from "../services/mysql/teacher/data-subject-exam";

export async function getTeacherExamHistoryAction(page: number) {
  const session = await getAuthenticatedUser("teacher");
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
    MAX_PAGE_SIZE,
  );
}

export async function getManageExamsAction(page: number) {
  const session = await getAuthenticatedUser("teacher");
  if (!session.success) {
    return { success: false, message: "Error ambil data", data: [], total: 0 };
  }

  return getDataPagination(page, (from, to) =>
    handleGetDataManageExams(session.data.id_teacher, from, to),
  );
}

export async function getDataExams() {
  const session = await getAuthenticatedUser("teacher");
  if (!session.success) {
    return { success: false, message: "Error ambil data", data: [], total: 0 };
  }

  if (!session?.data.id_teacher) {
    return { success: false, message: "Unauthorized", data: [], total: 0 };
  }

  return handleGetDataExam(session.data.id_teacher);
}
