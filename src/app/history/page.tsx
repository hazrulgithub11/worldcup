"use client";

import LenisProvider from "@/components/providers/LenisProvider";
import HistoryHero from "@/components/history/HistoryHero";

export default function HistoryPage() {
  return (
    <LenisProvider>
      <main
        className="relative z-[2] min-h-svh"
        style={{ background: "#ffffff" }}
      >
        <HistoryHero />

        
      </main>
    </LenisProvider>
  );
}
