import { convertToNumber, getCurrentTimeInMinutes } from "./convertDate";

const MONTHS_ID: Record<string, number> = {
  Januari: 0,
  Februari: 1,
  Maret: 2,
  April: 3,
  Mei: 4,
  Juni: 5,
  Juli: 6,
  Agustus: 7,
  September: 8,
  Oktober: 9,
  November: 10,
  Desember: 11,
};

type DateInput = Date | string | number;

type ParsedDate = {
  day: number;
  month: number;
  year: number;
};

export function parseIndonesianDate(dateInput: DateInput): ParsedDate | null {
  // Jika input berupa Date, string timestamp, atau angka
  if (dateInput instanceof Date || typeof dateInput === "number") {
    const date = new Date(dateInput);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(date);

    const getPart = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value);

    return {
      day: getPart("day"),
      month: getPart("month") - 1,
      year: getPart("year"),
    };
  }

  const value = dateInput.trim();

  // Format tanggal Indonesia: "22 Oktober 2026"
  const match = value.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);

  if (match) {
    const [, day, month, year] = match;
    const monthIndex = MONTHS_ID[month.toLowerCase()];

    if (monthIndex === undefined) {
      return null;
    }

    const parsedDay = Number(day);
    const parsedYear = Number(year);

    const validationDate = new Date(
      Date.UTC(parsedYear, monthIndex, parsedDay),
    );

    if (
      validationDate.getUTCFullYear() !== parsedYear ||
      validationDate.getUTCMonth() !== monthIndex ||
      validationDate.getUTCDate() !== parsedDay
    ) {
      return null;
    }

    return {
      day: parsedDay,
      month: monthIndex,
      year: parsedYear,
    };
  }

  // Format timestamp ISO atau format tanggal yang didukung Date
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);

  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    day: getPart("day"),
    month: getPart("month") - 1,
    year: getPart("year"),
  };
}

export function getTodayIndonesia(): ParsedDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(new Date());

  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    day: getPart("day"),
    month: getPart("month") - 1,
    year: getPart("year"),
  };
}

type ExamStatus = "BELUM_MULAI" | "BERLANGSUNG" | "LEWAT";

export function getExamStatus(
  tenggatWaktu: Date,
  tglUjian: DateInput,
): ExamStatus {
  const { start, end } = convertToNumber(tenggatWaktu.toISOString());

  const examDate = parseIndonesianDate(tglUjian);
  const today = getTodayIndonesia();
  const currentMinute = getCurrentTimeInMinutes();

  if (!examDate || Number.isNaN(start) || Number.isNaN(end)) {
    return "LEWAT";
  }

  const examDateNumber =
    examDate.year * 10000 + (examDate.month + 1) * 100 + examDate.day;

  const todayNumber = today.year * 10000 + (today.month + 1) * 100 + today.day;

  // Ujian di hari yang akan datang
  if (examDateNumber > todayNumber) {
    return "BELUM_MULAI";
  }

  // Ujian di hari yang sudah lewat
  if (examDateNumber < todayNumber) {
    return "LEWAT";
  }

  // Ujian hari ini
  if (currentMinute < start) {
    return "BELUM_MULAI";
  }

  if (currentMinute >= end) {
    return "LEWAT";
  }

  return "BERLANGSUNG";
}
