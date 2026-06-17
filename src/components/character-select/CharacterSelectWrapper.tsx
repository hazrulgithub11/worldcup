"use client";

import { useState, useEffect } from "react";
import ChampionIntro from "./ChampionIntro";
import CharacterSelectScreen from "./CharacterSelectScreen";

const INTRO_KEY = "wc26-champion-intro-seen";

export default function CharacterSelectWrapper() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force = params.get("intro") === "1";
    const seen = sessionStorage.getItem(INTRO_KEY);
    if (force || !seen) setShowIntro(true);
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem(INTRO_KEY, "1");
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
