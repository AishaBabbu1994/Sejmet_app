export interface Suggestion {
  arabic: string;
  note?: string;
}

export class GroqError extends Error {}

async function callGroq(payload: Record<string, unknown>) {
  const res = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new GroqError(data?.error || "Error desconocido al llamar a Groq.");
  }
  return data;
}

export async function fetchTransliteration(
  apiKey: string,
  latinWord: string
): Promise<Suggestion[]> {
  const data = await callGroq({ apiKey, mode: "transliterate", text: latinWord });
  const suggestions: Suggestion[] = Array.isArray(data?.suggestions) ? data.suggestions : [];
  return suggestions.filter((s) => s && typeof s.arabic === "string" && s.arabic.trim().length > 0);
}

export async function fetchTranslation(
  apiKey: string,
  arabicText: string,
  targetLanguage: "es" | "en" = "es"
): Promise<string> {
  const data = await callGroq({ apiKey, mode: "translate", text: arabicText, targetLanguage });
  return typeof data?.translation === "string" ? data.translation : "";
}
