export type BaseUser = {
  created_at: Date;
  fullname: string;
  email: string;
  no_tlp: string;
  profil_img: string | null;
};

export type DataStudent = BaseUser & {
  role: "student";
  class: string;
  type_account: "default" | "google";
  nis: string;
  id_student: string;
};

export type DataTeacher = BaseUser & {
  role: "teacher";
  teach_role: string;
  nisn: string;
  id_teacher: string;
};
