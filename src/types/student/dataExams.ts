import { TypeExamQuestions } from "../dataExam";

export type ScheduleExams = {
  exam_date: Date;
  deadline_exam: {
    start: string;
    end: string;
  };
  fullname: string;
  history_created_at: Date | null;
  id_history_exam: string | null;
  id_manage_exam: string;
  id_student: string;
  id_subject: string;
  id_teacher: string;
  name_exam: string;
  result_exam: string;
  status_exam: number;
};

export type ExamResult = {
  class: string;
  id_student: string;
  id_subject: string;
  result_exam: string;
};

export type Exam = {
  id_subject: string;
  exam_questions: TypeExamQuestions;
  name_exam: string;
  type_exam: "PG" | "ESSAY";
  duration: number;
};

export type DataResultExam = {
  answer_student: Record<string, string>;
  exam_questions: TypeExamQuestions;
  name_exam: string;
  type_exam: "PG" | "ESSAY";
};
