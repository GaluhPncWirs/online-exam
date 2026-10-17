export function convertDate(created_at: string, options: object) {
  return new Date(created_at).toLocaleDateString("id-ID", options);
}
