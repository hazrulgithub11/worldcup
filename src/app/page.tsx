"use client";

import { useState, useEffect } from "react";
import ArenaHero from "@/components/landing/ArenaHero";
import StagePortal from "@/components/landing/StagePortal";
import ScareIntro from "@/components/landing/ScareIntro";
import { requestBackgroundMusic } from "@/lib/sounds/backgroundMusic";

const INTRO_KEY = "wc26-intro-seen";

export default function HomePage() {
  const [introChecked, setIntroChecked] = useState(false);
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
    setIntroChecked(true);
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
  }

  const homeVisible = introChecked && !showIntro;

  return (
    <>
      {showIntro && <ScareIntro onComplete={handleIntroComplete} />}
      {!introChecked && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "var(--clr-void)",
          }}
        />
      )}
      <main
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          background: "var(--clr-void)",
          visibility: homeVisible ? "visible" : "hidden",
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
