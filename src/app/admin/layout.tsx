import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin | Vassilena Papakostopoulos",
  robots: { index: false, follow: false },
};

type AdminRootLayoutProps = {
  children: ReactNode;
};

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
