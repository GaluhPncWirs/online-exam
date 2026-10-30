export const examKey = (examId: string, name: string) =>
  `exam-${examId}-${name}`;

export function readStorage(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage penuh / diblokir, abaikan
  }
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function clearExamStorage(examId: string) {
  ["mark", "answer-pg", "answer-essay", "random", "timer"].forEach((name) =>
    localStorage.removeItem(examKey(examId, name)),
  );
}
