import { useEffect, useState } from "react";
import {
  getCurrentTimeInMinutes,
  toMinute,
} from "@/src/lib/utils/convertDate";
import {
  getTodayIndonesia,
  parseIndonesianDate,
} from "@/src/lib/utils/statusExam";
import { ScheduleExams } from "@/src/types/student/dataExams";

export function useUpComingExam(scheduleExams: ScheduleExams[]) {
  const [, setClockTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClockTick((tick) => tick + 1);
    }, 15_000);

    return () => window.clearInterval(timer);
  }, []);

  const today = getTodayIndonesia();
  const currentMinute = getCurrentTimeInMinutes();
  const todayNumber = today.year * 10000 + (today.month + 1) * 100 + today.day;

  const upcomingExams = scheduleExams.filter((exam) => {
    if (exam.status_exam !== 0) {
      return false;
    }

    const examDate = parseIndonesianDate(exam.exam_date);

    if (!examDate) {
      return false;
    }

    const examDateNumber =
      examDate.year * 10000 + (examDate.month + 1) * 100 + examDate.day;

    if (examDateNumber !== todayNumber) {
      return false;
    }

    const start = toMinute(exam.deadline_exam.start);
    const end = toMinute(exam.deadline_exam.end);

    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      currentMinute >= end
    ) {
      return false;
    }

    return true;
  });

  if (upcomingExams.length === 0) {
    return null;
  }

  return upcomingExams.reduce((closestExam, currentExam) => {
    const closestDeadline = toMinute(closestExam.deadline_exam.end);
    const currentDeadline = toMinute(currentExam.deadline_exam.end);

    return currentDeadline < closestDeadline ? currentExam : closestExam;
  });
}
