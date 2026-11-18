"use server";
import { getAuthenticatedUser } from "../lib/auth/getAuthenticatedUser";
import { getDataPagination } from "../lib/utils/getDataPagination";
import {
  handleGetDataHistoryResultExamPerClass,
  handleGetDataSubjectExams,
} from "../services/mysql/student/data-subject-exam";

export async function getDataExamsPagination(page: number) {
  const session = await getAuthenticatedUser("student");
  if (!session.success) {
    return {
      success: false,
      message: session.message,
      data: [],
      total: 0,
    };
  }

  return getDataPagination(page, async (from: number, to: number) =>
    handleGetDataSubjectExams(
      session.data.class,
      session.data.id_student,
      from,
      to,
    ),
  );
}

export async function getDataHistoryExamsPagination(page: number) {
  const session = await getAuthenticatedUser("student");
  if (!session.success) {
    return {
      success: false,
      message: session.message,
      data: [],
      total: 0,
    };
  }

  return getDataPagination(page, async (from: number, to: number) =>
    handleGetDataHistoryResultExamPerClass(session.data.id_student, from, to),
  );
}
