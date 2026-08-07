import type { Metadata } from "next";
import "./globals.css";

import { xng52font, eng52font, binaryfont, korian52font, russian52font, hin38font, hin52font, bangla52font, odia52font, pnzabi52font, guzrati52font, 	telugu52font, knrra52font, sinhl52font, mlyalm52font, tmil52font, hindimatra38font } from '@/components/hsciifp/varfonts';
import LocalFontPicker from "@/components/hsciifp/LocalFontPicker";

export const metadata: Metadata = {
  title: "xNglo translet",
  description: "translitret bitwin English, qewnagri, xnd xnglo skripts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={
			`${xng52font.variable} ${eng52font.variable} ${binaryfont.variable} ${korian52font.variable} ${russian52font.variable} ${hin38font.variable} ${hin52font.variable} ${bangla52font.variable} ${odia52font.variable} ${pnzabi52font.variable} ${guzrati52font.variable} ${telugu52font.variable} ${knrra52font.variable} ${sinhl52font.variable} ${mlyalm52font.variable} ${tmil52font.variable} ${hindimatra38font.variable}`
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

