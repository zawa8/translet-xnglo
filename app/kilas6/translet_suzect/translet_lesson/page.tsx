"use client";

import React, { useState } from "react";
import { hsciistr } from "@hscii/htrlib";

// Maps each dropdown mode to how htrlib should run it. Most modes are
// a straight (phrom, tu) pair that htrlib's duztr() handles entirely
// itself -- translate/transliterate (for e52 input) or script
// auto-detection (for u10 native-script input), then xi38 conversion.
//
// KNOWN LIBRARY BUG (htrlib 1.0.33): 'xg38' (Gujarati) is present in
// hsciistr.e52_x38_translatecode_dict and in the output{} initializer,
// but missing from hsciistr.tu_dikt -- the whitelist the constructor
// and set_tu() validate against. Passing 'xg38' as tu fails that
// validation and silently falls back to tu='xi38', mislabeling the
// result. Worked around below by calling the lower-level primitives
// directly for Gujarati instead of going through duztr()'s tu-gated
// dispatch. Flagging this so it can be fixed upstream in htrlib
// (just add xg38 to tu_dikt) -- once that lands, GUJARATI_WORKAROUND
// can be deleted and xg38 folded into MODE_CONFIG like the others.
const GUJARATI_TRANSLATE_CODE = "gu";

type ModeConfig =
  | { kind: "e52-all" } // mode 1: two outputs at once (xe38 + xv38)
  | { kind: "single"; phrom: string; tu: string; gujaratiWorkaround?: boolean };

const MODE_CONFIG: Record<string, ModeConfig> = {
  "e52-to-all": { kind: "e52-all" },
  "vinqi-to-xv38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xv38 },
  "e52-to-x38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xe38 },
  "e52-to-xb38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xb38 },
  "bngali-to-xb38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xb38 },
  "e52-to-xp38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xp38 },
  "pnjabi-to-xp38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xp38 },
  "e52-to-xg38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: "xg38", gujaratiWorkaround: true },
  "guzraji-to-xg38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: "xg38", gujaratiWorkaround: true },
  "e52-to-xo38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xo38 },
  "odia-to-xo38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xo38 },
  // Tamil = xt38 and Telugu = xj38 in htrlib's own dicts -- the page's
  // state variable names below (xjm38.../xjelugu38...) predate the
  // published library and use a different naming convention; kept as
  // -is for UI/state continuity, mapped to the correct htrlib tu here.
  "e52-to-xjm38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xt38 },
  "jmil-to-xjm38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xt38 },
  "e52-to-xjelugu38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xj38 },
  "jelugu-to-xjelugu38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xj38 },
  "e52-to-xk38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xk38 },
  "kxnxdda-to-xk38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xk38 },
  "e52-to-xm38": { kind: "single", phrom: hsciistr.phrom_dikt.e52, tu: hsciistr.tu_dikt.xm38 },
  "mlyalxm-to-xm38": { kind: "single", phrom: hsciistr.phrom_dikt.u10, tu: hsciistr.tu_dikt.xm38 },
};

/** Gujarati workaround: bypasses duztr()'s tu_dikt-gated dispatch (see comment above), calling the same primitives it would have used. */
async function runGujaratiWorkaround(text: string, isNativeScriptInput: boolean): Promise<string> {
  const instance = new hsciistr(hsciistr.phrom_dikt.e52, hsciistr.tu_dikt.xi38).set_input(text);
  if (!isNativeScriptInput) {
    await instance.translate_e52_x(GUJARATI_TRANSLATE_CODE);
  }
  instance.uL2xin38();
  return instance.output.xi38;
}

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

  // Which setState to write a mode's single output into.
  const outputSetterFor = (modeKey: string) => {
    if (modeKey.includes("xb38")) return setXb38Output;
    if (modeKey.includes("xp38")) return setXp38Output;
    if (modeKey.includes("xg38")) return setXg38Output;
    if (modeKey.includes("xo38")) return setXo38Output;
    if (modeKey.includes("xjm38")) return setXjm38Output;
    if (modeKey.includes("xjelugu38")) return setXjelugu38Output;
    if (modeKey.includes("xk38")) return setXk38Output;
    if (modeKey.includes("xm38")) return setXm38Output;
    return setXv38Output; // vinqi-to-xv38
  };

  const handleTranslate = async (text: string, currentMode: string) => {
    setInputText(text);
    if (!text.trim()) {
      clearAllOutputs();
      return;
    }

    try {
      const config = MODE_CONFIG[currentMode];
      if (!config) return;

      if (config.kind === "e52-all") {
        const [xe38Result, xv38Result] = await Promise.all([
          new hsciistr(hsciistr.phrom_dikt.e52, hsciistr.tu_dikt.xe38).set_input(text).duztr(),
          new hsciistr(hsciistr.phrom_dikt.e52, hsciistr.tu_dikt.xv38).set_input(text).duztr(),
        ]);
        setX38Output(xe38Result.output.xe38);
        setXv38Output(xv38Result.output.xv38);
        return;
      }

      // kind === "single"
      const setOutput = outputSetterFor(currentMode);
      if (config.gujaratiWorkaround) {
        const isNativeScriptInput = config.phrom === hsciistr.phrom_dikt.u10;
        const result = await runGujaratiWorkaround(text, isNativeScriptInput);
        setOutput(result);
        return;
      }

      const result = await new hsciistr(config.phrom, config.tu).set_input(text).duztr();
      setOutput(result.output[config.tu]);
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
