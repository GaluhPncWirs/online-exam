export type DataUser = {
  created_at: Date;
  fullname: string;
  email: string;
  no_tlp: string;
  profil_img: string;
};

export type DataStudent = DataUser & {
  role: "student";
  class: string;
  type_account: "default" | "google";
  nis: string;
  id_student: string;
};

export type DataTeacher = DataUser & {
  role: "teacher";
  teach_role: string;
  nisn: string;
  id_teacher: string;
};
