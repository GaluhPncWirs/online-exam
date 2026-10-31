export type DataUser = {
  id_student: string;
  created_at: Date;
  fullname: string;
  class?: string;
  email: string;
  type_account: string;
  role: "student" | "teacher";
  nis?: string;
  no_tlp: string;
  profil_img: string;
  teach_role?: string;
  nisn?: string;
};
