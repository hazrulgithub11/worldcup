import type { Metadata } from "next";
import { Inter, Anton, JetBrains_Mono } from "next/font/google";
import AudioToggle from "@/components/AudioToggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-body-loaded",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-display-loaded",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "World Cup 2026 — Fight Night Schedule",
  description: "The World Cup 2026 match schedule, styled as a Street Fighter fight roster. Pick your match, pick your fighter.",
  openGraph: {
    title: "World Cup 2026 — Fight Night Schedule",
    description: "The tournament begins. Choose your matchup.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AudioToggle />
      </body>
    </html>
  );
}
