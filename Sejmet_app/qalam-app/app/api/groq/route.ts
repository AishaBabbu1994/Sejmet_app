import { NextRequest, NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const TRANSLITERATE_PROMPT = `Eres un motor de transliteración fonética de letras latinas a escritura árabe (فصحى / árabe estándar moderno).
Recibes una palabra o frase corta escrita con letras latinas, tal y como suena en árabe, y debes proponer las grafías árabes más probables.
Responde EXCLUSIVAMENTE con un JSON válido, sin texto adicional, con esta forma exacta:
{"suggestions": [{"arabic": "كلمة", "note": "aclaración breve en español o cadena vacía"}]}
Devuelve como máximo 5 sugerencias, ordenadas de más a menos probable. Si la entrada ya está en árabe, devuélvela tal cual como única sugerencia.`;

const TRANSLATE_PROMPT = `Eres un traductor. Recibes un texto en árabe y debes traducirlo de forma natural.
Responde EXCLUSIVAMENTE con un JSON válido, sin texto adicional, con esta forma exacta:
{"translation": "texto traducido", "target_language": "es"}`;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const { apiKey, mode, text, targetLanguage } = body || {};

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "Falta la API key de Groq. Pégala en la barra superior de la app." },
      { status: 401 }
    );
  }
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Falta el texto a procesar." }, { status: 400 });
  }

  let systemPrompt = "";
  let userContent = "";

  if (mode === "transliterate") {
    systemPrompt = TRANSLITERATE_PROMPT;
    userContent = text;
  } else if (mode === "translate") {
    const lang = targetLanguage === "en" ? "inglés" : "español";
    systemPrompt = `${TRANSLATE_PROMPT}\nIdioma de destino: ${lang} (código "${targetLanguage || "es"}").`;
    userContent = text;
  } else {
    return NextResponse.json({ error: "Modo no soportado." }, { status: 400 });
  }

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      let message = `Error de la API de Groq (${groqRes.status}).`;
      if (groqRes.status === 401) message = "La API key de Groq no es válida.";
      if (groqRes.status === 429) message = "Se alcanzó el límite de peticiones de Groq. Espera unos segundos.";
      return NextResponse.json({ error: message, detail: errText.slice(0, 300) }, { status: groqRes.status });
    }

    const data = await groqRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { suggestions: [], translation: raw };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json(
      { error: "No se pudo contactar con Groq. Revisa tu conexión e inténtalo de nuevo." },
      { status: 502 }
    );
  }
}
