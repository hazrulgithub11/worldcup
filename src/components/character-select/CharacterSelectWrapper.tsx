"use client";

import { useState, useEffect } from "react";
import ChampionIntro from "./ChampionIntro";
import CharacterSelectScreen from "./CharacterSelectScreen";
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
      resumeSuspendedBackgroundMusic();
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
