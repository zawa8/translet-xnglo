import type { Metadata } from "next";
import "./globals.css";

import { xng52font, eng52font, binaryfont, korian52font, russian52font, xv38fontid, xp38fontid, xo38fontid, xb38fontid, xg38fontid, xk38fontid, xj38fontid, xt38fontid, xm38fontid, xs38fontid  } from '@/components/hsciifp/varfonts';
import LocalFontPicker from "@/components/hsciifp/LocalFontPicker";

export const metadata: Metadata = {
  title: "xNglo translet",
  description: "translitret bitwin English, qewnagri, xnd xnglo skripts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={
			`${xng52font.variable} ${eng52font.variable} ${binaryfont.variable} ${korian52font.variable} ${russian52font.variable} ${xv38fontid.variable} ${xb38fontid.variable} ${xo38fontid.variable} ${xp38fontid.variable} ${xg38fontid.variable} ${xj38fontid.variable} ${xk38fontid.variable} ${xs38fontid.variable} ${xm38fontid.variable} ${xt38fontid.variable}`
		}>
      <head>
      </head>
      <body>
		  <header>
			  <LocalFontPicker/>
		  </header>
		  <main>{children}</main>
	  </body>
    </html>
  );
}

