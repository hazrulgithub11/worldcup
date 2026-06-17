"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { playScareIntroSound, playScareExitSound } from "@/lib/sounds/scareIntro";

type Phase = "waiting" | "slamming" | "holding" | "exiting";

interface Props {
  onComplete: () => void;
}

export default function ScareIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* clean up on unmount */
  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
  }, []);

  function handleReveal() {
    if (phase !== "waiting") return;
    playScareIntroSound();
    setPhase("slamming");
    holdTimer.current = setTimeout(() => setPhase("holding"), 220);
  }

  function handleContinue() {
    if (phase !== "holding") return;
    playScareExitSound();
    setPhase("exiting");
    exitTimer.current = setTimeout(onComplete, 700);
  }

  function handleTap() {
    if (phase === "waiting") handleReveal();
    else if (phase === "holding") handleContinue();
  }

  const isTappable = phase === "waiting" || phase === "holding";

  return (
    <AnimatePresence>
      <motion.div
        key="scare-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "var(--clr-void)",
          cursor: isTappable ? "pointer" : "default",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onClick={isTappable ? handleTap : undefined}
      >
        {/* ── GHOST IMAGE (barely visible waiting hint) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: phase === "waiting" ? 0.055 : 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
          }}
        >
          <Image
            src="/character/messi-intro.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "48% center" }}
          />
        </div>

        {/* ── SLAM IMAGE ── */}
        <AnimatePresence>
          {(phase === "slamming" || phase === "holding" || phase === "exiting") && (
            <motion.div
              key="slam"
              initial={{ scale: 1.14, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              <Image
                src="/character/messi-intro.png"
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: "48% center" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RED FLASH on slam ── */}
        <AnimatePresence>
          {phase === "slamming" && (
            <motion.div
              key="flash"
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(208,40,40,0.5)",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* ── SCREEN SHAKE wrapper ── */}
        <AnimatePresence>
          {phase === "slamming" && (
            <motion.div
              key="shake"
              animate={{
                x: [0, -7, 6, -5, 4, -2, 1, 0],
                y: [0, 4, -6, 3, -2, 1, 0],
              }}
              transition={{ duration: 0.25, ease: "linear" }}
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            />
          )}
        </AnimatePresence>

        {/* ── HUD GLITCH LABELS (over the portrait) ── */}
        <AnimatePresence>
          {(phase === "holding") && (
            <motion.div
              key="hud"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                fontFamily: "var(--font-mono)",
              }}
            >
              {/* top-left classification stamp */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: [0, 1, 0.7, 1], x: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                style={{
                  position: "absolute",
                  top: "clamp(1.2rem, 4vw, 2.5rem)",
                  left: "clamp(1rem, 3vw, 2rem)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <span style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.25em",
                  color: "var(--clr-red)",
                  textTransform: "uppercase",
                  opacity: 0.9,
                }}>
                  ▸ SUBJECT IDENTIFIED
                </span>
                <span style={{
                  fontSize: "clamp(1.4rem, 5vw, 2.8rem)",
                  letterSpacing: "0.06em",
                  color: "var(--clr-text-primary)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}>
                  MESSI
                </span>
                <span style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  color: "var(--clr-text-secondary)",
                  textTransform: "uppercase",
                }}>
                  ARG ·  THREAT LEVEL: ██████ MAX
                </span>
              </motion.div>

              {/* bottom-right data strip */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 1, 0.8, 1], y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{
                  position: "absolute",
                  bottom: "clamp(5rem, 12vw, 8rem)",
                  right: "clamp(1rem, 3vw, 2rem)",
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                <span style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  color: "var(--clr-gold)",
                  textTransform: "uppercase",
                }}>
                  WORLD CUP 2026
                </span>
                <span style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.18em",
                  color: "var(--clr-text-secondary)",
                  textTransform: "uppercase",
                }}>
                  SIGNAL  98.4%  ·  LOCKED
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HEAVY VIGNETTE ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(3,5,8,0.5) 65%, rgba(3,5,8,0.92) 100%)",
            opacity: phase === "waiting" ? 0.4 : 1,
            transition: "opacity 0.4s",
          }}
        />

        {/* ── RGB GLITCH on exit ── */}
        <AnimatePresence>
          {phase === "exiting" && (
            <>
              <motion.div
                key="r"
                initial={{ opacity: 0.18, x: 0 }}
                animate={{ opacity: [0.18, 0, 0.22, 0], x: [0, 12, -8, 0] }}
                transition={{ duration: 0.35, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(208,40,40,0.18)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
              <motion.div
                key="b"
                initial={{ opacity: 0.12, x: 0 }}
                animate={{ opacity: [0.12, 0, 0.18, 0], x: [0, -10, 7, 0] }}
                transition={{ duration: 0.35, ease: "linear", delay: 0.05 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,212,255,0.12)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
              <motion.div
                key="fade-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.45, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--clr-void)",
                  pointerEvents: "none",
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* ── TAP PROMPT — first tap ── */}
        <AnimatePresence>
          {phase === "waiting" && (
            <motion.div
              key="prompt-reveal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                bottom: "clamp(2rem, 6vw, 3.5rem)",
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6rem",
                pointerEvents: "none",
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.49, 0.5] }}
                style={{
                  width: 1,
                  height: "clamp(18px, 3vw, 28px)",
                  background: "var(--clr-text-dim)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--clr-text-secondary)",
                }}
              >
                TAP TO REVEAL
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TAP PROMPT — second tap ── */}
        <AnimatePresence>
          {phase === "holding" && (
            <motion.div
              key="prompt-enter"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                bottom: "clamp(2rem, 6vw, 3.5rem)",
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6rem",
                pointerEvents: "none",
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.49, 0.5] }}
                style={{
                  width: 1,
                  height: "clamp(18px, 3vw, 28px)",
                  background: "var(--clr-red)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--clr-text-primary)",
                }}
              >
                TAP TO ENTER THE ARENA
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INTENSIFIED SCANLINES (replaces the quieter body::after during intro) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
            opacity: phase === "holding" ? 1 : 0.5,
            transition: "opacity 0.3s",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
