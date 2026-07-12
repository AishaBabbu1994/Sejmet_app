"use client";

import { useState } from "react";

interface ApiKeyBarProps {
  apiKey: string;
  onSave: (key: string) => void;
}

export default function ApiKeyBar({ apiKey, onSave }: ApiKeyBarProps) {
  const [draft, setDraft] = useState(apiKey);
  const [visible, setVisible] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const save = () => {
    onSave(draft.trim());
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <div className="rounded-xl border border-gold-dim/40 bg-ink-700/70 p-3 sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="groq-key" className="shrink-0 text-xs font-medium text-parchment/70 sm:w-56">
          Tu API key de Groq (solo en tu navegador)
        </label>
        <div className="flex flex-1 gap-2">
          <input
            id="groq-key"
            type={visible ? "text" : "password"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="gsk_..."
            className="focus-ring w-full rounded-lg border border-gold-dim/40 bg-ink px-3 py-2 text-sm text-parchment placeholder:text-parchment/30"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="focus-ring shrink-0 rounded-lg border border-gold-dim/40 px-3 text-xs text-parchment/70 hover:bg-ink-600"
          >
            {visible ? "Ocultar" : "Ver"}
          </button>
          <button
            type="button"
            onClick={save}
            className="focus-ring shrink-0 rounded-lg bg-gold px-4 text-xs font-semibold text-ink hover:bg-gold-light"
          >
            {savedFlash ? "Guardada ✓" : "Guardar"}
          </button>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-parchment/50">
        Tu key se guarda únicamente con localStorage en este navegador y viaja directamente a Groq en
        cada petición; Qalam no la almacena en ningún servidor. Consíguela gratis en{" "}
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-gold-dim underline-offset-2 hover:text-gold"
        >
          console.groq.com/keys
        </a>
        .
      </p>
    </div>
  );
}
