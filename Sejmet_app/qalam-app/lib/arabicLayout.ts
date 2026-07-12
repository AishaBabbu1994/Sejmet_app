// Mapeo del teclado físico QWERTY a la distribución árabe estándar (AR-101).
// La clave es la tecla física en minúscula (e.vi.key para letras, o el símbolo
// base para el resto). "base" es el carácter sin Mayús, "shift" es con Mayús.

export interface KeyDef {
  physical: string; // etiqueta visible en la tecla física (referencia, en QWERTY)
  base: string;
  shift: string;
}

export const arabicRows: KeyDef[][] = [
  [
    { physical: "`", base: "ذ", shift: "ّ" },
    { physical: "1", base: "١", shift: "!" },
    { physical: "2", base: "٢", shift: "@" },
    { physical: "3", base: "٣", shift: "#" },
    { physical: "4", base: "٤", shift: "$" },
    { physical: "5", base: "٥", shift: "%" },
    { physical: "6", base: "٦", shift: "^" },
    { physical: "7", base: "٧", shift: "&" },
    { physical: "8", base: "٨", shift: "*" },
    { physical: "9", base: "٩", shift: ")" },
    { physical: "0", base: "٠", shift: "(" },
    { physical: "-", base: "-", shift: "_" },
    { physical: "=", base: "=", shift: "+" },
  ],
  [
    { physical: "q", base: "ض", shift: "َ" },
    { physical: "w", base: "ص", shift: "ً" },
    { physical: "e", base: "ث", shift: "ُ" },
    { physical: "r", base: "ق", shift: "ٌ" },
    { physical: "t", base: "ف", shift: "لإ" },
    { physical: "y", base: "غ", shift: "إ" },
    { physical: "u", base: "ع", shift: "‘" },
    { physical: "i", base: "ه", shift: "÷" },
    { physical: "o", base: "خ", shift: "×" },
    { physical: "p", base: "ح", shift: "؛" },
    { physical: "[", base: "ج", shift: "<" },
    { physical: "]", base: "د", shift: ">" },
  ],
  [
    { physical: "a", base: "ش", shift: "ِ" },
    { physical: "s", base: "س", shift: "ٍ" },
    { physical: "d", base: "ي", shift: "]" },
    { physical: "f", base: "ب", shift: "[" },
    { physical: "g", base: "ل", shift: "لأ" },
    { physical: "h", base: "ا", shift: "أ" },
    { physical: "j", base: "ت", shift: "ـ" },
    { physical: "k", base: "ن", shift: "،" },
    { physical: "l", base: "م", shift: "/" },
    { physical: ";", base: "ك", shift: ":" },
    { physical: "'", base: "ط", shift: '"' },
  ],
  [
    { physical: "z", base: "ئ", shift: "~" },
    { physical: "x", base: "ء", shift: "ْ" },
    { physical: "c", base: "ؤ", shift: "}" },
    { physical: "v", base: "ر", shift: "{" },
    { physical: "b", base: "لا", shift: "لآ" },
    { physical: "n", base: "ى", shift: "آ" },
    { physical: "m", base: "ة", shift: "’" },
    { physical: ",", base: "و", shift: "," },
    { physical: ".", base: "." , shift: "." },
    { physical: "/", base: "ز", shift: "؟" },
  ],
];

// Índice rápido: tecla física (minúscula) -> KeyDef, para el manejo de eventos
// de teclado físico.
export const physicalKeyIndex: Record<string, KeyDef> = {};
arabicRows.forEach((row) =>
  row.forEach((key) => {
    physicalKeyIndex[key.physical] = key;
  })
);
