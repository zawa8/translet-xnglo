// --- HINDI / VINQI CHAR MAP (Base) ---
export const HINDI_CHAR_MAP: Record<string, string> = {
  "क्ष": "#S", "त्र": "jr", "ज्ञ": "gy", "अं": "xN", "अः": "x", "अ": "x",
  "आ": "xa", "ऑ": "ao", "इ": "_i", "ई": "_i", "उ": "_u", "ऊ": "_u",
  "ऋ": "ri", "ृ": "r", "ए": "_e", "ऐ": "_e", "ओ": "o", "औ": "ou",
  "ख": "K", "घ": "G", "ङ": "N", "ड़": "R", "ढ़": "R", "छ": "C",
  "झ": "Z", "ठ": "T", "ढ": "D", "थ": "J", "ध": "Q", "भ": "B",
  "श": "S", "क": "k", "ग": "g", "च": "c", "ज": "z", "ज़": "z",
  "ञ": "n", "ट": "t", "ड": "d", "ण": "n", "त": "j", "द": "q",
  "न": "n", "प": "p", "फ": "f", "ब": "b", "म": "m", "य": "y",
  "र": "r", "ल": "l", "व": "w", "ष": "s", "स": "s", "ह": "v",
  "ा": "a", "ॉ": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u",
  "े": "e", "ै": "xi", "ो": "o", "ौ": "ou", "ं": "N", "ः": "",
  "्": "", "ँ": "N", "़": "",
};
export const HINDI_KEYS_SORTED = Object.keys(HINDI_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- BENGALI CHAR MAP ---
export const BENGALI_CHAR_MAP: Record<string, string> = {
  "ক্ষ": "#S", "ত্র": "jr", "জ্ঞ": "gy", "অং": "xN", "অঃ": "x", "অ": "x",
  "আ": "xa", "অঁ": "ao", "ই": "_i", "ঈ": "_i", "উ": "_u", "ঊ": "_u",
  "ঋ": "ri", "ৃ": "r", "এ": "_e", "ঐ": "_e", "ও": "o", "ঔ": "ou",
  "খ": "K", "ঘ": "G", "ঙ": "N", "ড়": "R", "ঢ়": "R", "ছ": "C",
  "ঝ": "Z", "ঠ": "T", "ঢ": "D", "থ": "J", "ধ": "Q", "ভ": "B",
  "শ": "S", "ক": "k", "গ": "g", "চ": "c", "জ": "z", "য": "y",
  "ঞ": "n", "ট": "t", "ড": "d", "ণ": "n", "ত": "j", "দ": "q",
  "ন": "n", "প": "p", "ফ": "f", "ব": "b", "ম": "m", "য়": "y",
  "র": "r", "ল": "l", "ৱ": "w", "ষ": "s", "স": "s", "হ": "v",
  "া": "a", "ি": "i", "ী": "i", "ু": "u", "ূ": "u",
  "ে": "e", "ৈ": "xi", "ো": "o", "ৌ": "ou", "ং": "N", "ঃ": "",
  "্": "", "ঁ": "N", "়": "",
};
export const BENGALI_KEYS_SORTED = Object.keys(BENGALI_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- PUNJABI / GURMUKHI CHAR MAP ---
export const PUNJABI_CHAR_MAP: Record<string, string> = {
  "ਙ": "N", "ਚ": "c", "ਛ": "C", "ਜ": "z", "ਝ": "Z", "ਞ": "n",
  "ਟ": "t", "ਠ": "T", "ਡ": "d", "ਢ": "D", "ਣ": "n", "ਤ": "j",
  "ਥ": "J", "ਦ": "q", "ਧ": "Q", "ਨ": "n", "ਪ": "p", "ਫ": "f",
  "ਬ": "b", "ਭ": "B", "ਮ": "m", "ਯ": "y", "ਰ": "r", "ਲ": "l",
  "ਵ": "w", "ਸ਼": "S", "ਸ": "s", "ਹ": "v", "਼": "", "ਆ": "xa",
  "ਇ": "_i", "ਈ": "_i", "ਉ": "_u", "ਊ": "_u", "਋": "ri", "ਁ": "N",
  "ਂ": "N", "ੰ": "", "ਃ": "", "ਅ": "x", "ਏ": "_e", "ਐ": "_e",
  "ਓ": "o", "ਔ": "ou", "ਕ": "k", "ਖ": "K", "ਗ": "g", "ਘ": "G",
  "ਾ": "a", "ਿ": "i", "ੀ": "i", "ੁ": "u", "ੂ": "u", "ੇ": "e",
  "ੈ": "xi", "ੋ": "o", "ੌ": "ou", "੍": "", "ਕ਼": "k",
  "ਖ਼": "K", "ਗ਼": "g", "ਜ਼": "z", "ੜ": "R", "ਫ਼": "f"
};
export const PUNJABI_KEYS_SORTED = Object.keys(PUNJABI_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- GUJARATI CHAR MAP (xg38) ---
export const GUJARATI_CHAR_MAP: Record<string, string> = {
  "અ": "x", "આ": "xa", "ઇ": "_i", "ઈ": "_i", "ઉ": "_u", "ઊ": "_u",
  "એ": "_e", "ઐ": "_e", "ઓ": "o", "ઔ": "ou", "ક": "k", "ખ": "K",
  "ગ": "g", "ઘ": "G", "ઙ": "N", "ચ": "c", "છ": "C", "જ": "z",
  "ઝ": "Z", "ઞ": "n", "ટ": "t", "ઠ": "T", "ડ": "d", "ઢ": "D",
  "ણ": "n", "ત": "j", "થ": "J", "દ": "q", "ધ": "Q", "ન": "n",
  "પ": "p", "ફ": "f", "બ": "b", "ભ": "B", "મ": "m", "ય": "y",
  "ર": "r", "લ": "l", "વ": "w", "શ": "S", "ષ": "s", "સ": "s",
  "હ": "v", "ળ": "l", "ક્ષ": "#S", "જ્ઞ": "gy", "ા": "a", "િ": "i",
  "ી": "i", "ુ": "u", "ૂ": "u", "ે": "e", "ૈ": "xi", "ો": "o",
  "ૌ": "ou", "ં": "N", "ઃ": "", "્": ""
};
export const GUJARATI_KEYS_SORTED = Object.keys(GUJARATI_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- ODIA CHAR MAP (xo38) ---
export const ODIA_CHAR_MAP: Record<string, string> = {
  "ଅ": "x", "ଆ": "xa", "ଇ": "_i", "ଈ": "_i", "ଉ": "_u", "ଊ": "_u",
  "ଏ": "_e", "ଐ": "_e", "ଓ": "o", "ଔ": "ou", "କ": "k", "ଖ": "K",
  "ଗ": "g", "ଘ": "G", "ଙ": "N", "ଚ": "c", "ଛ": "C", "ଜ": "z",
  "ଝ": "Z", "ଞ": "n", "ଟ": "t", "ଠ": "T", "ଡ": "d", "ଢ": "D",
  "ଣ": "n", "ତ": "j", "ଥ": "J", "ଦ": "q", "ଧ": "Q", "ନ": "n",
  "ପ": "p", "ଫ": "f", "ବ": "b", "ଭ": "B", "ମ": "m", "ଯ": "y",
  "ର": "r", "ଲ": "l", "ୱ": "w", "ଶ": "S", "ଷ": "s", "ସ": "s",
  "ହ": "v", "ଳ": "l", "କ୍ଷ": "#S", "ଜ୍ଞ": "gy", "ା": "a", "ି": "i",
  "ୀ": "i", "ୁ": "u", "ୂ": "u", "େ": "e", "ୈ": "xi", "ୋ": "o",
  "ୌ": "ou", "ଂ": "N", "ଃ": "", "୍": ""
};
export const ODIA_KEYS_SORTED = Object.keys(ODIA_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- TAMIL CHAR MAP (xjm38) ---
export const TAMIL_CHAR_MAP: Record<string, string> = {
  "அ": "x", "ஆ": "xa", "இ": "_i", "ஈ": "_i", "உ": "_u", "ஊ": "_u",
  "எ": "_e", "ஏ": "_e", "ஐ": "xi", "ஒ": "o", "ஓ": "o", "ஔ": "ou",
  "க": "k", "ங": "N", "ச": "c", "ஞ": "n", "ட": "t", "ண": "n",
  "த": "j", "ந": "n", "ப": "p", "ம": "m", "ய": "y", "ர": "r",
  "ல": "l", "வ": "w", "ழ": "l", "ள": "l", "ற": "r", "ன": "n",
  "ஜ": "z", "ஷ": "s", "ஸ": "s", "ஹ": "v", "ா": "a", "ி": "i",
  "ீ": "i", "ு": "u", "ூ": "u", "ெ": "e", "ே": "e", "ை": "xi",
  "ொ": "o", "ோ": "o", "ௌ": "ou", "்": ""
};
export const TAMIL_KEYS_SORTED = Object.keys(TAMIL_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- TELUGU CHAR MAP (xjelugu38) ---
export const TELUGU_CHAR_MAP: Record<string, string> = {
  "అ": "x", "ఆ": "xa", "ఇ": "_i", "ఈ": "_i", "ఉ": "_u", "ఊ": "_u",
  "ఋ": "ri", "ఎ": "_e", "ఏ": "_e", "ఐ": "xi", "ఒ": "o", "ఓ": "o",
  "ఔ": "ou", "క": "k", "ఖ": "K", "గ": "g", "ఘ": "G", "ఙ": "N",
  "చ": "c", "ఛ": "C", "జ": "z", "ఝ": "Z", "ఞ": "n", "ట": "t",
  "ఠ": "T", "డ": "d", "ఢ": "D", "ణ": "n", "త": "j", "థ": "J",
  "ద": "q", "ధ": "Q", "న": "n", "ప": "p", "ఫ": "f", "బ": "b",
  "భ": "B", "మ": "m", "య": "y", "ర": "r", "ల": "l", "వ": "w",
  "శ": "S", "ష": "s", "స": "s", "హ": "v", "ళ": "l", "క్ష": "#S",
  "ా": "a", "ి": "i", "ీ": "i", "ు": "u", "ూ": "u", "ె": "e",
  "ే": "e", "ై": "xi", "ొ": "o", "ో": "o", "ౌ": "ou", "ం": "N",
  "ః": "", "్": ""
};
export const TELUGU_KEYS_SORTED = Object.keys(TELUGU_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- KANNADA CHAR MAP (xk38) ---
export const KANNADA_CHAR_MAP: Record<string, string> = {
  "ಅ": "x", "ಆ": "xa", "ಇ": "_i", "ಈ": "_i", "ಉ": "_u", "ಊ": "_u",
  "ಋ": "ri", "ಎ": "_e", "ಏ": "_e", "ಐ": "xi", "ಒ": "o", "ಓ": "o",
  "ಔ": "ou", "ಕ": "k", "ಖ": "K", "ಗ": "g", "ಘ": "G", "ಙ": "N",
  "ಚ": "c", "ಛ": "C", "ಜ": "z", "ಝ": "Z", "ಞ": "n", "ಟ": "t",
  "ಠ": "T", "ಡ": "d", "ಢ": "D", "ಣ": "n", "ತ": "j", "ಥ": "J",
  "ದ": "q", "ಧ": "Q", "ನ": "n", "ಪ": "p", "ಫ": "f", "ಬ": "b",
  "ಭ": "B", "ಮ": "m", "ಯ": "y", "ರ": "r", "ಲ": "l", "ವ": "w",
  "ಶ": "S", "ಷ": "s", "ಸ": "s", "ಹ": "v", "ಳ": "l", "ಕ್ಷ": "#S",
  "ಾ": "a", "ಿ": "i", "ೀ": "i", "ು": "u", "ೂ": "u", "ೆ": "e",
  "ೇ": "e", "ೈ": "xi", "ೊ": "o", "ೋ": "o", "ೌ": "ou", "ಂ": "N",
  "ಃ": "", "್": ""
};
export const KANNADA_KEYS_SORTED = Object.keys(KANNADA_CHAR_MAP).sort((a, b) => b.length - a.length);

// --- MALAYALAM CHAR MAP (xm38) ---
export const MALAYALAM_CHAR_MAP: Record<string, string> = {
  "അ": "x", "ആ": "xa", "ഇ": "_i", "ഈ": "_i", "ഉ": "_u", "ഊ": "_u",
  "ഋ": "ri", "എ": "_e", "ഏ": "_e", "ഐ": "xi", "ഒ": "o", "ഓ": "o",
  "ഔ": "ou", "ക": "k", "ഖ": "K", "ഗ": "g", "ഘ": "G", "ങ": "N",
  "ച": "c", "ഛ": "C", "ജ": "z", "ഝ": "Z", "ഞ": "n", "ട": "t",
  "ഠ": "T", "ഡ": "d", "ഢ": "D", "ണ": "n", "ത": "j", "ഥ": "J",
  "ദ": "q", "ധ": "Q", "ന": "n", "പ": "p", "ഫ": "f", "ബ": "b",
  "ഭ": "B", "മ": "m", "യ": "y", "ര": "r", "ല": "l", "വ": "w",
  "ശ": "S", "ഷ": "s", "സ": "s", "ഹ": "v", "ള": "l", "ഴ": "l",
  "റ": "r", "ഩ": "n", "ക്ഷ": "#S", "ാ": "a", "ി": "i", "ീ": "i",
  "ു": "u", "ൂ": "u", "െ": "e", "േ": "e", "ൈ": "xi", "ൊ": "o",
  "ോ": "o", "ൌ": "ou", "ം": "N", "ഃ": "", "്": ""
};
export const MALAYALAM_KEYS_SORTED = Object.keys(MALAYALAM_CHAR_MAP).sort((a, b) => b.length - a.length);

export function scriptToXnglo(text: string, charMap: Record<string, string>, sortedKeys: string[]): string {
  if (!text) return "";
  let resText = String(text);
  for (const key of sortedKeys) {
    resText = resText.split(key).join(charMap[key]);
  }
  resText = resText.replace(/^#S/, "S");
  resText = resText.replace(/(\W)#S/g, "$1S");
  resText = resText.replace(/#S/g, "kS");
  resText = resText.replace(/^_/, "");
  resText = resText.replace(/(\W)_/g, "$1");
  resText = resText.replace(/([aiueo])_/g, "$1");
  resText = resText.replace(/_i/g, "yi").replace(/_e/g, "ye").replace(/_u/g, "xu");
  resText = resText.replace(/N$/, "");
  resText = resText.replace(/N(\W)/g, "$1");
  resText = resText.replace(/Nb/g, "mb").replace(/NB/g, "mB").replace(/Np/g, "mp").replace(/Nf/g, "mf");
  resText = resText.replace(/N(?![kKgG])/g, "n");
  return resText;
}
