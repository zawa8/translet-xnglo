import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, mode = "translate", target = "hi" } = await req.json();
    if (!text) return NextResponse.json({ resultText: "" });

    if (mode === "transliterate") {
      let itcCode = "hi-t-i0-und";
      if (target === "bn") itcCode = "bn-t-i0-und";
      if (target === "pa") itcCode = "pa-t-i0-und";
      if (target === "gu") itcCode = "gu-t-i0-und";
      if (target === "or") itcCode = "or-t-i0-und";
      if (target === "ta") itcCode = "ta-t-i0-und";
      if (target === "te") itcCode = "te-t-i0-und";
      if (target === "kn") itcCode = "kn-t-i0-und";
      if (target === "ml") itcCode = "ml-t-i0-und";

      const tokens = text.match(/([a-zA-Z]+|[^a-zA-Z]+)/g) || [text];
      const transliteratedTokens = [];

      for (const token of tokens) {
        if (/^[a-zA-Z]+$/.test(token)) {
          try {
            const url = `https://inputtools.google.com/request?text=${encodeURIComponent(token)}&itc=${itcCode}&num=1`;
            const response = await fetch(url);
            const data = await response.json();
            const localizedWord = data[1]?.[0]?.[1]?.[0] || token;
            transliteratedTokens.push(localizedWord);
          } catch {
            transliteratedTokens.push(token);
          }
        } else {
          transliteratedTokens.push(token);
        }
      }

      return NextResponse.json({ resultText: transliteratedTokens.join("") });
    } else {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      const translatedText = data[0]?.map((item: any) => item[0]).join("") || text;

      return NextResponse.json({ resultText: translatedText });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}