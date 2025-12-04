import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "stepHistory"; // per-day totals

export type StepHistoryEntry = {
  date: string; // YYYY-MM-DD
  steps: number;
};

export async function loadStepHistory(): Promise<StepHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StepHistoryEntry[];
  } catch {
    return [];
  }
}

export async function saveTodaySteps(steps: number) {
  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const history = await loadStepHistory();
  const idx = history.findIndex((h) => h.date === dateKey);

  if (idx >= 0) {
    history[idx].steps = steps;
  } else {
    history.push({ date: dateKey, steps });
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(history));
}

export function getLastNDays(
  history: StepHistoryEntry[],
  days: number
): StepHistoryEntry[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days - 1));
  return history
    .filter((h) => new Date(h.date) >= cutoff)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
