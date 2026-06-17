"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion } from "framer-motion";

interface ArenaHeroProps {
  sectionRef?: RefObject<HTMLElement | null>;
}

export default function ArenaHero({ sectionRef }: ArenaHeroProps) {
  const timerRef = useRef<HTMLSpanElement>(null);

  /* Fake match timer counting down from 07:03 */
  useEffect(() => {
    let seconds = 7 * 60 + 3;
    const tick = setInterval(() => {
      if (!timerRef.current) return;
      seconds = Math.max(0, seconds - 1);
      const m = Math.floor(seconds / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      timerRef.current.textContent = `${m}:${s}`;
      if (seconds === 0) clearInterval(tick);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-0 w-full overflow-hidden"
      style={{ height: "100svh" }}
    >
      {/* ── Layer 0: hero background — mobile portrait / desktop landscape ── */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            backgroundImage: "url('/background%20desktop.png')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* ── Layer 1: readability overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 28%, transparent 55%, rgba(0,0,0,0.35) 100%)
          `,
        }}
      />

      {/* ── Layer 2: HUD top bar ── */}
      <div className="relative z-10 mx-3 mt-3 px-4 py-3 sm:mx-0 sm:mt-0 sm:px-6 sm:pt-5 sm:pb-0">
        <div
          className="pointer-events-none absolute inset-0 rounded-sm sm:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 100%)",
          }}
        />
        <div
          className="relative grid grid-cols-2 items-center gap-x-3 gap-y-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-y-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <div className="col-start-1 row-start-1 flex items-center gap-2 justify-self-start">
            <span
              className="text-micro"
              style={{ color: "var(--clr-text-secondary)" }}
            >
              FIFA
            </span>
            <span
              className="text-micro"
              style={{
                color: "var(--clr-gold)",
                border: "1px solid var(--clr-gold-dim)",
                padding: "1px 6px",
              }}
            >
              2026
            </span>
          </div>

          <div className="col-start-2 row-start-1 flex items-center justify-self-end sm:col-start-3">
            <span
              className="text-micro"
              style={{ color: "var(--clr-red-hot)", letterSpacing: "0.2em" }}
            >
              ● LIVE
            </span>
          </div>

          <div
            className="col-span-2 row-start-2 flex flex-col items-center sm:col-span-1 sm:col-start-2 sm:row-start-1"
            style={{ color: "var(--clr-gold)" }}
          >
            <span
              className="text-fine"
              style={{ color: "var(--clr-text-secondary)", fontSize: "0.55rem" }}
            >
              MATCH CLOCK
            </span>
            <span
              ref={timerRef}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1.1rem, 5vw, 1.75rem)",
                letterSpacing: "0.1em",
                lineHeight: 1.1,
              }}
            >
              07:03
            </span>
          </div>
        </div>
      </div>

      {/* ── Layer 3: Monumental title ── */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ paddingTop: "clamp(2rem, 6vw, 5rem)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block select-none text-center"
        >
          <span
            className="block text-monumental text-stroke-gold"
            style={{ lineHeight: 0.85 }}
          >
            WORLD
          </span>
          <span
            className="block text-monumental"
            style={{
              color: "var(--clr-text-primary)",
              lineHeight: 0.85,
              fontFamily: "var(--font-display)",
              fontSize: "var(--size-monumental)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            CUP
          </span>

          {/* Year stamp — overlaps bottom-right of CUP without shifting title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2, x: "35%", y: "25%" }}
            animate={{ opacity: 1, scale: 1, rotate: -2, x: "35%", y: "25%" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute z-20"
            style={{ bottom: 0, right: 0 }}
          >
            <span
              className="stamp-border text-hero"
              style={{
                color: "var(--clr-gold)",
                fontSize: "clamp(1.6rem, 6vw, 5rem)",
                display: "inline-block",
              }}
            >
              2026
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Sub-tagline — centered below title */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative z-10 w-full text-center text-fine"
        style={{
          marginTop: "clamp(3rem, 12vw, 6rem)",
          color: "var(--clr-text-secondary)",
          letterSpacing: "0.3em",
        }}
      >
        FIGHT NIGHT SCHEDULE
      </motion.p>

      {/* ── Layer 4: scroll invitation ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-micro" style={{ color: "var(--clr-text-dim)" }}>
          SELECT YOUR MATCH
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ color: "var(--clr-gold-dim)" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
