export type DataExamsPending = {
  created_at: Date;
  id_student: string;
  id_subject: string;
  id_teacher: string;
  name_exam: string;
  result_exam: string;
  status_exam: boolean;
  type_exam: "PG" | "essay";
};

export type ManageExamItem = {
  created_at: Date;
  class: string;
  id_subject: string;
  exam_date: Date;
  name_exam: string | null;
  exam_start_at: string;
  exam_end_at: string;
  lengthStudent: string[];
  type_exam: "PG" | "ESSAY";
  lengthStudentCompleteExams: string[];
  hasil_ujian: unknown[];
};

export type StatisticStudent = {
  jumlahSiswa: number;
  averageValueExam: number;
};
