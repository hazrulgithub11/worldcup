"use client";

import { useState, useEffect } from "react";
import ArenaHero from "@/components/landing/ArenaHero";
import StagePortal from "@/components/landing/StagePortal";
import ScareIntro from "@/components/landing/ScareIntro";
import { requestBackgroundMusic } from "@/lib/sounds/backgroundMusic";

const INTRO_KEY = "wc26-intro-seen";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get("intro") === "1";
    const alreadySeen = sessionStorage.getItem(INTRO_KEY);
    if (forceIntro || !alreadySeen) {
      setShowIntro(true);
    } else {
      requestBackgroundMusic();
    }
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
  }

  return (
    <>
      {showIntro && <ScareIntro onComplete={handleIntroComplete} />}
      <main
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          background: "var(--clr-void)",
        }}
      >
        {/* ── Scene 1: full-viewport hero ── */}
        <ArenaHero />

        {/* ── Scene 2 + 3: portal reveals nation belt ── */}
        <StagePortal />
      </main>
    </>
  );
}
