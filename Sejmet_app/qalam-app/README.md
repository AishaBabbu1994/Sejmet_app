# Qalam — teclado árabe con transliteración por IA

Qalam es una app web que te permite escribir en árabe desde cualquier ordenador o teléfono,
sin instalar nada: un teclado en pantalla, el mapeo de tu propio teclado físico a la distribución
árabe (AR-101), y transliteración fonética asistida por IA (por ejemplo, escribes `salam` y Qalam
propone `سلام`). También incluye traducción rápida del texto, copiar al portapapeles, búsqueda en
Google, envío por correo, historial local de frases y modo claro/oscuro.

No es una copia de ninguna herramienta existente: marca, diseño, textos y código son propios,
construidos desde cero con Next.js, Tailwind y la API de Groq.

## Cómo funciona para la persona que lo usa

1. Pega su propia API key de Groq en la barra superior (se guarda solo en su navegador).
2. Escribe:
   - Con la **transliteración** activada (interruptor "سلام → salam"), escribe la palabra tal
     como suena, por ejemplo `marhaba`, y al pulsar espacio o Enter, Qalam la convierte a árabe.
     Justo después puede pulsar una tecla del 1 al 5 para cambiar por otra grafía sugerida.
   - Con la transliteración apagada, puede activar el **teclado físico árabe** (tecla Esc) para
     que su propio teclado escriba directamente en árabe (distribución AR-101), o usar el
     **teclado en pantalla** haciendo clic con el ratón o el dedo.
3. Cuando el texto está listo: **Copiar** para pegarlo en WhatsApp, un documento o un buscador;
   o usar los atajos **Traducir**, **Buscar en Google** y **Enviar por correo** directamente
   desde la app.

## Requisitos

- Node.js 18.18 o superior
- Una cuenta gratuita en [Groq](https://console.groq.com)

## Cómo obtener tu API key de Groq (gratis)

1. Entra en [console.groq.com](https://console.groq.com) y crea una cuenta (puedes usar Google
   o GitHub).
2. En el menú lateral, ve a **API Keys**.
3. Pulsa **Create API Key**, ponle un nombre (por ejemplo "qalam") y cópiala. Empieza por `gsk_`.
4. Guárdala en un sitio seguro: Groq solo la muestra una vez.

En Qalam, pega esa key en la barra "Tu API key de Groq" que aparece en la parte superior de la
app. Se guarda únicamente en el `localStorage` de tu navegador y viaja directamente desde tu
navegador hasta Groq en cada petición de transliteración o traducción; el servidor de Qalam
nunca la almacena ni la ve en texto plano más allá de reenviar la petición.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub (o GitLab/Bitbucket).
2. Entra en [vercel.com](https://vercel.com), pulsa **Add New → Project** e importa el
   repositorio.
3. Vercel detecta automáticamente que es un proyecto Next.js: no hace falta configurar nada más
   ni añadir variables de entorno, porque cada persona usa su propia API key de Groq desde el
   navegador.
4. Pulsa **Deploy**. En un par de minutos tendrás tu URL pública (`tu-proyecto.vercel.app`).
5. (Opcional) Añade un dominio propio desde **Project → Settings → Domains**.

Como la API key vive en el navegador de cada usuario, puedes compartir la URL pública libremente:
cada persona necesitará pegar su propia key de Groq (el plan gratuito de Groq es suficiente para
uso normal).

## Estructura del proyecto

```
app/
  api/groq/route.ts   → proxy server-side hacia la API de Groq (no guarda la key)
  layout.tsx           → fuentes y metadatos globales
  page.tsx              → pantalla principal (editor, teclado, lógica de transliteración)
  globals.css            → estilos base y el "manuscript-page" (lienzo de escritura)
components/
  Keyboard.tsx           → teclado árabe en pantalla
  ApiKeyBar.tsx           → barra para pegar la API key
  Toolbar.tsx              → acciones (copiar, deshacer, traducir, buscar, tema…)
  SuggestionChips.tsx       → alternativas de grafía tras transliterar una palabra
  HistoryPanel.tsx           → historial local de frases
lib/
  arabicLayout.ts           → mapeo de teclado físico a distribución árabe AR-101
  groqClient.ts               → funciones que llaman a /api/groq desde el navegador
  storage.ts                   → helpers de localStorage (key, historial, tema)
```

## Notas

- El modelo usado en Groq es `llama-3.3-70b-versatile`. Puedes cambiarlo editando
  `MODEL` en `app/api/groq/route.ts`.
- La transliteración y la traducción las genera un modelo de lenguaje: revisa siempre el
  resultado antes de usarlo en algo importante.
