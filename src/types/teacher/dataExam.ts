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
