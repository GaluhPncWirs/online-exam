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

export type MultipleChoice = ExamQuestions & { multipleChoice: Choice[] };
export type Essay = ExamQuestions;

export type TypeExamQuestions = MultipleChoice[] | Essay[];
