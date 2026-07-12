const API_KEY_STORAGE = "qalam_groq_api_key";
const HISTORY_STORAGE = "qalam_history";
const THEME_STORAGE = "qalam_theme";

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(API_KEY_STORAGE) || "";
}

export function setStoredApiKey(key: string) {
  if (typeof window === "undefined") return;
  if (key) window.localStorage.setItem(API_KEY_STORAGE, key);
  else window.localStorage.removeItem(API_KEY_STORAGE);
}

export interface HistoryEntry {
  id: string;
  text: string;
  createdAt: number;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushHistory(text: string): HistoryEntry[] {
  const entry: HistoryEntry = { id: crypto.randomUUID(), text, createdAt: Date.now() };
  const current = getHistory().filter((h) => h.text !== text);
  const next = [entry, ...current].slice(0, 20);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(HISTORY_STORAGE, JSON.stringify(next));
  }
  return next;
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_STORAGE);
}

export function getStoredTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (window.localStorage.getItem(THEME_STORAGE) as "dark" | "light") || "dark";
}

export function setStoredTheme(theme: "dark" | "light") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE, theme);
}
