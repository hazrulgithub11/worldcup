"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  playChampionWordTick,
  playChampionBoom,
  playChampionExitSound,
} from "@/lib/sounds/championIntro";

interface Props {
  onComplete: () => void;
}

export default function ChampionIntro({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const whoRef = useRef<HTMLSpanElement>(null);
  const isRef = useRef<HTMLSpanElement>(null);
  const yourRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const championRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Initial state ──────────────────────────────────────────
      gsap.set([whoRef.current, isRef.current, yourRef.current], {
        y: 64,
        opacity: 0,
        skewX: -6,
      });
      gsap.set(championRef.current, {
        y: 88,
        opacity: 0,
        skewX: -4,
        filter: "blur(0px)",
      });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(flashRef.current, { opacity: 0 });

      // ── Main timeline ──────────────────────────────────────────
      const tl = gsap.timeline({
        onComplete: () => onCompleteRef.current(),
      });
      tlRef.current = tl;

      // WHO
      tl.to(
        whoRef.current,
        { y: 0, opacity: 1, skewX: 0, duration: 0.32, ease: "power4.out" },
        0
      ).call(() => playChampionWordTick(0), undefined, 0);

      // IS
      tl.to(
        isRef.current,
        { y: 0, opacity: 1, skewX: 0, duration: 0.28, ease: "power4.out" },
        0.42
      ).call(() => playChampionWordTick(1), undefined, 0.42);

      // YOUR
      tl.to(
        yourRef.current,
        { y: 0, opacity: 1, skewX: 0, duration: 0.28, ease: "power4.out" },
        0.85
      ).call(() => playChampionWordTick(2), undefined, 0.85);

      // Divider line draws in
      tl.to(
        lineRef.current,
        { scaleX: 1, duration: 0.4, ease: "power2.out" },
        1.22
      );

      // CHAMPION slams in
      tl.to(
        championRef.current,
        { y: 0, opacity: 1, skewX: 0, duration: 0.42, ease: "power4.out" },
        1.55
      ).call(() => playChampionBoom(), undefined, 1.55);

      // Impact flash — white overlay flash
      tl.to(flashRef.current, { opacity: 0.1, duration: 0.05, ease: "none" }, 1.55).to(
        flashRef.current,
        { opacity: 0, duration: 0.38, ease: "power1.out" },
        1.6
      );

      // ── Hold ────────────────────────────────────────────────────
      // (~1.98s → 2.85s breathing room on CHAMPION)

      // ── Exit sequence ──────────────────────────────────────────
      // WHO / IS / YOUR fly out upward
      tl.to(
        [whoRef.current, isRef.current, yourRef.current, lineRef.current],
        { y: -48, opacity: 0, duration: 0.34, ease: "power3.in", stagger: 0.07 },
        2.85
      );

      // CHAMPION zooms out — camera punches through the word
      tl.to(
        championRef.current,
        {
          scale: 7,
          opacity: 0,
          filter: "blur(20px)",
          transformOrigin: "50% 50%",
          duration: 0.85,
          ease: "power3.in",
        },
        2.85
      ).call(() => playChampionExitSound(), undefined, 2.95);

      // Overlay fades to black — reveal the character select underneath
      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        3.45
      );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  function handleSkip() {
    const tl = tlRef.current;
    if (!tl) return;
    tl.kill();
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => onCompleteRef.current(),
    });
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--clr-void)",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Scanlines — matches global body::after intensity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)",
        }}
      />

      {/* ── Text block ── left-anchored, slightly above center */}
      <div
        style={{
          position: "absolute",
          left: "clamp(1.5rem, 8vw, 7rem)",
          top: "50%",
          transform: "translateY(-54%)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* WHO */}
        <div style={{ overflow: "hidden", paddingBottom: "0.06em" }}>
          <span
            ref={whoRef}
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5.5vw, 5rem)",
              lineHeight: 1.06,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(232,184,75,0.32)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            WHO
          </span>
        </div>

        {/* IS — shifted right for asymmetry */}
        <div
          style={{
            overflow: "hidden",
            paddingBottom: "0.06em",
            paddingLeft: "2.8vw",
          }}
        >
          <span
            ref={isRef}
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5.5vw, 5rem)",
              lineHeight: 1.06,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(232,184,75,0.32)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            IS
          </span>
        </div>

        {/* YOUR — slight offset, different from IS */}
        <div
          style={{
            overflow: "hidden",
            paddingBottom: "0.06em",
            paddingLeft: "0.9vw",
          }}
        >
          <span
            ref={yourRef}
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5.5vw, 5rem)",
              lineHeight: 1.06,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(232,184,75,0.32)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            YOUR
          </span>
        </div>

        {/* Divider — gold line that draws left-to-right before CHAMPION */}
        <div
          ref={lineRef}
          style={{
            height: 1,
            width: "clamp(10rem, 28vw, 26rem)",
            background: "linear-gradient(90deg, var(--clr-gold), transparent)",
            marginTop: "clamp(0.3rem, 0.8vw, 0.7rem)",
            marginBottom: "clamp(0.3rem, 0.8vw, 0.7rem)",
          }}
        />

        {/* CHAMPION — monumental, gold filled */}
        <div style={{ overflow: "hidden", paddingBottom: "0.12em" }}>
          <span
            ref={championRef}
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: "var(--size-monumental)",
              lineHeight: 0.88,
              color: "var(--clr-gold)",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              textShadow:
                "0 0 50px rgba(232,184,75,0.28), 0 0 100px rgba(232,184,75,0.12)",
            }}
          >
            CHAMPION
          </span>
        </div>
      </div>

      {/* Impact flash — white overlay that fires on CHAMPION slam */}
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,1)",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Top-right label */}
      <div
        style={{
          position: "absolute",
          top: "clamp(1.2rem, 3vw, 2rem)",
          right: "clamp(1.5rem, 4vw, 2.5rem)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.45rem",
          letterSpacing: "0.22em",
          color: "var(--clr-text-dim)",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        WC 2026 · SELECT YOUR CHAMPION
      </div>

      {/* Skip prompt — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 4vw, 2.5rem)",
          right: "clamp(1.5rem, 4vw, 2.5rem)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.48rem",
          letterSpacing: "0.22em",
          color: "var(--clr-text-dim)",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        TAP TO SKIP
      </div>
    </div>
  );
}
