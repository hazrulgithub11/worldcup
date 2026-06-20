"use client";

import { useState, useEffect } from "react";
import ChampionIntro from "./ChampionIntro";
import CharacterSelectScreen, { NAV_TO_HISTORY_KEY } from "./CharacterSelectScreen";
import {
  resumeSuspendedBackgroundMusic,
  suspendBackgroundMusic,
} from "@/lib/sounds/backgroundMusic";
import {
  enterCharacterSelectMusic,
  stopCharacterMusic,
} from "@/lib/sounds/characterMusic";

export default function CharacterSelectWrapper() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    suspendBackgroundMusic();
    enterCharacterSelectMusic();
    return () => {
      stopCharacterMusic();
      const headingToHistory = sessionStorage.getItem(NAV_TO_HISTORY_KEY) === "1";
      if (headingToHistory) {
        sessionStorage.removeItem(NAV_TO_HISTORY_KEY);
      } else {
        resumeSuspendedBackgroundMusic();
      }
    };
  }, []);

  function handleIntroComplete() {
    setShowIntro(false);
  }

  return (
    <>
      {/* Screen mounts immediately so assets preload behind the intro */}
      <CharacterSelectScreen />
      {showIntro && <ChampionIntro onComplete={handleIntroComplete} />}
    </>
  );
}
