// Data sourced from the user's "xNglo_mxppiNg" Google Sheet
// (Hindi_se_xnglovinqi tab + English_se_xnglo_inglish.csv)

export const swar: Record<string, string> = {
  "अ": "x", "आ": "xa", "इ": "I", "ई": "I",
  "उ": "U", "ऊ": "U", "ऋ": "ri", "ए": "E",
  "ऐ": "E", "ओ": "O", "औ": "ou", "अं": "xN", "अः": "x",
};

export const vyanjan: Record<string, string> = {
  "क": "k", "ख": "K", "ग": "g", "घ": "G", "ङ": "R",
  "च": "c", "छ": "C", "ज": "z", "झ": "Z", "ञ": "n",
  "ट": "t", "ठ": "T", "ड": "d", "ढ": "D", "ण": "n",
  "त": "j", "थ": "J", "द": "q", "ध": "Q", "न": "n",
  "प": "p", "फ": "f", "ब": "b", "भ": "B", "म": "m",
  "य": "y", "र": "r", "ल": "l", "व": "w", "श": "S",
  "ष": "s", "स": "s", "ह": "v",
  "क्ष": "S", "त्र": "jr", "ज्ञ": "gy",
};

export const matra: Record<string, string> = {
  "ा": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u",
  "ृ": "ri", "े": "e", "ै": "xi", "ो": "o", "ौ": "ou",
  "ं": "N", "ः": "x", "ँ": "",
};

// Most common words are already handled correctly by the swar/vyanjan/matra
// rules plus the general word-final-anusvara-drop rule in transliterate.ts.
// Only true exceptions - words the general rules can't reproduce - live here.
export const commonHindiWords: Record<string, string> = {
  "और": "or",        // rule would give "our"
  "है": "v",         // rule would give "vxi"
  "रहा": "rha",      // rule maps ह->v, giving "rva" - this word keeps "h"
  "लिए": "lie",      // rule would give "liE" (case mismatch on trailing ए)
  "कीजिए": "kiziye", // rule would give "kiziE"
  // case convention: standalone swar इ/ई, उ/ऊ, ए/ऐ are I/U/E in the swar table,
  // but common short words use lowercase i/u/e instead
  "इस": "is",
  "उस": "us",
  "एक": "ek",
};

// English -> xnglo_inglish letter substitutions (applied to already-lowercased text)
export const englishLetterSubs: Record<string, string> = {
  j: "z",
  q: "k",
  w: "v",
};

// Whole-word exceptions that override the regular letter rules
export const englishWordExceptions: Record<string, string> = {
  request: "rikyuxst",
  requests: "rikyuxsts",
  requested: "rikyuxstiq",
  gave: "gew",
};

export const englishArticles = new Set(["a", "an", "the"]);
