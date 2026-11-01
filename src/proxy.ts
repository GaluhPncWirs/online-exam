import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { handleValidateStartExam } from "./services/mysql/student/data-subject-exam";

const ROUTES = {
  home: "/Introduction",
  student: "/Student",
  studentDashboard: "/Student/Dashboard",
  startExam: "/Student/Exams/StartExam",
} as const;

const COOKIES = {
  token: "loginSession",
  startExam: "startExam",
  examId: "examId",
} as const;

const EXAM_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "strict",
} as const;

const ROLE_ROUTES = [
  { prefix: "/Teacher", role: "guru", requireLogin: true },
  { prefix: ROUTES.student, role: "siswa", requireLogin: true },
] as const;

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

type Session = {
  role?: string;
  idUser?: string;
};

const redirectTo = (req: NextRequest, path: string) =>
  NextResponse.redirect(new URL(path, req.url));

// Verifikasi token sekali saja; token tidak valid/expired dianggap belum login.
async function getSession(req: NextRequest): Promise<Session | null> {
  const token = req.cookies.get(COOKIES.token)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      role: typeof payload.role === "string" ? payload.role : undefined,
      idUser: typeof payload.idUser === "string" ? payload.idUser : undefined,
    };
  } catch (error) {
    console.error("[proxy] JWT verify gagal:", error);
    return null;
  }
}

function allowExam(examId: string) {
  const response = NextResponse.next();
  response.cookies.set(COOKIES.startExam, "true", EXAM_COOKIE_OPTIONS);
  response.cookies.set(COOKIES.examId, examId, EXAM_COOKIE_OPTIONS);
  return response;
}

function getExamId(pathname: string) {
  return pathname.slice(ROUTES.startExam.length).split("/")[1];
}

async function handleStartExam(
  req: NextRequest,
  session: Session | null,
  isExamInProgress: boolean,
) {
  const { pathname, search } = req.nextUrl;
  const examId = getExamId(pathname);

  if (!examId) return redirectTo(req, ROUTES.studentDashboard);

  if (session) {
    if (!session.idUser) return redirectTo(req, ROUTES.studentDashboard);

    const { data: history } = await handleValidateStartExam(
      examId,
      session.idUser,
    );

    // Belum pernah ujian -> boleh mulai
    const hasNoHistory = !history?.status_exam && !history?.id_student;
    if (hasNoHistory) return allowExam(examId);

    // Ujian sudah selesai (termasuk yang telat)
    const hasFinished =
      history?.status_exam === true && history?.id_student === session.idUser;
    if (hasFinished) return redirectTo(req, ROUTES.studentDashboard);
  }

  if (!isExamInProgress) return allowExam(examId);

  const expectedPath = `${ROUTES.startExam}/${examId}`;
  const currentPath = pathname + search;

  return currentPath === expectedPath
    ? NextResponse.next()
    : redirectTo(req, expectedPath);
}

// Saat ujian berlangsung, user tidak boleh pindah ke halaman Student lain.
function redirectBackToExam(req: NextRequest) {
  const examId = req.cookies.get(COOKIES.examId)?.value;

  if (examId) {
    return redirectTo(req, `${ROUTES.startExam}/${examId}`);
  }

  // Cookie tidak konsisten: reset agar tidak terjadi redirect loop
  const response = redirectTo(req, ROUTES.studentDashboard);
  response.cookies.delete(COOKIES.startExam);
  return response;
}

// Return redirect jika akses ditolak, `null` jika diizinkan.
function guardRoleRoute(req: NextRequest, session: Session | null) {
  const rule = ROLE_ROUTES.find(({ prefix }) =>
    req.nextUrl.pathname.startsWith(prefix),
  );
  if (!rule) return null;

  const isAllowed = session ? session.role === rule.role : !rule.requireLogin;

  return isAllowed ? null : redirectTo(req, ROUTES.home);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSession(req);
  const isExamInProgress = req.cookies.get(COOKIES.startExam)?.value === "true";

  if (pathname.startsWith(ROUTES.startExam)) {
    return handleStartExam(req, session, isExamInProgress);
  }

  if (isExamInProgress && pathname.startsWith(ROUTES.student)) {
    return redirectBackToExam(req);
  }

  return guardRoleRoute(req, session) ?? NextResponse.next();
}

export const config = {
  matcher: ["/Teacher/:path*", "/Student/:path*"],
};
