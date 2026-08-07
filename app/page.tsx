"use client";

import { useMemo, useState } from "react";
import { transliterate, Lang, TargetLang } from "@/lib/transliterate";

const FROM_OPTIONS: { value: Lang; label: string }[] = [
  { value: "english", label: "iNglish" },
  { value: "hindi", label: "vinqi" },
  { value: "xnglo_inglish", label: "xnglo_inglish" },
];

const TO_OPTIONS: { value: TargetLang; label: string }[] = [
  { value: "xnglo_inglish", label: "xnglo_inglish" },
  { value: "xnglo_vinqi", label: "xnglo_vinqi" },
];

const SPECIMEN: { src: string; dst: string }[] = [
  { src: "अनार", dst: "xnar" },
  { src: "Apple", dst: "xxpxl" },
  { src: "always", dst: "alwez" },
  { src: "है", dst: "v" },
  { src: "नहीं", dst: "nvi" },
  { src: "request", dst: "rikyuxst" },
  { src: "translation", dst: "translesn" },
  { src: "six", dst: "siks" },
  { src: "quick", dst: "kuick" },
];

export default function Home() {
  const [from, setFrom] = useState<Lang>("english"); // Changed default to English for testing
  const [to, setTo] = useState<TargetLang>("xnglo_vinqi");
  const [input, setInput] = useState("");

  // Check if we are doing the multi-stage English -> xnglo_inglish -> xnglo_vinqi pipeline
  const isMultiStagePipeline = from === "english" && to === "xnglo_vinqi";

  // Calculate values down the chain cleanly without overwriting state
  const intermediateXngloInglish = useMemo(() => {
    if (isMultiStagePipeline) {
      return transliterate("english", "xnglo_inglish", input);
    }
    return "";
  }, [input, isMultiStagePipeline]);

  const output = useMemo(() => {
    if (isMultiStagePipeline) {
      // Feed the intermediate xnglo_inglish text into the final vinqi generator block
      return transliterate("xnglo_inglish", "xnglo_vinqi", intermediateXngloInglish);
    }
    return transliterate(from, to, input);
  }, [from, to, input, intermediateXngloInglish, isMultiStagePipeline]);

  // Mark all configurations as officially available now!
  const isPairAvailable = true;

  return (
    <div className="wrap">
      <header className="hero">
        <p className="eyebrow">translet.xnglo</p>
        <h1> wn skript, <em>xNglo</em> xwriJiNg. </h1>
        <p className="lede">
           smal knwrtr bitwin english, hindi, xnd tuu xNglo romanisations — built straight from source mapping sheet.
        </p>
      </header>

      <div className="specimen">
        {SPECIMEN.map((pair, i) => (
          <div className="glyph-pair" key={i}>
            <span className="src">{pair.src}</span>
            <span className="arrow">→</span>
            <span className="dst">{pair.dst}</span>
          </div>
        ))}
      </div>

      <section className="tool">
        <div className="selectors">
          <div className="selector">
            <label htmlFor="from">from</label>
            <select id="from" value={from} onChange={(e) => setFrom(e.target.value as Lang)}>
              {FROM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="selector">
            <label htmlFor="to">to</label>
            <select id="to" value={to} onChange={(e) => setTo(e.target.value as TargetLang)}>
              {TO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="panes" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {/* Main User Input Field - ALWAYS STAYS CONSTANT */}
          <div className="pane" style={{ flex: 1, minWidth: "250px" }}>
            <p className="pane-label">input ({from})</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={from === "hindi" ? "yva liKiye..." : "taip vexr…"}
            />
          </div>

          {/* New Middle Dynamic Pane: Only visible when going from English -> xnglo_vinqi */}
          {isMultiStagePipeline && (
            <div className="pane" style={{ flex: 1, minWidth: "250px" }}>
              <p className="pane-label" style={{ color: "#a855f7" }}>x38 (xnglo_inglish)</p>
              <div className="output" style={{ background: "#faf5ff", borderColor: "#e9d5ff" }}>
                {intermediateXngloInglish || "—"}
              </div>
            </div>
          )}

          {/* Final Calculated Content Pane */}
          <div className="pane" style={{ flex: 1, minWidth: "250px" }}>
            <p className="pane-label">output ({to})</p>
            <div className={`output ${isPairAvailable ? "" : "pending"}`}>
              {output || "—"}
            </div>
          </div>
        </div>
      </section>

      <footer className="note">
        Rules live in <code>lib/mappings.ts</code>. Mapping #3 (English → xnglo_vinqi) and #4 (xnglo_inglish → xnglo_vinqi) are running live from <code>dxta/wrds.csv</code>.
      </footer>
    </div>
  );
}
