"use server";
import { getAuthenticatedUser } from "../lib/auth/getAuthenticatedUser";
import { MAX_PAGE_SIZE } from "../lib/constants";
import { getDataPagination } from "../lib/utils/getDataPagination";
import { handleGetDataSubjectExams } from "../services/mysql/student/data-subject-exam";
import {
  handleGetDataExam,
  handleGetDataManageExams,
  handleGetTeacherExamHistory,
} from "../services/mysql/teacher/data-subject-exam";

const session = await getAuthenticatedUser("teacher");
const sessionStudent = await getAuthenticatedUser("student");

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
    MAX_PAGE_SIZE,
  );
}

export async function getDataExamsPagination(
  page: number,
  pageSize: number = MAX_PAGE_SIZE,
) {
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError("pageSize must be a positive integer");
  }

  if (!sessionStudent.success) {
    return {
      success: false,
      message: sessionStudent.message,
      data: [],
      total: 0,
    };
  }

  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  return handleGetDataSubjectExams(
    sessionStudent.data.class,
    sessionStudent.data.id_student,
    from,
    to,
  );
}

export async function getManageExamsAction(page: number) {
  if (!session.success) {
    return { success: false, message: "Error ambil data", data: [], total: 0 };
  }

  return getDataPagination(page, (from, to) =>
    handleGetDataManageExams(session.data.id_teacher, from, to),
  );
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
