"use client";

import React, { useState } from "react";
import { 
  HINDI_CHAR_MAP, HINDI_KEYS_SORTED, 
  BENGALI_CHAR_MAP, BENGALI_KEYS_SORTED, 
  PUNJABI_CHAR_MAP, PUNJABI_KEYS_SORTED,
  GUJARATI_CHAR_MAP, GUJARATI_KEYS_SORTED,
  ODIA_CHAR_MAP, ODIA_KEYS_SORTED,
  TAMIL_CHAR_MAP, TAMIL_KEYS_SORTED,
  TELUGU_CHAR_MAP, TELUGU_KEYS_SORTED,
  KANNADA_CHAR_MAP, KANNADA_KEYS_SORTED,
  MALAYALAM_CHAR_MAP, MALAYALAM_KEYS_SORTED,
  scriptToXnglo 
} from "@/lib/mappings";

export default function HomePage() {
  const [mode, setMode] = useState<string>("e52-to-all");
  const [inputText, setInputText] = useState<string>("");
  const [x38Output, setX38Output] = useState<string>("");
  const [xv38Output, setXv38Output] = useState<string>("");
  const [xb38Output, setXb38Output] = useState<string>("");
  const [xp38Output, setXp38Output] = useState<string>("");
  const [xg38Output, setXg38Output] = useState<string>("");
  const [xo38Output, setXo38Output] = useState<string>("");
  const [xjm38Output, setXjm38Output] = useState<string>("");
  const [xjelugu38Output, setXjelugu38Output] = useState<string>("");
  const [xk38Output, setXk38Output] = useState<string>("");
  const [xm38Output, setXm38Output] = useState<string>("");

  const clearAllOutputs = () => {
    setX38Output(""); setXv38Output(""); setXb38Output(""); setXp38Output("");
    setXg38Output(""); setXo38Output(""); setXjm38Output(""); setXjelugu38Output("");
    setXk38Output(""); setXm38Output("");
  };

  const handleTranslate = async (text: string, currentMode: string) => {
    setInputText(text);
    if (!text.trim()) {
      clearAllOutputs();
      return;
    }

    try {
      if (currentMode === "e52-to-all" || currentMode === "e52-to-x38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "transliterate", target: "hi" }),
        });
        const data = await res.json();
        setX38Output(scriptToXnglo(data.resultText || text, HINDI_CHAR_MAP, HINDI_KEYS_SORTED));
      }

      if (currentMode === "e52-to-all") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "hi" }),
        });
        const data = await res.json();
        setXv38Output(scriptToXnglo(data.resultText || text, HINDI_CHAR_MAP, HINDI_KEYS_SORTED));
      }

      if (currentMode === "vinqi-to-xv38") {
        setXv38Output(scriptToXnglo(text, HINDI_CHAR_MAP, HINDI_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xb38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "bn" }),
        });
        const data = await res.json();
        setXb38Output(scriptToXnglo(data.resultText || text, BENGALI_CHAR_MAP, BENGALI_KEYS_SORTED));
      }

      if (currentMode === "bngali-to-xb38") {
        setXb38Output(scriptToXnglo(text, BENGALI_CHAR_MAP, BENGALI_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xp38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "pa" }),
        });
        const data = await res.json();
        setXp38Output(scriptToXnglo(data.resultText || text, PUNJABI_CHAR_MAP, PUNJABI_KEYS_SORTED));
      }

      if (currentMode === "pnjabi-to-xp38") {
        setXp38Output(scriptToXnglo(text, PUNJABI_CHAR_MAP, PUNJABI_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xg38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "gu" }),
        });
        const data = await res.json();
        setXg38Output(scriptToXnglo(data.resultText || text, GUJARATI_CHAR_MAP, GUJARATI_KEYS_SORTED));
      }
      if (currentMode === "guzraji-to-xg38") {
        setXg38Output(scriptToXnglo(text, GUJARATI_CHAR_MAP, GUJARATI_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xo38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "or" }),
        });
        const data = await res.json();
        setXo38Output(scriptToXnglo(data.resultText || text, ODIA_CHAR_MAP, ODIA_KEYS_SORTED));
      }
      if (currentMode === "odia-to-xo38") {
        setXo38Output(scriptToXnglo(text, ODIA_CHAR_MAP, ODIA_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xjm38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "ta" }),
        });
        const data = await res.json();
        setXjm38Output(scriptToXnglo(data.resultText || text, TAMIL_CHAR_MAP, TAMIL_KEYS_SORTED));
      }
      if (currentMode === "jmil-to-xjm38") {
        setXjm38Output(scriptToXnglo(text, TAMIL_CHAR_MAP, TAMIL_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xjelugu38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "te" }),
        });
        const data = await res.json();
        setXjelugu38Output(scriptToXnglo(data.resultText || text, TELUGU_CHAR_MAP, TELUGU_KEYS_SORTED));
      }
      if (currentMode === "jelugu-to-xjelugu38") {
        setXjelugu38Output(scriptToXnglo(text, TELUGU_CHAR_MAP, TELUGU_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xk38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "kn" }),
        });
        const data = await res.json();
        setXk38Output(scriptToXnglo(data.resultText || text, KANNADA_CHAR_MAP, KANNADA_KEYS_SORTED));
      }
      if (currentMode === "kxnxdda-to-xk38") {
        setXk38Output(scriptToXnglo(text, KANNADA_CHAR_MAP, KANNADA_KEYS_SORTED));
      }

      if (currentMode === "e52-to-xm38") {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "translate", target: "ml" }),
        });
        const data = await res.json();
        setXm38Output(scriptToXnglo(data.resultText || text, MALAYALAM_CHAR_MAP, MALAYALAM_KEYS_SORTED));
      }
      if (currentMode === "mlyalxm-to-xm38") {
        setXm38Output(scriptToXnglo(text, MALAYALAM_CHAR_MAP, MALAYALAM_KEYS_SORTED));
      }

    } catch (error) {
      console.error("Conversion error:", error);
    }
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setInputText("");
    clearAllOutputs();
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">xNglo Translator</h1>
          <div className="flex gap-2">
            <a href="/" className="text-sm bg-gray-900 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-800 transition">
              K12 →
            </a>
            <a href="/kilasall/subzectwords/lesson_wrdmining" className="text-sm bg-gray-900 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-800 transition">
              View TSV Dataset →
            </a>
          </div>
        </div>

        {/* Mode Select Box */}
        <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <label className="text-sm font-medium text-gray-300">Transformation Mode:</label>
          <select
            value={mode}
            onChange={(e) => handleModeChange(e.target.value)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="e52-to-all">1) e52 / x38 / xv38 (Hindi 3 Textareas)</option>
            <option value="vinqi-to-xv38">2) vinqi → xv38</option>
            <option value="e52-to-x38">3) e52 → x38</option>
            <option value="e52-to-xb38">4) e52 → xb38 (Bangla)</option>
            <option value="bngali-to-xb38">5) bNgali → xb38</option>
            <option value="e52-to-xp38">6) e52 → xp38 (Punjabi)</option>
            <option value="pnjabi-to-xp38">7) pnjabi → xp38</option>
            <option value="e52-to-xg38">8) e52 → xg38 (Gujarati)</option>
            <option value="guzraji-to-xg38">9) guzraji → xg38</option>
            <option value="e52-to-xo38">10) e52 → xo38 (Odia)</option>
            <option value="odia-to-xo38">11) odia → xo38</option>
            <option value="e52-to-xjm38">12) e52 → xjm38 (Tamil)</option>
            <option value="jmil-to-xjm38">13) jmil → xjm38</option>
            <option value="e52-to-xjelugu38">14) e52 → xjelugu38 (Telugu)</option>
            <option value="jelugu-to-xjelugu38">15) jelugu → xjelugu38</option>
            <option value="e52-to-xk38">16) e52 → xk38 (Kannada)</option>
            <option value="kxnxdda-to-xk38">17) kxnxdda → xk38</option>
            <option value="e52-to-xm38">18) e52 → xm38 (Malayalam)</option>
            <option value="mlyalxm-to-xm38">19) mlyalxm → xm38</option>
          </select>
        </div>

        {/* Dynamic Textarea Layouts */}
        {mode === "e52-to-all" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2"><label className="text-sm font-medium text-gray-300">input (e52 / english)</label><textarea rows={8} value={inputText} onChange={(e) => handleTranslate(e.target.value, mode)} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm" /></div>
            <div className="flex flex-col space-y-2"><label className="text-sm font-medium text-gray-300">x38</label><textarea rows={8} readOnly value={x38Output} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm cursor-not-allowed" /></div>
            <div className="flex flex-col space-y-2"><label className="text-sm font-medium text-gray-300">xv38</label><textarea rows={8} readOnly value={xv38Output} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm cursor-not-allowed" /></div>
          </div>
        )}

        {mode !== "e52-to-all" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-300">input text</label>
              <textarea rows={8} value={inputText} onChange={(e) => handleTranslate(e.target.value, mode)} placeholder="Enter text..." className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-300">Output Area</label>
              <textarea rows={8} readOnly value={
                mode.includes("xb38") ? xb38Output :
                mode.includes("xp38") ? xp38Output :
                mode.includes("xg38") ? xg38Output :
                mode.includes("xo38") ? xo38Output :
                mode.includes("xjm38") ? xjm38Output :
                mode.includes("xjelugu38") ? xjelugu38Output :
                mode.includes("xk38") ? xk38Output :
                mode.includes("xm38") ? xm38Output : xv38Output
              } className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm cursor-not-allowed" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}