import { MAX_PAGE_SIZE } from "../constants";

export async function getDataPagination<TResult>(
  page: number,
  getData: (from: number, to: number) => Promise<TResult>,
  pageSize = MAX_PAGE_SIZE,
): Promise<TResult> {
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError("pageSize must be a positive integer");
  }

  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  return getData(from, to);
}
