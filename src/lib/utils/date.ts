export function convertDate(created_at: string, options: object) {
  return new Date(created_at).toLocaleDateString("id-ID", options);
}

const pad = (n: number) => String(n).padStart(2, "0");

export const toDateString = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromDateString = (s?: string | null): Date | undefined => {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
