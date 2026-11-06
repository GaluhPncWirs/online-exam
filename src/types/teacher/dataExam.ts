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
  created_at: string | Date;
  class: string;
  id_subject: string;
  deadline_exam: string | Date;
  name_exam: string | null;
  lengthStudent: string[];
  type_exam: "PG" | "ESSAY";
  lengthStudentCompleteExams: string[];
  hasil_ujian: unknown[];
};

export type StatisticStudent = {
  jumlahSiswa: number;
  averageValueExam: number;
};
