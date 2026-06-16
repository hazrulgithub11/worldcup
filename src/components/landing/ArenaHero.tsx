"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ArenaHero() {
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
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Layer 0: deep background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 120%, #0d1f3c 0%, var(--clr-void) 70%),
            radial-gradient(ellipse 40% 30% at 20% 80%, rgba(208,40,40,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(0,36,149,0.18) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Layer 1: pitch light beams ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-px origin-bottom"
            style={{
              left: `${10 + i * 20}%`,
              height: "75%",
              background: `linear-gradient(to top, rgba(232,184,75,${0.06 - i * 0.008}), transparent)`,
              transform: `rotate(${-10 + i * 5}deg)`,
            }}
          />
        ))}
      </div>

      {/* ── Layer 2: HUD top bar ── */}
      <div
        className="relative z-10 flex items-center justify-between px-6 pt-5"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div className="flex items-center gap-3">
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

        {/* Live timer */}
        <div
          className="flex flex-col items-center"
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
              fontSize: "clamp(1rem, 3vw, 1.75rem)",
              letterSpacing: "0.1em",
            }}
          >
            07:03
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-micro"
            style={{ color: "var(--clr-red-hot)", letterSpacing: "0.2em" }}
          >
            ● LIVE
          </span>
        </div>
      </div>

      {/* ── Layer 3: Monumental title ── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ paddingTop: "clamp(2rem, 6vw, 5rem)" }}
      >
        {/* "WORLD CUP" in giant stroked outline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none text-center"
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
        </motion.div>

        {/* Year stamp — overlapping, rotated */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
          style={{
            marginTop: "-1.5vw",
            marginLeft: "clamp(4rem, 22vw, 20rem)",
            zIndex: 20,
          }}
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

        {/* Sub-tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-fine mt-6"
          style={{ color: "var(--clr-text-secondary)", letterSpacing: "0.3em" }}
        >
          FIGHT NIGHT SCHEDULE
        </motion.p>
      </div>

      {/* ── Layer 4: VS badge in hero center ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ top: "10%" }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(12rem, 45vw, 42rem)",
            color: "var(--clr-gold)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          VS
        </span>
      </motion.div>

      {/* ── Layer 5: Country flag strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 flex items-center justify-center flex-wrap"
        style={{ marginTop: "clamp(2rem, 8vw, 6rem)", padding: "0 1rem", gap: "clamp(0.5rem, 2vw, 1rem)" }}
      >
        {["🇧🇷","🇫🇷","🇦🇷","🏴󠁧󠁢󠁥󠁮󠁧󠁿","🇩🇪","🇪🇸","🇵🇹","🇳🇱","🇺🇸","🇲🇽","🇨🇦","🇯🇵","🇸🇳","🇲🇦","🇭🇷","🇺🇾"].map((flag, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.04, duration: 0.4 }}
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
              filter: "drop-shadow(0 0 6px rgba(0,0,0,0.8))",
            }}
          >
            {flag}
          </motion.span>
        ))}
      </motion.div>

      {/* ── Layer 6: scroll invitation ── */}
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

      {/* ── Bottom fade into next scene ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--clr-void))",
        }}
      />
    </section>
  );
}
