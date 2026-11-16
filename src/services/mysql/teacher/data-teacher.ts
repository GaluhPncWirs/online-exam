import { pool } from "@/src/lib/db";

type FieldInputUpdateDataTeacher = {
  idTeacher: string;
  fieldInput: {
    teachRole?: string;
    password?: string;
    noTlp?: string;
  };
};

export async function handleEditProfileTeacher({
  idTeacher,
  fieldInput,
}: FieldInputUpdateDataTeacher) {
  const fields: string[] = [];
  const values: string[] = [];

  if (fieldInput?.teachRole !== undefined) {
    fields.push("teach_role = ?");
    values.push(fieldInput.teachRole);
  }

  if (fieldInput?.password !== undefined) {
    fields.push("password = ?");
    values.push(fieldInput.password);
  }

  if (fieldInput?.noTlp !== undefined) {
    fields.push("no_tlp = ?");
    values.push(fieldInput.noTlp);
  }

  if (fields.length === 0) {
    return {
      success: false,
      message: "Tidak ada data yang ingin diperbarui.",
    };
  }

  const query = `
    UPDATE account_teacher
    SET ${fields.join(", ")}
    WHERE id_teacher = ?
  `;

  try {
    await pool.execute(query, [...values, idTeacher]);

    return {
      success: true,
      status: 201,
      message: "Berhasil update data kamu.",
    };
  } catch (error) {
    console.error("Gagal update data", error);
    return {
      success: false,
      status: 500,
      message: "Error terhubung kedalam database",
    };
  }
}
