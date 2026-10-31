export type QuestionExam = {
  id: string;
  questions: string;
  correctAnswer: string;
  answerPg: {
    answer_a: string;
    answer_b: string;
    answer_c: string;
    answer_d: string;
    answer_e: string;
  };
};

export type ExamData = {
  nama_ujian: string;
  questions_exam: QuestionExam[];
};

export type SoalUjian = {
  created_at: string;
  dibuat_tgl: string;
  exam_duration: number;
  exams: ExamData;
  id: number;
  idExams: number;
  id_Teacher: string;
  isManageExam: boolean;
  kelas: string;
  tenggat_waktu: string;
  tipe_ujian: string;
};
