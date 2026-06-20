"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { suspendBackgroundMusic } from "@/lib/sounds/backgroundMusic";
import { stopCharacterMusic } from "@/lib/sounds/characterMusic";
import { stopCountryAnthem } from "@/lib/sounds/countryAnthem";

const LINES = ["please enjoy", "the story", "of the goat"] as const;
const HISTORY_CANVAS = "#f4efe6";
const VOID_COLOR = "#030508";

function muteAllAudio() {
  stopCountryAnthem();
  stopCharacterMusic();
  suspendBackgroundMusic();
}

interface Props {
  onComplete: () => void;
}

export default function StoryTransition({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    muteAllAudio();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const timer = setTimeout(() => onCompleteRef.current(), 1200);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      gsap.set(textRef.current, { opacity: 0, y: 10 });
      gsap.set(overlayRef.current, { backgroundColor: VOID_COLOR, opacity: 1 });

      const tl = gsap.timeline();

      const phraseDuration = 2.05;

      LINES.forEach((line, index) => {
        const start = index * phraseDuration;
        const isLast = index === LINES.length - 1;

        tl.call(
          () => {
            if (textRef.current) textRef.current.textContent = line;
          },
          undefined,
          start
        );

        tl.to(
          textRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          start
        );

        if (!isLast) {
          tl.to(
            textRef.current,
            { opacity: 0, y: -10, duration: 0.55, ease: "power2.in" },
            start + 1.5
          );
        }
      });

      const exitStart = LINES.length * phraseDuration - 0.35;

      tl.to(
        textRef.current,
        { opacity: 0, y: -6, duration: 0.65, ease: "power2.in" },
        exitStart
      );

      tl.to(
        overlayRef.current,
        {
          backgroundColor: HISTORY_CANVAS,
          duration: 1.1,
          ease: "power2.inOut",
          onComplete: () => onCompleteRef.current(),
        },
        exitStart + 0.15
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--clr-void)",
        pointerEvents: "none",
      }}
    >
      <p
        ref={textRef}
        style={{
          margin: 0,
          padding: "0 1.5rem",
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(0.58rem, 2.4vw, 0.72rem)",
          fontWeight: 400,
          letterSpacing: "0.28em",
          textTransform: "lowercase",
          color: "rgba(255,255,255,0.72)",
          textAlign: "center",
          lineHeight: 1.6,
          opacity: 0,
        }}
      >
        {LINES[0]}
      </p>
    </div>
  );
}
