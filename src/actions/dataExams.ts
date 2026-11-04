"use server";

import { getAuthenticatedUser } from "../lib/auth/getAuthenticatedUser";
import { PAGE_SIZE } from "../lib/constants";
import { handleGetDataManageExams } from "../services/mysql/teacher/data-teacher";

export async function getManageExamsAction(page: number) {
  const session = await getAuthenticatedUser();

  if (!session.success) {
    return { success: false, message: "Error ambil data", data: [], total: 0 };
  }

  if (session.data.role !== "teacher") {
    return { success: false, message: "Khusus role guru", data: [], total: 0 };
  }

  if (!session?.data.id_teacher) {
    return { success: false, message: "Unauthorized", data: [], total: 0 };
  }

  const safePage = Math.max(1, Math.floor(page) || 1);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  return handleGetDataManageExams(session.data.id_teacher, from, to);
}
