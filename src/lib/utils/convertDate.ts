const TIME_ZONE = "Asia/Jakarta";

export type DateInput = Date | string | number;

export const getCurrentDate = (): Date => new Date();

export const addMinutes = (d: Date, m: number) =>
  new Date(d.getTime() + m * 60_000);

export const todayWIB = () =>
  new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);

export function getDateKey(date: DateInput): string | null {
  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value;

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");

  if (!year || !month || !day) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

export function getCurrentTimeInMinutes(): number {
  const now = getCurrentDate();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );

  return hour * 60 + minute;
}

export function toMinute(value: string): number {
  const [hour, minute] = value.split(":").map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return NaN;
  }

  return hour * 60 + minute;
}

export function convertToNumber(tenggatWaktu: string) {
  const [startValue, endValue] = tenggatWaktu
    .split("-")
    .map((item) => item.trim());

  return {
    start: toMinute(startValue ?? ""),
    end: toMinute(endValue ?? ""),
  };
}

type DatePart = "year" | "month" | "day" | "hour" | "minute";

export function formatDateToYYYYMMDD(
  date: Date,
  selectedPart: DatePart[] = ["year", "month", "day"],
): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(date);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value;

  return selectedPart.map(getPart).join("-");
}

const pad = (n: number) => String(n).padStart(2, "0");

export const toDateString = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromDateString = (s?: string | null): Date | undefined => {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
