import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Bebas_Neue } from "next/font/google";
import "../globals.css";

const inter = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-jetbrains" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-bebas" });

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — YEG Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="tr" className={`${inter.variable} ${mono.variable} ${bebas.variable}`}>
      <body className="min-h-dvh bg-coal font-sans text-bone antialiased">{children}</body>
    </html>
  );
}
