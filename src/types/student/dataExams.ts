export type ScheduleExams = {
  created_at: Date;
  deadline_exam: Date;
  fullname: string;
  id_history_exam: string;
  id_manage_exam: string;
  id_student: string;
  id_subject: string;
  id_teacher: string;
  name_exam: string;
  result_exam: string;
  status_exam: number;
};

export type Choice = {
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  choice_e: string;
};

export type ExamQuestions = {
  id: string;
  questions: string;
  correctAnswer: string;
};

export type ExamResult = {
  class: string;
  id_student: string;
  id_subject: string;
  result_exam: string;
};

export type MultipleChoice = ExamQuestions & { multipleChoice: Choice[] };
export type Essay = ExamQuestions;

export type TypeExamQuestions = MultipleChoice[] | Essay[];

export type Exam = {
  id_subject: string;
  exam_questions: TypeExamQuestions;
  name_exam: string;
  type_exam: "PG" | "ESSAY";
  duration: number;
};

export type DataResultExam = {
  exam: Exam;
  answer_student: Record<string, string>;
};
