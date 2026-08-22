'use client';

import { useEffect, useState } from 'react';

const LOCAL_FONTS = [
  // please do not change order
  { id: 'binaryfont', name: 'binary(01)', variable: 'var(--binaryfont)' },
  { id: 'eng52font', name: 'e52', variable: 'var(--eng52font)' },
  { id: 'xng52font', name: 'xNgloiNgliS', variable: 'var(--xng52font)' },
  { id: 'xv38fontid', name: 'xNglovinqi', variable: 'var(--xv38fontid)' },
  { id: 'xb38fontid', name: 'xNglobNgali', variable: 'var(--xb38fontid)' },
  { id: 'xj38fontid', name: 'xNglojelugu', variable: 'var(--xj38fontid)' },
  { id: 'xk38fontid', name: 'xNgloknRa', variable: 'var(--xk38fontid)' },
  { id: 'xp38fontid', name: 'xNglopnzabi', variable: 'var(--xp38fontid)' },
  { id: 'xm38fontid', name: 'xNglomlyalxm', variable: 'var(--xk38fontid)' },
  { id: 'xo38fontid', name: 'xNglooriya', variable: 'var(--xo38fontid)' },
  { id: 'xg38fontid', name: 'xNgloguzraji', variable: 'var(--xg38fontid)' },
  { id: 'xt38fontid', name: 'xNglotmil', variable: 'var(--xt38fontid)' },
  { id: 'xs38fontid', name: 'xNglosinvla', variable: 'var(--xs38fontid)' },
  /////
  { id: 'korian52font', name: 'korian52', variable: 'var(--korian52font)' },
  { id: 'russian52font', name: 'russian52', variable: 'var(--russian52font)' },
];

export default function LocalFontPicker() {
  const [selectedFont, setSelectedFont] = useState('system');

  // Load saved font preference on mount
  useEffect(() => {
    const savedFont = localStorage.getItem('user-local-font');
    if (savedFont) {
      setSelectedFont(savedFont);
      applyGlobalFont(savedFont);
    }
  }, []);

  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId);
    localStorage.setItem('user-local-font', fontId);
    applyGlobalFont(fontId);
  };

  const applyGlobalFont = (fontId: string) => {
    const fontObj = LOCAL_FONTS.find((f) => f.id === fontId);
    if (fontObj) {
      // 1. पूरे डॉक्यूमेंट रूट पर एक्टिव वेरिएबल को सेट करें (Main Fix)
      document.documentElement.style.setProperty('--current-active-font', fontObj.variable);
      // 2. तुरंत बॉडी स्टाइल को अपडेट करें
      document.body.style.fontFamily = fontObj.variable;
    } else {
      document.documentElement.style.setProperty('--current-active-font', 'inherit');
      document.body.style.fontFamily = 'inherit';
    }
  };

  return (
    <div className="border rounded-xl shadow-md bg-white max-w-sm">
      <select
        value={selectedFont}
        onChange={(e) => handleFontChange(e.target.value)}
        className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500 text-black"
      >
        <option value="system">System Font</option>
        {LOCAL_FONTS.map((font) => (
          <option key={font.id} value={font.id}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
}
