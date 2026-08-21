'use client';

import { useEffect, useState } from 'react';

const LOCAL_FONTS = [
  // please do not change order
  { id: 'binaryfont', name: 'binary(01)', variable: 'var(--binaryfont)' },
  { id: 'eng52font', name: 'e52', variable: 'var(--eng52font)' },
  { id: 'xng52font', name: 'xNgloiNgliS', variable: 'var(--xng52font)' },
  { id: 'hin52font', name: 'xNglovinqi52', variable: 'var(--hin52font)' },
  { id: 'hin38font', name: '(xv38)xNglovinqi38', variable: 'var(--hin38font)' },
  { id: 'hindimatra38font', name: 'vinqi38majra', variable: 'var(--hindimatra38font)' },
  /////
  { id: 'tmil52font', name: 'jxmil52', variable: 'var(--tmil52font)' },
  { id: 'mlyalm52font', name: 'mxlxyalxm52', variable: 'var(--mlyalm52font)' },
  { id: 'knrra52font', name: 'knrra52', variable: 'var(--knrra52font)' },
  { id: 'telugu52font', name: 'jelugu52', variable: 'var(--telugu52font)' },
  { id: 'bangla52font', name: 'bangla52', variable: 'var(--bangla52font)' },
  { id: 'odia52font', name: 'odia52', variable: 'var(--odia52font)' },
  { id: 'pnzabi52font', name: 'pnzabi52', variable: 'var(--pnzabi52font)' },
  { id: 'guzrati52font', name: 'guzraji52', variable: 'var(--guzrati52font)' },
  { id: 'sinhl52font', name: 'sinvxla52', variable: 'var(--sinhl52font)' },
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
