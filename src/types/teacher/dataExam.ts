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
  id_manage_exam: string;
  created_at: Date;
  class: string;
  id_subject: string;
  exam_date: Date;
  name_exam: string;
  exam_start_at: string;
  exam_end_at: string;
  lengthStudent: string[];
  type_exam: "PG" | "ESSAY";
  lengthStudentCompleteExams: string[];
  hasil_ujian: unknown[];
  is_manage_exam: boolean;
};

export type StatisticStudent = {
  jumlahSiswa: number;
  averageValueExam: number;
};

export type DataPureExams = {
  id_subject: string;
  name_exam: string;
  type_exam: "PG" | "ESSAY";
};

export type Pagination = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};
