"use client";

import { Suggestion } from "@/lib/groqClient";

interface SuggestionChipsProps {
  latin: string;
  suggestions: Suggestion[];
  chosenIndex: number;
  onPick: (index: number) => void;
  onDismiss: () => void;
}

export default function SuggestionChips({
  latin,
  suggestions,
  chosenIndex,
  onPick,
  onDismiss,
}: SuggestionChipsProps) {
  if (suggestions.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-teal/40 bg-teal/10 px-3 py-2 text-sm">
      <span className="text-xs text-parchment/60">
        ¿Otra grafía para <span className="font-semibold text-parchment/80">“{latin}”</span>?
      </span>
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(i)}
          className={`focus-ring rounded-full border px-3 py-1 font-arabicBody text-base ${
            i === chosenIndex
              ? "border-gold bg-gold/90 text-ink"
              : "border-teal-light/40 bg-ink-700/60 text-parchment hover:bg-ink-600"
          }`}
          title={s.note || undefined}
        >
          {s.arabic}
          <span className="ml-1 align-middle text-[10px] text-parchment/40">{i + 1}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onDismiss}
        className="focus-ring ml-auto text-[11px] text-parchment/40 hover:text-parchment/70"
      >
        Cerrar
      </button>
    </div>
  );
}
