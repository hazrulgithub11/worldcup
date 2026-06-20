"use client";

import { useEffect } from "react";
import LenisProvider from "@/components/providers/LenisProvider";
import HistoryHero, { HISTORY_CANVAS_STYLE } from "@/components/history/HistoryHero";
import {
  resumeSuspendedBackgroundMusic,
  suspendBackgroundMusic,
} from "@/lib/sounds/backgroundMusic";
import { stopCharacterMusic } from "@/lib/sounds/characterMusic";
import { enterHistoryMusic, stopHistoryMusic } from "@/lib/sounds/historyMusic";

export default function HistoryPage() {
  useEffect(() => {
    suspendBackgroundMusic();
    stopCharacterMusic();
    enterHistoryMusic();
    return () => {
      stopHistoryMusic();
      resumeSuspendedBackgroundMusic();
    };
  }, []);

  return (
    <LenisProvider>
      <main
        className="relative z-[2] min-h-svh"
        style={HISTORY_CANVAS_STYLE}
      >
        <HistoryHero />

        
      </main>
    </LenisProvider>
  );
}
