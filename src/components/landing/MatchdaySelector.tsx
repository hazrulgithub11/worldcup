"use client";

import { motion } from "framer-motion";
import { matchdays } from "@/data/fixtures";

interface Props {
  active: number;
  onChange: (id: number) => void;
}

const stageColors: Record<number, string> = {
  1: "var(--clr-electric-dim)",
  2: "var(--clr-electric-dim)",
  3: "var(--clr-electric-dim)",
  4: "var(--clr-gold)",
  5: "var(--clr-gold)",
  6: "var(--clr-red)",
  7: "var(--clr-red-hot)",
};

/* Each matchday chip gets a slight rotation and varied size for rhythm */
const chipOffsets: Record<number, { rotate: number; scale: number; y: number }> = {
  1: { rotate: -1.5, scale: 1.0, y: 4 },
  2: { rotate: 0.5,  scale: 0.95, y: -2 },
  3: { rotate: -0.8, scale: 1.02, y: 6 },
  4: { rotate: 1.2,  scale: 1.08, y: -4 },
  5: { rotate: -1.0, scale: 1.1,  y: 2 },
  6: { rotate: 0.8,  scale: 1.14, y: -6 },
  7: { rotate: -0.5, scale: 1.22, y: 0 },
};

export default function MatchdaySelector({ active, onChange }: Props) {
  return (
    <section
      className="relative w-full"
      style={{
        padding: "var(--space-xl) clamp(1rem, 4vw, 2rem) var(--space-lg)",
        zIndex: 10,
      }}
    >
      {/* Section label — asymmetric, left-anchored */}
      <div className="flex items-baseline gap-4 mb-8">
        <span
          className="text-fine"
          style={{ color: "var(--clr-text-dim)" }}
        >
          SELECT ROUND
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(to right, var(--clr-border), transparent)",
          }}
        />
      </div>

      {/* ── Irregular chip rail ── */}
      <div
        className="flex items-end flex-wrap"
        style={{ padding: "0.5rem 0 1rem", gap: "clamp(0.4rem, 1.5vw, 0.75rem)" }}
      >
        {matchdays.map((md) => {
          const off = chipOffsets[md.id];
          const isActive = active === md.id;
          const accent = stageColors[md.id];
          const isFinal = md.id === 7;

          return (
            <motion.button
              key={md.id}
              onClick={() => onChange(md.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: off.y }}
              whileHover={{
                y: off.y - 6,
                transition: { duration: 0.18, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.6, delay: md.id * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative",
                rotate: `${off.rotate}deg`,
                scale: off.scale,
                cursor: "pointer",
                border: "none",
                background: "none",
                outline: "none",
              }}
            >
              {/* Chip body */}
              <div
                style={{
                  position: "relative",
                  padding: isFinal ? "0.6em 1.4em" : "0.5em 1.2em",
                  border: isActive
                    ? `2px solid ${accent}`
                    : `1px solid var(--clr-border)`,
                  background: isActive
                    ? `color-mix(in srgb, ${accent} 15%, var(--clr-pitch))`
                    : "var(--clr-surface)",
                  transition: "border-color 0.2s, background 0.2s",
                  clipPath: isFinal
                    ? "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)"
                    : undefined,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: isFinal
                      ? "clamp(0.9rem, 2.2vw, 1.6rem)"
                      : "clamp(0.75rem, 1.8vw, 1.2rem)",
                    color: isActive ? accent : "var(--clr-text-primary)",
                    lineHeight: 1,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s",
                  }}
                >
                  {md.label}
                </span>
                {md.sublabel && (
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.55rem",
                      color: isActive ? accent : "var(--clr-text-dim)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginTop: "0.15em",
                      transition: "color 0.2s",
                    }}
                  >
                    {md.sublabel}
                  </span>
                )}

                {/* Active glow underline */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: "10%",
                      right: "10%",
                      height: 2,
                      background: accent,
                      boxShadow: `0 0 8px ${accent}`,
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active matchday description */}
      <motion.p
        key={active}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-fine mt-4"
        style={{ color: "var(--clr-text-secondary)" }}
      >
        {matchdays.find((m) => m.id === active)?.sublabel ?? ""}
        {" "}— {matchdays.find((m) => m.id === active)?.label}
      </motion.p>
    </section>
  );
}
