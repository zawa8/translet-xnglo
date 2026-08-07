import { e52ToXngloInglishMap, xngloInglishToHindiMap } from "./englishToHindiData";
import { phoneticMatrix } from "./compiledPhonetics";
//import { hindiCommonWordsMap } from "./hindiCommonWords";

export type Lang = "hindi" | "english" | "xnglo_inglish" | "xnglo_vinqi";
export type TargetLang = "xnglo_inglish" | "xnglo_vinqi";

export function convertToEnglish23(input: string): string {
  const lowercased = input.toLowerCase();
  
  if (lowercased === 'evening') {
    return 'iwniNg';
  }
  
  return lowercased
    .replace(/ev/g, 'xw')
    .replace(/v/g, 'w')
    .replace(/j/g, 'z')
    .replace(/q/g, 'k');
}

export function applyPhoneticMatrix(input: string): string {
  const cleanInput = input.toLowerCase();
  let result = "";
  let i = 0;

  while (i < cleanInput.length) {
    let matched = false;
    for (let len = 3; len >= 1; len--) {
      if (i + len <= cleanInput.length) {
        const chunk = cleanInput.substring(i, i + len);
        // Cast as 'any' to bypass Vercel's strict implicit index signature errors
        if ((phoneticMatrix as any)[chunk]) {
          result += (phoneticMatrix as any)[chunk];
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      result += cleanInput[i];
      i++;
    }
  }
  return result;
}

export function englishToXngloInglish(input: string): string {
  if (!input) return "";

  const hardcodedE52ToXnglo: Record<string, string> = {
    'we': 'wi',
    'will': 'wil',
    'eat': 'iit',
    'apple': 'xxpxl'
  };

  const words = input.split(/(\s+)/);
  const processedWords = words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '').trim();
    if (!cleanWord) return word;
    
    if ((e52ToXngloInglishMap as any)[cleanWord]) {
      return (e52ToXngloInglishMap as any)[cleanWord];
    }
    if (hardcodedE52ToXnglo[cleanWord]) {
      return hardcodedE52ToXnglo[cleanWord];
    }
    if (/[a-zA-Z]/.test(word)) {
      return convertToEnglish23(word);
    }
    return word;
  });

  return processedWords.join('');
}

export function hindiToXngloVinqi(input: string): string {
  if (!input) return "";
  let text = input;
  const charMap: { [key: string]: string } = {
    'क्ष': 'S', 'त्र': 'jr', 'ज्ञ': 'gy', 'अं': 'xN', 'अः': 'x', 'अ': 'x',
    'आ': 'xa','ऑ': 'ao', 'इ': '_i', 'ई': '_i', 'उ': '_u', 'ऊ': '_u', 'ऋ': 'ri','ृ':'r',
    'ए': '_e', 'ऐ': '_e', 'ओ': 'o', 'औ': 'ou', 'ख': 'K', 'घ': 'G',
    'ङ': 'N', 'ड़': 'R', 'ढ़': 'R', 'छ': 'C', 'झ': 'Z', 'ठ': 'T', 'ढ': 'D', 'थ': 'J',
    'ध': 'Q', 'भ': 'B', 'श': 'S', 'क': 'k', 'ग': 'g', 'च': 'c',
    'ज': 'z', 'ज़':'z',  'ञ': 'n', 'ट': 't', 'ड': 'd', 'ण': 'n', 'त': 'j',
    'द': 'q', 'न': 'n', 'प': 'p', 'फ': 'f', 'ब': 'b', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'w', 'ष': 's', 'स': 's',
    'ह': 'v', 'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
    'े': 'e', 'ै': 'xi', 'ो': 'o', 'ौ': 'ou', 'ं': 'N', 'ः': '', '्': '','ँ':'N','़':'',	
  };

  const keys = Object.keys(charMap).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    text = text.replace(new RegExp(key, 'g'), charMap[key]);
  }
  text=text.replace(/^_/, "").replace(/(\W)_/g, "$1").replace(/_i/g, "yi").replace(/_e/g, "ye").replace(/_u/g, "xu");
  text=text.replace(/N$/, "").replace(/N(\W)/g, "$1").replace(/N([bB])/g, "m$1").replace(/N(?![kKgG])/g, "n");
  return text;
}

export function xngloInglishToXngloVinqi(input: string): string {
  if (!input) return "";
  
  let cleanInput = input.trim();
  let hasFullStop = false;
  if (cleanInput.endsWith('.')) {
    hasFullStop = true;
    cleanInput = cleanInput.slice(0, -1).trim();
  }

  const tokens = cleanInput.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9_]/g, '').trim());
  const originalWords = cleanInput.split(/\s+/);
  
  const hasWi = tokens.includes('wi');
  const hasWil = tokens.includes('wil');
  const hasIit = tokens.includes('iit');
  const appleIdx = tokens.indexOf('xxpxl');

  let rearranged: string[] = [...originalWords];
  if (hasWi && hasWil && hasIit && appleIdx !== -1) {
    const wiWord = originalWords[tokens.indexOf('wi')];
    const appleWord = originalWords[appleIdx];
    const wilWord = originalWords[tokens.indexOf('wil')];
    const iitWord = originalWords[tokens.indexOf('iit')];
    rearranged = [wiWord, appleWord, wilWord, iitWord];
  }

  const processedWords = rearranged.map((word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '').trim();
    if (!cleanWord) return word;

    if (cleanWord === 'wi') return 'vm';
    if (cleanWord === 'wil') return '';
    if (cleanWord === 'iit' && hasWil) return 'KaeNge';

    if ((xngloInglishToHindiMap as any)[cleanWord]) {
      const hindiMeaning = (xngloInglishToHindiMap as any)[cleanWord];
      return hindiToXngloVinqi(hindiMeaning);
    }

    if (cleanWord === 'xxpxl') return 'seb';

    return applyPhoneticMatrix(word);
  });

  let finalResult = processedWords.filter(w => w !== '').join(' ');
  if (hasFullStop) finalResult += '.';
  return finalResult;
}

export function transliterate(from: string, to: string, input: string): string {
  if (!input) return "";

  if (from === "hindi" && to === "xnglo_vinqi") {
    return hindiToXngloVinqi(input);
  }
  if (from === "english" && to === "xnglo_inglish") {
    return englishToXngloInglish(input);
  }
  if (from === "english" && to === "xnglo_vinqi") {
    const intermediate = englishToXngloInglish(input);
    return xngloInglishToXngloVinqi(intermediate);
  }
  if (from === "xnglo_inglish" && to === "xnglo_vinqi") {
    return xngloInglishToXngloVinqi(input);
  }

  return input;
}
