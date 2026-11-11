export type Choice = {
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  choice_e: string;
};

export type ExamQuestionBase = {
  id: string;
  questions: string;
};

export type MultipleChoiceQuestion = ExamQuestionBase & {
  multipleChoice: Choice;
  correctAnswer: string;
};

export type EssayQuestion = ExamQuestionBase;

export type ExamQuestion =
  | {
      name_exam: string;
      type_exam: "PG";
      exam_questions: MultipleChoiceQuestion[];
    }
  | {
      name_exam: string;
      type_exam: "ESSAY";
      exam_questions: EssayQuestion[];
    };
