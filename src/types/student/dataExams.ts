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

export type MultipleChoice = ExamQuestions & Choice;
export type Essay = ExamQuestions;

export type DataResultExam = {
  answer_student: Record<string, string>;
  exam_questions: MultipleChoice[] | Essay[];
  name_exam: string;
  type_exam: string;
};
