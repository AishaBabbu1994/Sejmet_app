"use client";

import { arabicRows } from "@/lib/arabicLayout";

interface KeyboardProps {
  shiftActive: boolean;
  onToggleShift: () => void;
  onKey: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  disabled?: boolean;
}

export default function Keyboard({
  shiftActive,
  onToggleShift,
  onKey,
  onBackspace,
  onEnter,
  onSpace,
  disabled,
}: KeyboardProps) {
  return (
    <div
      className={`rounded-2xl border border-gold-dim/40 bg-ink-700/60 p-3 sm:p-4 ${
        disabled ? "opacity-40 pointer-events-none" : ""
      }`}
      dir="rtl"
      aria-label="Teclado árabe en pantalla"
    >
      <div className="flex flex-col gap-1.5">
        {arabicRows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5">
            {i === 1 && (
              <button
                type="button"
                onClick={onBackspace}
                className="key-tile focus-ring shrink-0 rounded-lg border border-gold-dim/40 bg-ink-600 px-3 text-xs text-parchment/80 hover:bg-ink-600/70"
              >
                ⌫
              </button>
            )}
            {row.map((k) => (
              <button
                key={k.physical}
                type="button"
                onClick={() => onKey(shiftActive ? k.shift : k.base)}
                className="key-tile focus-ring flex h-10 w-9 flex-col items-center justify-center rounded-lg border border-gold-dim/30 bg-ink-600 text-base text-parchment hover:bg-ink-600/70 sm:h-11 sm:w-10"
              >
                <span className="font-arabicBody leading-none">
                  {shiftActive ? k.shift : k.base}
                </span>
              </button>
            ))}
            {i === 3 && (
              <button
                type="button"
                onClick={onEnter}
                className="key-tile focus-ring shrink-0 rounded-lg border border-gold-dim/40 bg-ink-600 px-3 text-xs text-parchment/80 hover:bg-ink-600/70"
              >
                ↵
              </button>
            )}
          </div>
        ))}
        <div className="mt-1 flex justify-center gap-1.5">
          <button
            type="button"
            onClick={onToggleShift}
            aria-pressed={shiftActive}
            className={`key-tile focus-ring rounded-lg border px-4 text-xs font-medium ${
              shiftActive
                ? "border-gold bg-gold/90 text-ink"
                : "border-gold-dim/40 bg-ink-600 text-parchment/80 hover:bg-ink-600/70"
            }`}
          >
            Mayús (Shift)
          </button>
          <button
            type="button"
            onClick={onSpace}
            className="key-tile focus-ring h-9 flex-1 max-w-sm rounded-lg border border-gold-dim/30 bg-ink-600 text-xs text-parchment/60 hover:bg-ink-600/70"
          >
            espacio
          </button>
        </div>
      </div>
    </div>
  );
}
