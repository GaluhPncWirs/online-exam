import { RowDataPacket } from "mysql2";
import { pool } from "../db";

export async function queryRows<T extends RowDataPacket[]>(
  sql: string,
  params: unknown[],
  skip = false,
) {
  if (skip) return [] as unknown as T;
  const [rows] = await pool.query<T>(sql, params);
  return rows;
}
