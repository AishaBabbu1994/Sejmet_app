"use client";

interface ToolbarProps {
  transliterationOn: boolean;
  onToggleTransliteration: () => void;
  physicalLayoutOn: boolean;
  onTogglePhysicalLayout: () => void;
  onCopy: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onTranslate: () => void;
  translating: boolean;
  onSearch: () => void;
  onEmail: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  copied: boolean;
}

function BtnBase({
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-30 ${
        active
          ? "border-gold bg-gold/90 text-ink"
          : "border-gold-dim/40 bg-ink-700/60 text-parchment/80 hover:bg-ink-600"
      } ${props.className || ""}`}
    />
  );
}

export default function Toolbar(props: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BtnBase active={props.transliterationOn} onClick={props.onToggleTransliteration}>
        سلام → salam {props.transliterationOn ? "· activado" : "· apagado"}
      </BtnBase>
      <BtnBase active={props.physicalLayoutOn} onClick={props.onTogglePhysicalLayout}>
        Teclado físico árabe (Esc) {props.physicalLayoutOn ? "· ON" : "· OFF"}
      </BtnBase>

      <span className="mx-1 h-4 w-px bg-gold-dim/30" />

      <BtnBase onClick={props.onUndo} disabled={!props.canUndo}>
        ↶ Deshacer
      </BtnBase>
      <BtnBase onClick={props.onRedo} disabled={!props.canRedo}>
        ↷ Rehacer
      </BtnBase>
      <BtnBase onClick={props.onClear}>Vaciar</BtnBase>
      <BtnBase onClick={props.onCopy}>{props.copied ? "Copiado ✓" : "Copiar"}</BtnBase>

      <span className="mx-1 h-4 w-px bg-gold-dim/30" />

      <BtnBase onClick={props.onTranslate} disabled={props.translating}>
        {props.translating ? "Traduciendo…" : "Traducir"}
      </BtnBase>
      <BtnBase onClick={props.onSearch}>Buscar en Google</BtnBase>
      <BtnBase onClick={props.onEmail}>Enviar por correo</BtnBase>

      <span className="mx-1 h-4 w-px bg-gold-dim/30" />

      <BtnBase onClick={props.onToggleTheme}>
        {props.theme === "dark" ? "☀ Modo claro" : "☾ Modo oscuro"}
      </BtnBase>
    </div>
  );
}
