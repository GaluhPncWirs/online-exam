"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { getAuthenticatedUser } from "../lib/auth/getAuthenticatedUser";
import { getDataPagination } from "../lib/utils/getDataPagination";
import { handleExistingUserAccount } from "../services/mysql/student/data-student";
import {
  handleGetDataHistoryResultExamPerClass,
  handleGetDataSubjectExams,
} from "../services/mysql/student/data-subject-exam";

export async function getDataExamsPagination(
  page: number,
  typeAccount: "default" | "google",
) {
  let studentData: { class: string; id_student: string };

  if (typeAccount === "default") {
    const session = await getAuthenticatedUser("student");
    if (!session.success) {
      return {
        success: false,
        message: session.message,
        data: [],
        total: 0,
      };
    }

    studentData = session.data;
  } else {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        success: false,
        message: "Silakan login terlebih dahulu",
        data: [],
        total: 0,
      };
    }

    const googleUser = await handleExistingUserAccount(session.user.email);
    if (!googleUser || googleUser.role !== "student") {
      return {
        success: false,
        message: "Data akun siswa tidak ditemukan",
        data: [],
        total: 0,
      };
    }

    studentData = googleUser;
  }

  return getDataPagination(page, async (from: number, to: number) =>
    handleGetDataSubjectExams(
      studentData.class,
      studentData.id_student,
      from,
      to,
    ),
  );
}

export async function getDataHistoryExamsPagination(
  page: number,
  typeAccount: "default" | "google",
) {
  let studentData: { id_student: string };

  if (typeAccount === "default") {
    const session = await getAuthenticatedUser("student");
    if (!session.success) {
      return {
        success: false,
        message: session.message,
        data: [],
        total: 0,
      };
    }
    studentData = session.data;
  } else {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        success: false,
        message: "Silakan login terlebih dahulu",
        data: [],
        total: 0,
      };
    }

    const googleUser = await handleExistingUserAccount(session.user.email);
    if (!googleUser || googleUser.role !== "student") {
      return {
        success: false,
        message: "Data akun siswa tidak ditemukan",
        data: [],
        total: 0,
      };
    }

    studentData = googleUser;
  }

  return getDataPagination(page, async (from: number, to: number) =>
    handleGetDataHistoryResultExamPerClass(studentData.id_student, from, to),
  );
}
