"use client";

import React, { useState, useRef } from "react";

// One tile = one xNglo sound, with 1+ example words. `translit` is the
// xNglo/hscii-romanised word (no Devanagari Unicode -- this page teaches
// the xNglo letterforms specifically). `imgSrc` is always a real picture
// file (a photo), never a font-rendered glyph -- raw emoji text would
// vanish if the page's font-family gets swapped by the hscii font picker
// in layout.tsx, and several of these words (pomegranate, guava) have no
// Unicode emoji at all anyway.
type WordExample = {
  translit: string;
  gloss: string;
  imgSrc: string;
};

type Tile = {
  letter: string;
  group: "swr" | "wynzxn";
  examples: WordExample[];
};

// Real photos, CC-licensed, from Wikimedia Commons via the stable
// Special:FilePath redirect (resolves to the actual upload.wikimedia.org
// file regardless of its storage hash).
function wm(fileName: string, width = 320): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}

// Twemoji PNGs are also real picture files (not a font glyph), just
// simpler illustrations -- used as a placeholder for letters that don't
// have a full multi-example set built out yet. Swap these for Wikimedia
// photos the same way `x` was done, whenever you're ready.
function twemojiCodepoints(emoji: string): string {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((cp) => cp !== "fe0f")
    .join("-");
}
function tw(emoji: string): string {
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${twemojiCodepoints(emoji)}.png`;
}
// Local repo-hosted images, in /public/images/xnglo/. Use this instead of
// wm() when you want the file self-hosted rather than hotlinked to
// Wikimedia -- drop the file in that folder and reference its name here.
function local(fileName: string): string {
  return `/images/xnglo/${fileName}`;
}
function one(translit: string, gloss: string, emoji: string): WordExample[] {
  return [{ translit, gloss, imgSrc: tw(emoji) }];
}

const TILES: Tile[] = [
  {
    letter: "x",
    group: "swr",
    examples: [
      { translit: "xxpxl", gloss: "sebu", imgSrc: wm("Red Apple.jpg") },
      { translit: "xnar", gloss: "pomegranate", imgSrc: local("xnar.jpg") },
      { translit: "xnda", gloss: "eg", imgSrc: wm("Egg.jpg") },
      { translit: "xmruuq", gloss: "guawa", imgSrc: wm("Guava pink fruit.jpg") },
      { translit: "xnanas", gloss: "pineapple", imgSrc: wm("Pineapple.jpg") },
      { translit: "xnt", gloss: "ant", imgSrc: wm("Formica polyctena 2.jpg") },
    ],
  },
  {
    letter: "a",
    group: "swr",
    examples: [
      { translit: "xam", gloss: "mxNgo", imgSrc: wm("Mango - single.jpg") },
      { translit: "xalu", gloss: "potxto", imgSrc: wm("Potatoes.jpg") },
      { translit: "xata", gloss: "wit flowr", imgSrc: wm("Wheat-flour.jpg") },
      { translit: "xaNK", gloss: "ai", imgSrc: wm("Human eye anatomy.jpg") },
      { translit: "xaNgn", gloss: "kortyrd", imgSrc: wm("Chettinad house courtyard.jpg") },
      { translit: "xanj", gloss: "intestin", imgSrc: wm("Small Intestine.jpg") },
    ],
  },
  {
    letter: "i",
    group: "swr",
    examples: [
      { translit: "idli", gloss: "rais_kek", imgSrc: wm("Idli (5194454248).jpg") },
      { translit: "imli", gloss: "txmxrind", imgSrc: wm("Tamarindus indica pods.JPG") },
      { translit: "inzxn", gloss: "inzxn", imgSrc: wm("Colorized car engine.jpg") },
      { translit: "xnqxr", gloss: "in", imgSrc: wm("Cat in Box.JPG") },
      { translit: "iit", gloss: "brik", imgSrc: wm("Brick pile.jpg") },
      { translit: "iiK", gloss: "sugxrken", imgSrc: wm("Cut sugarcane.jpg") },
    ],
  },
  {
    letter: "u",
    group: "swr",
    examples: [
      { translit: "ullu", gloss: "aul", imgSrc: tw("🦉") },
      { translit: "uut", gloss: "kxmel", imgSrc: wm("Camel.jpg") },
      { translit: "uun", gloss: "wuul", imgSrc: wm("Wool.www.usda.gov.jpg") },
      { translit: "uNgli", gloss: "fiNgxr", imgSrc: wm("Hand - Index finger.jpg") },
    ],
  },
  { letter: "e", group: "swr", examples: [
      { translit: "enxk", gloss: "speks", imgSrc: local("enxk.jpg") },
      { translit: "eRi", gloss: "xNkxl", imgSrc: local("eRi.jpg") },
      { translit: "eet", gloss: "aaT", imgSrc: local("eetkoen.jpg") },
    ],
  },
  {
    letter: "o",
    group: "swr",
    examples: [
      { translit: "snjra", gloss: "orenz", imgSrc: tw("🍊") },
      { translit: "oKli", gloss: "graindr", imgSrc: wm("Africa Mortar and pestle.jpg") },
    ],
  },
  { letter: "N", group: "swr", examples: [
      { translit: "xNgur", gloss: "greps", imgSrc: local("xNgur.jpg") },
      { translit: "xNguTa", gloss: "Jmb", imgSrc: local("xNguTa.jpg") },
      { translit: "xNguTi", gloss: "riNg", imgSrc: local("xNguTi.jpg") },
    ],
  },

  {
    letter: "k",
    group: "wynzxn",
    examples: [
      { translit: "kbujr", gloss: "piziyn", imgSrc: tw("🐦") },
      { translit: "kmxl", gloss: "lotus", imgSrc: wm("Lotus flower.JPG") },
      { translit: "kiNg", gloss: "kiNg", imgSrc: wm("Chess-king.JPG") },
      { translit: "kyuin", gloss: "kyuin", imgSrc: wm("Chess piece - White queen.jpg") },
      { translit: "kijab", gloss: "buk", imgSrc: wm("Open book (Unsplash).jpg") },
      { translit: "kvani", gloss: "stori", imgSrc: wm("An old man (grandfather) narrating a story to a group of kids (grandchildren) - a common scene in traditional Meitei society since ancient times till modern era.jpg") },
    ],
  },
  {
    letter: "K",
    group: "wynzxn",
    examples: [
      { translit: "KrgoS", gloss: "rxbit", imgSrc: local("KrgoS.jpg") },
      { translit: "Ktml", gloss: "insekt", imgSrc: local("Ktmxl.jpg") },
      { translit: "Kzuur", gloss: "det(frut)", imgSrc: local("Kzuur.jpg") },
      { translit: "Kira", gloss: "kukumbr", imgSrc: wm("Cucumber picture.jpg") },
    ],
  },
  {
    letter: "g",
    group: "wynzxn",
    examples: [
      { translit: "gae", gloss: "kao", imgSrc: local("kao.jpg") },
      { translit: "gmla", gloss: "flowrpot", imgSrc: local("gmla.jpg") },
      { translit: "gQa", gloss: "dNki", imgSrc: local("gQa.jpg") },
      { translit: "gila", gloss: "wet", imgSrc: wm("Rain drops (Unsplash).jpg") },
      { translit: "fulgoBi", gloss: "koliflowr", imgSrc: local("goBiful.jpg") },
      { translit: "pjjagoBi", gloss: "kxbez", imgSrc: local("goBipjja.jpg") },
    ],
  },
  { letter: "G", group: "wynzxn", examples: one("GRi", "klok", "⌚") },
  {
    letter: "c",
    group: "wynzxn",
    examples: [
      { translit: "canq", gloss: "muun", imgSrc: tw("🌙") },
      { translit: "cmmxc", gloss: "spuun", imgSrc: wm("Spoon.JPG") },
      { translit: "caar", gloss: "4", imgSrc: wm("Number 4.jpg") },
      { translit: "cini", gloss: "sugxr", imgSrc: wm("White cane sugar.JPG") },
      { translit: "ciil", gloss: "kite(bird)", imgSrc: wm("Black Kite I2 IMG 0992.jpg") },
      { translit: "cija", gloss: "taigxr", imgSrc: wm("Cheetah.JPG") },
    ],
  },
  {
    letter: "C",
    group: "wynzxn",
    examples: [
      { translit: "Caja", gloss: "xmbrela", imgSrc: wm("Traffic Umbrella.jpg") },
      { translit: "Cjri", gloss: "umbrela", imgSrc: wm("Pathein Umbrella.jpg") },
    ],
  },
  { letter: "z", group: "wynzxn", examples: one("zvaz", "ship", "🚢") },
  { letter: "Z", group: "wynzxn", examples: one("Znda", "flxg", "🚩") },
  { letter: "t", group: "wynzxn", examples: one("tmatr", "tomxto", "🍅") },
  {
    letter: "T",
    group: "wynzxn",
    examples: [
      { translit: "Tela", gloss: "kart", imgSrc: tw("🛒") },
      { translit: "Tnda", gloss: "kold", imgSrc: wm("Ice Cube (6934137292).jpg") },
      { translit: "TTera", gloss: "blxksmiJ", imgSrc: wm("Blacksmith working.jpg") },
    ],
  },
  {
    letter: "d",
    group: "wynzxn",
    examples: [
      { translit: "dmru", gloss: "smal drum", imgSrc: tw("🥁") },
      { translit: "doktr", gloss: "doktr", imgSrc: wm("A female doctor on call in Owerri, Imo State.jpg") },
    ],
  },
  { letter: "D", group: "wynzxn", examples: one("Dol", "drum", "🪘") },
  {
    letter: "j",
    group: "wynzxn",
    examples: [
      { translit: "jrbuz", gloss: "watxrmelxn", imgSrc: tw("🍉") },
      { translit: "jori", gloss: "rizgord", imgSrc: wm("Ridge gourd( beerakai ).jpg") },
      { translit: "jbla", gloss: "vxnd-drum", imgSrc: wm("Tabla.jpg") },
      { translit: "jel", gloss: "veyroil", imgSrc: wm("Amla, hair oil.JPG") },
      { translit: "jali", gloss: "klxpping", imgSrc: wm("Hands-Clapping.jpg") },
      { translit: "jiir", gloss: "xrrow", imgSrc: wm("PVC Bow and arrow.jpg") },
      { translit: "jiin", gloss: "Jrii", imgSrc: wm("Number 3.jpg") },
    ],
  },
  {
    letter: "J",
    group: "wynzxn",
    examples: [
      { translit: "Jyela", gloss: "bxg", imgSrc: tw("👜") },
      { translit: "Jali", gloss: "plet", imgSrc: wm("Thali, Plate in English.jpg") },
    ],
  },
  {
    letter: "q",
    group: "wynzxn",
    examples: [
      { translit: "qrwaza", gloss: "door", imgSrc: tw("🚪") },
      { translit: "qwai", gloss: "txblet", imgSrc: wm("VariousPills.jpg") },
      { translit: "qvi", gloss: "kurd", imgSrc: wm("Yoghurt in bowl 011715.jpg") },
    ],
  },
  { letter: "Q", group: "wynzxn", examples: one("Qnus", "bo", "🏹") },
  { letter: "n", group: "wynzxn", examples: one("nl", "txp", "🚰") },
  {
    letter: "p",
    group: "wynzxn",
    examples: [
      { translit: "pNka", gloss: "fxn", imgSrc: wm("Akupe- locally made hand fan.jpg") },
      { translit: "pvaR", gloss: "maunten", imgSrc: wm("Mountain range.jpg") },
    ],
  },
  { letter: "f", group: "wynzxn", examples: one("fuul", "flowr", "🌸") },
  {
    letter: "b",
    group: "wynzxn",
    examples: [
      { translit: "bkri", gloss: "goxt", imgSrc: tw("🐐") },
      { translit: "bnqxr", gloss: "mNki", imgSrc: wm("MONKEY.JPG") },
      { translit: "belxn", gloss: "rotiroller", imgSrc: wm("Wooden rolling pin isolated on white backgrounds.jpg") },
      { translit: "biskut", gloss: "biskut", imgSrc: wm("Biscuit.jpg") },
    ],
  },
  { letter: "B", group: "wynzxn", examples: one("Balu", "bixr", "🐻") },
  { letter: "m", group: "wynzxn", examples: one("mCli", "fiS", "🐟") },
  { letter: "y", group: "wynzxn", examples: one("ygy", "sekred fayr", "🔥") },
  {
    letter: "r",
    group: "wynzxn",
    examples: [
      { translit: "rJ", gloss: "ceriot", imgSrc: tw("🐎") },
      { translit: "roti", gloss: "brexd", imgSrc: wm("Indian Roti (Home made).JPG") },
    ],
  },
  { letter: "l", group: "wynzxn", examples: one("lomRi", "foks", "🦊") },
  {
    letter: "s",
    group: "wynzxn",
    examples: [
      { translit: "surxz", gloss: "sn", imgSrc: wm("Sun (Earth POV).jpg") },
      { translit: "svayja", gloss: "velp", imgSrc: wm("The Handshake!.jpg") },
    ],
  },
  { letter: "S", group: "wynzxn", examples: one("Ser", "layn", "🦁") },
  { letter: "w", group: "wynzxn", examples: one("zNgxl", "forest", "🌳") },
  { letter: "v", group: "wynzxn", examples: one("vaJi", "elifent", "🐘") },
];

export default function XngloChartPage() {
  const [active, setActive] = useState<Tile | null>(null);
  const [idx, setIdx] = useState(0);
  const touchX = useRef<number | null>(null);

  const swr = TILES.filter((t) => t.group === "swr");
  const wynzxn = TILES.filter((t) => t.group === "wynzxn");

  const openTile = (t: Tile) => {
    setActive(t);
    setIdx(0);
  };
  const closePopup = () => setActive(null);
  const go = (delta: number) => {
    if (!active) return;
    const n = active.examples.length;
    setIdx((i) => (i + delta + n) % n);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <main className="chart-page">
      <header className="chart-head">
        <p className="eyebrow">kilas 1 &middot; charts</p>
        <h1>xNglo warnmala</h1>
        <p className="sub">tc x skyuer &middot; slaid for nekst picture</p>
      </header>

      <section aria-labelledby="swr-heading">
        <h2 id="swr-heading" className="section-label">
          swr (wowxls)
        </h2>
        <div className="grid grid-swr">
          {swr.map((t) => (
            <LetterTile key={t.letter} tile={t} onOpen={() => openTile(t)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="wynzxn-heading">
        <h2 id="wynzxn-heading" className="section-label">
          wynzxn (konsonxnts)
        </h2>
        <div className="grid grid-wynzxn">
          {wynzxn.map((t) => (
            <LetterTile key={t.letter} tile={t} onOpen={() => openTile(t)} />
          ))}
        </div>
      </section>

      {active && (
        <div className="popup-backdrop" role="dialog" aria-modal="true" onClick={closePopup}>
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button className="popup-close" onClick={closePopup} aria-label="close">
              ×
            </button>
            <div className="popup-letter">{active.letter}</div>

            <div className="popup-slide-row">
              {active.examples.length > 1 && (
                <button className="nav-btn" onClick={() => go(-1)} aria-label="previous">
                  ‹
                </button>
              )}
              <div className="popup-picture">
                <img src={active.examples[idx].imgSrc} alt={active.examples[idx].gloss} />
              </div>
              {active.examples.length > 1 && (
                <button className="nav-btn" onClick={() => go(1)} aria-label="next">
                  ›
                </button>
              )}
            </div>

            <div className="popup-translit">{active.examples[idx].translit}</div>
            <div className="popup-gloss">{active.examples[idx].gloss}</div>

            {active.examples.length > 1 && (
              <div className="dots">
                {active.examples.map((_, i) => (
                  <span key={i} className={`dot ${i === idx ? "dot-active" : ""}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .chart-page {
          min-height: 100vh;
          background: radial-gradient(circle at 15% 0%, #fff3d6 0%, #ffe8bf 42%, #ffdca8 100%);
          padding: 32px 20px 72px;
          font-family: "Baloo 2", "Fredoka", "Nunito", system-ui, sans-serif;
          color: #402c1e;
        }
        .chart-head {
          text-align: center;
          margin-bottom: 28px;
        }
        .eyebrow {
          margin: 0 0 4px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 700;
          color: #c76b2c;
        }
        h1 {
          margin: 0;
          font-size: clamp(32px, 8vw, 52px);
          font-weight: 800;
          color: #a6371b;
          text-shadow: 2px 2px 0 #fff3d6;
        }
        .sub {
          margin: 6px 0 0;
          font-size: 15px;
          color: #7a5a3a;
        }
        .section-label {
          font-size: 14px;
          font-weight: 700;
          text-transform: lowercase;
          letter-spacing: 0.12em;
          color: #7a5a3a;
          margin: 28px 4px 10px;
        }
        .grid {
          display: grid;
          gap: 10px;
          max-width: 760px;
          margin: 0 auto;
        }
        .grid-swr {
          grid-template-columns: repeat(7, 1fr);
        }
        .grid-wynzxn {
          grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
        }
        @media (max-width: 520px) {
          .grid-swr {
            grid-template-columns: repeat(4, 1fr);
          }
          .grid-wynzxn {
            grid-template-columns: repeat(5, 1fr);
          }
        }
        .popup-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(64, 44, 30, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 50;
        }
        .popup-card {
          position: relative;
          background: #fffaf0;
          border-radius: 28px;
          padding: 28px 20px;
          width: min(340px, 100%);
          text-align: center;
          box-shadow: 0 20px 60px rgba(64, 44, 30, 0.35);
          border: 4px solid #ffcf7a;
          touch-action: pan-y;
        }
        .popup-close {
          position: absolute;
          top: 10px;
          right: 14px;
          background: none;
          border: none;
          font-size: 28px;
          line-height: 1;
          color: #a6371b;
          cursor: pointer;
        }
        .popup-letter {
          font-size: 34px;
          font-weight: 800;
          color: #c76b2c;
        }
        .popup-slide-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 8px 0;
        }
        .popup-picture {
          width: 200px;
          height: 150px;
          border-radius: 14px;
          overflow: hidden;
          background: #f1e4c8;
          flex-shrink: 0;
        }
        .popup-picture img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .nav-btn {
          font-size: 32px;
          line-height: 1;
          background: #ffd166;
          border: none;
          border-radius: 999px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          color: #402c1e;
          flex-shrink: 0;
        }
        .popup-translit {
          font-size: 26px;
          font-weight: 700;
          color: #402c1e;
          margin-top: 4px;
        }
        .popup-gloss {
          font-size: 26px;
          font-weight: 700;
          color: #7a5a3a;
          margin-top: 4px;
        }
        .dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e8cfa0;
        }
        .dot-active {
          background: #c76b2c;
        }
      `}</style>
    </main>
  );
}

function LetterTile({ tile, onOpen }: { tile: Tile; onOpen: () => void }) {
  const isSwar = tile.group === "swr";
  return (
    <button className="tile" onClick={onOpen} aria-label={`${tile.letter}, ${tile.examples[0].gloss}`}>
      {tile.letter}
      <style jsx>{`
        .tile {
          aspect-ratio: 1;
          border-radius: 16px;
          border: none;
          font-size: clamp(20px, 4.5vw, 28px);
          font-weight: 800;
          cursor: pointer;
          color: #402c1e;
          background: ${isSwar ? "#ffd166" : "#8ecae6"};
          box-shadow: 0 4px 0 ${isSwar ? "#d99b1f" : "#5a9bbd"};
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .tile:hover {
          transform: translateY(-2px);
        }
        .tile:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 ${isSwar ? "#d99b1f" : "#5a9bbd"};
        }
        @media (prefers-reduced-motion: reduce) {
          .tile {
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}
