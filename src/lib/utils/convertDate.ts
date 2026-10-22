const TIME_ZONE = "Asia/Jakarta";

export type DateInput = Date | string | number;

export const getCurrentDate = (): Date => new Date();

/**
 * Mengubah Date atau timestamp menjadi key tanggal
 * berdasarkan zona waktu Asia/Jakarta.
 * Format hasil: YYYY-MM-DD
 */
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

/**
 * Mengambil waktu sekarang dalam menit
 * berdasarkan zona waktu Asia/Jakarta.
 */
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

/**
 * Mengubah format jam menjadi total menit.
 * Contoh: "08:30" menjadi 510.
 */
export function toMinute(value: string): number {
  const normalize = value.trim().replace(".", ":");
  const [hour, minute] = normalize.split(":").map(Number);

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

/**
 * Mengubah rentang waktu menjadi total menit.
 * Contoh: "08:00 - 10:00".
 */
export function convertToNumber(tenggatWaktu: string) {
  const [startValue, endValue] = tenggatWaktu
    .split("-")
    .map((item) => item.trim());

  return {
    start: toMinute(startValue ?? ""),
    end: toMinute(endValue ?? ""),
  };
}

export function formatDateToYYYYMMDD(date: Date): string {
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

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}-${getPart("hour")}-${getPart("minute")}`;
}
