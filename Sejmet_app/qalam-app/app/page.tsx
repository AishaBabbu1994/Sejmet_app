"use client";

import { useEffect, useRef, useState } from "react";
import Keyboard from "@/components/Keyboard";
import Toolbar from "@/components/Toolbar";
import ApiKeyBar from "@/components/ApiKeyBar";
import SuggestionChips from "@/components/SuggestionChips";
import HistoryPanel from "@/components/HistoryPanel";
import { physicalKeyIndex } from "@/lib/arabicLayout";
import { fetchTransliteration, fetchTranslation, GroqError, Suggestion } from "@/lib/groqClient";
import {
  getStoredApiKey,
  setStoredApiKey,
  getHistory,
  pushHistory,
  clearHistory,
  HistoryEntry,
  getStoredTheme,
  setStoredTheme,
} from "@/lib/storage";

interface PendingTranslit {
  latin: string;
  suggestions: Suggestion[];
  rangeStart: number;
  rangeEnd: number;
  chosenIndex: number;
}

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [text, setText] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const [shiftActive, setShiftActive] = useState(false);
  const [transliterationOn, setTransliterationOn] = useState(true);
  const [physicalLayoutOn, setPhysicalLayoutOn] = useState(false);
  const [pendingTranslit, setPendingTranslit] = useState<PendingTranslit | null>(null);
  const [translitLoading, setTranslitLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef("");

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    setApiKey(getStoredApiKey());
    setHistory(getHistory());
    const t = getStoredTheme();
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
  }, []);

  useEffect(() => {
    if (!pendingTranslit) return;
    const timeout = setTimeout(() => setPendingTranslit(null), 6000);
    return () => clearTimeout(timeout);
  }, [pendingTranslit]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  function commitText(newText: string) {
    setPast((p) => [...p, textRef.current].slice(-100));
    setFuture([]);
    setText(newText);
  }

  function undo() {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [textRef.current, ...f].slice(0, 100));
      setText(prev);
      return p.slice(0, -1);
    });
  }

  function redo() {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, textRef.current].slice(-100));
      setText(next);
      return f.slice(1);
    });
  }

  function insertAtCursor(insert: string) {
    const ta = textareaRef.current;
    const start = ta?.selectionStart ?? textRef.current.length;
    const end = ta?.selectionEnd ?? textRef.current.length;
    const newText = textRef.current.slice(0, start) + insert + textRef.current.slice(end);
    commitText(newText);
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      const pos = start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  function handleBackspace() {
    const ta = textareaRef.current;
    const start = ta?.selectionStart ?? textRef.current.length;
    const end = ta?.selectionEnd ?? textRef.current.length;
    if (start === end && start === 0) return;
    const from = start === end ? start - 1 : start;
    const newText = textRef.current.slice(0, from) + textRef.current.slice(end);
    commitText(newText);
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(from, from);
    });
  }

  async function triggerTransliteration(word: string, start: number, end: number, isEnter: boolean) {
    if (!apiKey) {
      setError("Pega tu API key de Groq arriba para activar la transliteración.");
      return;
    }
    setTranslitLoading(true);
    try {
      const suggestions = await fetchTransliteration(apiKey, word);
      const finalList: Suggestion[] =
        suggestions.length > 0 ? suggestions : [{ arabic: word, note: "Sin sugerencias; se mantuvo el texto original." }];
      const chosen = finalList[0];
      const insertion = chosen.arabic + (isEnter ? "\n" : " ");
      const newText = textRef.current.slice(0, start) + insertion + textRef.current.slice(end);
      commitText(newText);
      setPendingTranslit({
        latin: word,
        suggestions: finalList,
        rangeStart: start,
        rangeEnd: start + chosen.arabic.length,
        chosenIndex: 0,
      });
      requestAnimationFrame(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.focus();
        const pos = start + insertion.length;
        ta.setSelectionRange(pos, pos);
      });
    } catch (err) {
      setError(err instanceof GroqError ? err.message : "No se pudo transliterar esa palabra.");
    } finally {
      setTranslitLoading(false);
    }
  }

  function pickSuggestion(index: number) {
    if (!pendingTranslit) return;
    const s = pendingTranslit.suggestions[index];
    if (!s) return;
    const { rangeStart, rangeEnd } = pendingTranslit;
    const newText = textRef.current.slice(0, rangeStart) + s.arabic + textRef.current.slice(rangeEnd);
    commitText(newText);
    setPendingTranslit({ ...pendingTranslit, chosenIndex: index, rangeEnd: rangeStart + s.arabic.length });
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      const pos = rangeStart + s.arabic.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (pendingTranslit && /^[1-9]$/.test(e.key) && !e.metaKey && !e.ctrlKey) {
      const idx = Number(e.key) - 1;
      if (idx < pendingTranslit.suggestions.length) {
        e.preventDefault();
        pickSuggestion(idx);
        return;
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setPhysicalLayoutOn((v) => !v);
      return;
    }

    if (physicalLayoutOn && !transliterationOn && e.key.length === 1) {
      const def = physicalKeyIndex[e.key.toLowerCase()];
      if (def) {
        e.preventDefault();
        insertAtCursor(e.shiftKey ? def.shift : def.base);
        return;
      }
    }

    if (transliterationOn && (e.key === " " || e.key === "Enter")) {
      const ta = e.currentTarget;
      const cursor = ta.selectionStart;
      const before = textRef.current.slice(0, cursor);
      const match = before.match(/([A-Za-z']+)$/);
      if (match) {
        e.preventDefault();
        const word = match[1];
        const wordStart = cursor - word.length;
        triggerTransliteration(word, wordStart, cursor, e.key === "Enter");
      }
    }
  }

  function handleApiKeySave(key: string) {
    setApiKey(key);
    setStoredApiKey(key);
  }

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setHistory(pushHistory(text));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("No se pudo copiar. Selecciona el texto manualmente.");
    }
  }

  async function handleTranslate() {
    if (!text.trim()) return;
    if (!apiKey) {
      setError("Pega tu API key de Groq arriba para poder traducir.");
      return;
    }
    setTranslating(true);
    setTranslationResult("");
    try {
      const translation = await fetchTranslation(apiKey, text, "es");
      setTranslationResult(translation);
    } catch (err) {
      setError(err instanceof GroqError ? err.message : "No se pudo traducir el texto.");
    } finally {
      setTranslating(false);
    }
  }

  function handleSearch() {
    if (!text.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, "_blank");
  }

  function handleEmail() {
    if (!text.trim()) return;
    window.location.href = `mailto:?body=${encodeURIComponent(text)}`;
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-parchment sm:text-4xl">
            Qalam
          </h1>
          <span dir="rtl" className="font-arabicDisplay text-2xl text-gold">
            قلم
          </span>
        </div>
        <p className="max-w-2xl text-sm text-parchment/60">
          Escribe en árabe desde cualquier ordenador o teléfono: teclado en pantalla, mapeo de tu
          teclado físico y transliteración fonética asistida por IA (Groq) que convierte lo que
          escribes en latín, como “salam”, en سلام.
        </p>
      </header>

      <ApiKeyBar apiKey={apiKey} onSave={handleApiKeySave} />

      {error && (
        <div className="rounded-lg border border-terra/50 bg-terra/10 px-4 py-2 text-sm text-terra">
          {error}
        </div>
      )}

      <Toolbar
        transliterationOn={transliterationOn}
        onToggleTransliteration={() => setTransliterationOn((v) => !v)}
        physicalLayoutOn={physicalLayoutOn}
        onTogglePhysicalLayout={() => setPhysicalLayoutOn((v) => !v)}
        onCopy={handleCopy}
        onUndo={undo}
        onRedo={redo}
        onClear={() => commitText("")}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onTranslate={handleTranslate}
        translating={translating}
        onSearch={handleSearch}
        onEmail={handleEmail}
        theme={theme}
        onToggleTheme={toggleTheme}
        copied={copied}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="flex flex-col gap-4">
          <div className="manuscript-page rounded-2xl p-4 sm:p-6">
            <textarea
              ref={textareaRef}
              dir="rtl"
              value={text}
              onChange={(e) => commitText(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder={
                transliterationOn
                  ? "Escribe en letras latinas, por sonido: marhaba, salam, shukran…"
                  : "Escribe o usa el teclado de abajo…"
              }
              spellCheck={false}
              className="focus-ring h-48 w-full resize-none bg-transparent font-arabicBody text-2xl leading-relaxed text-ink-800 placeholder:text-ink-600/40 sm:h-56 sm:text-3xl"
            />
            {translitLoading && (
              <div className="mt-1 text-right text-xs text-ink-600/60">Consultando grafías…</div>
            )}
          </div>

          {pendingTranslit && (
            <SuggestionChips
              latin={pendingTranslit.latin}
              suggestions={pendingTranslit.suggestions}
              chosenIndex={pendingTranslit.chosenIndex}
              onPick={pickSuggestion}
              onDismiss={() => setPendingTranslit(null)}
            />
          )}

          {translationResult && (
            <div className="rounded-xl border border-teal/40 bg-teal/10 p-4">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-light">
                Traducción
              </h3>
              <p className="text-sm text-parchment/90">{translationResult}</p>
            </div>
          )}

          <Keyboard
            shiftActive={shiftActive}
            onToggleShift={() => setShiftActive((v) => !v)}
            onKey={insertAtCursor}
            onBackspace={handleBackspace}
            onEnter={() => insertAtCursor("\n")}
            onSpace={() => insertAtCursor(" ")}
            disabled={transliterationOn}
          />
          {transliterationOn && (
            <p className="text-[11px] text-parchment/40">
              El teclado en pantalla se desactiva mientras la transliteración por sonido está
              activada. Apágala arriba para escribir letra a letra con el mouse.
            </p>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-xl border border-gold-dim/30 bg-ink-700/40 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-parchment/50">
              Cómo escribir
            </h3>
            <ul className="space-y-1.5 text-xs leading-relaxed text-parchment/60">
              <li>• Con transliteración activada, escribe por sonido y pulsa espacio.</li>
              <li>• Pulsa 1–5 justo después para cambiar por otra grafía sugerida.</li>
              <li>• O clica las teclas árabes de abajo con el mouse.</li>
              <li>• Esc activa/desactiva el mapeo de tu teclado físico a árabe.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gold-dim/30 bg-ink-700/40 p-4">
            <HistoryPanel
              entries={history}
              onSelect={(t) => commitText(t)}
              onClear={() => {
                clearHistory();
                setHistory([]);
              }}
            />
          </div>
        </aside>
      </div>

      <footer className="mt-4 border-t border-gold-dim/20 pt-4 text-center text-[11px] text-parchment/30">
        Qalam es un proyecto independiente. La transliteración y la traducción se generan con un
        modelo de lenguaje y pueden contener errores: revisa el resultado antes de usarlo.
      </footer>
    </main>
  );
}
