import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexo Finance | Controle Financeiro Inteligente (2TP)",
  description:
    "Aplicação web de controle financeiro pessoal automatizada com Inteligência Artificial — 2TP Soluções em Tecnologia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[var(--surface-canvas)] text-[var(--text-primary)]"
      >
        {children}
      </body>
    </html>
  );
}
