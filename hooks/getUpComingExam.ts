import { ScheduleExams } from "@/src/types/student/dataExams";

export function getUpComingExam(scheduleExams: ScheduleExams[]) {
  const now = new Date();

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const upcomingExams = scheduleExams.filter((exam) => {
    // Ujian yang sudah dikerjakan tidak ditampilkan
    if (exam.status_exam === true) {
      return false;
    }

    // Parse timestamp
    const examDate = new Date(exam.created_at);
    const deadline = new Date(exam.deadline_exam);

    // Pastikan timestamp valid
    if (Number.isNaN(examDate.getTime()) || Number.isNaN(deadline.getTime())) {
      return false;
    }

    // Ambil tanggal ujian berdasarkan zona waktu Indonesia
    const examDay = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(examDate);

    // Hanya ujian hari ini
    if (examDay !== today) {
      return false;
    }

    // Ujian yang sudah melewati tenggat tidak ditampilkan
    if (now.getTime() >= deadline.getTime()) {
      return false;
    }

    return true;
  });

  if (upcomingExams.length === 0) {
    return null;
  }

  // Pilih ujian dengan tenggat waktu terdekat
  return upcomingExams.reduce((closestExam, currentExam) => {
    const closestDeadline = new Date(closestExam.deadline_exam).getTime();

    const currentDeadline = new Date(currentExam.deadline_exam).getTime();

    return currentDeadline < closestDeadline ? currentExam : closestExam;
  });
}
