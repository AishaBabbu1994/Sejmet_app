"use client";

import { HistoryEntry } from "@/lib/storage";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelect: (text: string) => void;
  onClear: () => void;
}

export default function HistoryPanel({ entries, onSelect, onClear }: HistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <p className="text-xs text-parchment/40">
        Tu historial de frases aparecerá aquí a medida que escribas y guardes texto.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-parchment/50">
          Historial reciente
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="focus-ring text-[11px] text-parchment/40 hover:text-terra"
        >
          Borrar historial
        </button>
      </div>
      <ul className="flex flex-col gap-1.5">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelect(entry.text)}
              dir="rtl"
              className="focus-ring w-full truncate rounded-lg border border-gold-dim/20 bg-ink-700/40 px-3 py-2 text-right font-arabicBody text-sm text-parchment/80 hover:border-gold-dim/50 hover:bg-ink-600/50"
            >
              {entry.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
