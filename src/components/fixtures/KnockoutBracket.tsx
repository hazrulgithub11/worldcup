"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Fixture, knockoutFixtures, stageLabel } from "@/data/fixtures";
import { teams } from "@/data/teams";

const STAGE_ACCENT: Record<Fixture["stage"], string> = {
  group: "var(--clr-electric-dim)",
  "round-of-16": "var(--clr-gold)",
  "quarter-final": "var(--clr-gold)",
  "semi-final": "var(--clr-red)",
  final: "var(--clr-red-hot)",
};

/* Asymmetric placement — each slot feels hand-placed on the arena floor */
const SLOT_LAYOUT: Record<
  string,
  { x: string; y: string; rotate: number; scale: number }
> = {
  "qf-a": { x: "6%", y: "14%", rotate: -2.4, scale: 0.94 },
  "qf-b": { x: "28%", y: "8%", rotate: 1.1, scale: 1.02 },
  "qf-c": { x: "58%", y: "12%", rotate: -0.8, scale: 0.98 },
  "qf-d": { x: "78%", y: "6%", rotate: 2.2, scale: 1.04 },
  "sf-top": { x: "22%", y: "42%", rotate: -1.2, scale: 1.08 },
  "sf-bottom": { x: "62%", y: "46%", rotate: 0.9, scale: 1.06 },
  final: { x: "38%", y: "72%", rotate: 0, scale: 1.22 },
};

const BRACKET_PATHS = [
  { from: "qf-a", to: "sf-top" },
  { from: "qf-c", to: "sf-top" },
  { from: "qf-b", to: "sf-bottom" },
  { from: "qf-d", to: "sf-bottom" },
  { from: "sf-top", to: "final" },
  { from: "sf-bottom", to: "final" },
];

function slotCenter(slot: string): { cx: number; cy: number } {
  const layout = SLOT_LAYOUT[slot];
  if (!layout) return { cx: 50, cy: 50 };
  const x = parseFloat(layout.x) + 8;
  const y = parseFloat(layout.y) + 6;
  return { cx: x, cy: y };
}

function MatchNode({
  fixture,
  isActive,
  isLit,
  onClick,
}: {
  fixture: Fixture;
  isActive: boolean;
  isLit: boolean;
  onClick: () => void;
}) {
  const home = teams[fixture.homeTeamId];
  const away = teams[fixture.awayTeamId];
  if (!home || !away) return null;

  const slot = fixture.bracketSlot ?? fixture.id;
  const layout = SLOT_LAYOUT[slot] ?? { x: "50%", y: "50%", rotate: 0, scale: 1 };
  const accent = STAGE_ACCENT[fixture.stage];
  const isFinal = fixture.stage === "final";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: isActive ? layout.scale * 1.08 : layout.scale,
        rotate: isActive ? 0 : layout.rotate,
      }}
      whileHover={{ scale: layout.scale * 1.05, rotate: layout.rotate * 0.3 }}
      whileTap={{ scale: layout.scale * 0.97 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-pressed={isActive}
      aria-label={`${home.name} vs ${away.name}, ${stageLabel[fixture.stage]}`}
      style={{
        position: "absolute",
        left: layout.x,
        top: layout.y,
        zIndex: isActive ? 30 : isLit ? 20 : 10,
        cursor: "pointer",
        border: "none",
        background: "none",
        padding: 0,
        textAlign: "left",
        transformOrigin: "center center",
      }}
    >
      {/* Glow halo when lit on path */}
      {isLit && !isActive && (
        <motion.div
          layoutId={`glow-${fixture.id}`}
          style={{
            position: "absolute",
            inset: "-12px",
            borderRadius: 2,
            background: `radial-gradient(ellipse at center, color-mix(in srgb, ${accent} 25%, transparent) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          padding: isFinal ? "1rem 1.4rem" : "0.7rem 1rem",
          minWidth: isFinal ? "clamp(200px, 38vw, 320px)" : "clamp(140px, 28vw, 220px)",
          background: isActive
            ? `color-mix(in srgb, ${accent} 18%, var(--clr-mid))`
            : "var(--clr-surface)",
          border: isActive
            ? `2px solid ${accent}`
            : isLit
            ? `1px solid color-mix(in srgb, ${accent} 60%, var(--clr-border))`
            : `1px solid var(--clr-border)`,
          clipPath: isFinal
            ? "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)"
            : "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
          boxShadow: isActive ? `0 0 24px color-mix(in srgb, ${accent} 40%, transparent)` : "none",
          transition: "border-color 0.25s, background 0.25s, box-shadow 0.25s",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: isFinal ? 3 : 2,
            background: isActive || isLit ? accent : "transparent",
            transition: "background 0.25s",
          }}
        />

        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: isFinal ? "0.55rem" : "0.45rem",
            letterSpacing: "0.22em",
            color: isActive ? accent : "var(--clr-text-dim)",
            textTransform: "uppercase",
            marginBottom: "0.45rem",
          }}
        >
          {stageLabel[fixture.stage]}
        </span>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: isFinal ? "1.3rem" : "1rem" }}>{home.flag}</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isFinal ? "clamp(1rem, 2.5vw, 1.5rem)" : "clamp(0.8rem, 2vw, 1.1rem)",
                color: "var(--clr-text-primary)",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              {home.shortName}
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.5rem",
              color: accent,
              letterSpacing: "0.35em",
              paddingLeft: "0.2rem",
            }}
          >
            VS
          </span>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: isFinal ? "1.3rem" : "1rem" }}>{away.flag}</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isFinal ? "clamp(1rem, 2.5vw, 1.5rem)" : "clamp(0.8rem, 2vw, 1.1rem)",
                color: "var(--clr-text-primary)",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              {away.shortName}
            </span>
          </div>
        </div>

        {isActive && (
          <motion.div
            layoutId="bracket-active-ring"
            style={{
              position: "absolute",
              inset: 0,
              border: `1px solid ${accent}`,
              pointerEvents: "none",
              clipPath: isFinal
                ? "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)"
                : "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
            }}
          />
        )}
      </div>
    </motion.button>
  );
}

function MatchDetail({ fixture, onClose }: { fixture: Fixture; onClose: () => void }) {
  const home = teams[fixture.homeTeamId];
  const away = teams[fixture.awayTeamId];
  if (!home || !away) return null;

  const accent = STAGE_ACCENT[fixture.stage];
  const isFinal = fixture.stage === "final";

  return (
    <motion.aside
      key={fixture.id}
      initial={{ opacity: 0, y: 40, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 24, x: "-50%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        bottom: "clamp(1rem, 4vh, 2rem)",
        left: "50%",
        zIndex: 50,
        width: "min(92vw, 520px)",
        background: "var(--clr-pitch)",
        border: `1px solid ${accent}`,
        clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
        overflow: "hidden",
      }}
    >
      {/* Split team colors bleeding in */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg,
            color-mix(in srgb, ${home.primaryColor} 22%, transparent) 0%,
            transparent 45%,
            color-mix(in srgb, ${away.primaryColor} 22%, transparent) 100%
          )`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", padding: "1.25rem 1.5rem 1.5rem" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span
              className="text-micro"
              style={{ color: accent, display: "block", marginBottom: "0.35rem" }}
            >
              {isFinal ? "⚡ CHAMPIONSHIP MATCH ⚡" : stageLabel[fixture.stage]}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                lineHeight: 1,
                letterSpacing: "0.03em",
              }}
            >
              {home.name}
              <span style={{ color: accent, margin: "0 0.3em" }}>×</span>
              {away.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close match details"
            style={{
              flexShrink: 0,
              background: "none",
              border: "1px solid var(--clr-border)",
              color: "var(--clr-text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              padding: "0.35em 0.6em",
              cursor: "pointer",
            }}
          >
            ESC
          </button>
        </div>

        <div
          className="flex items-center justify-between"
          style={{
            borderTop: "1px solid var(--clr-border)",
            paddingTop: "1rem",
            gap: "1rem",
          }}
        >
          <div>
            <span className="text-micro" style={{ color: "var(--clr-text-dim)", display: "block" }}>
              KICKOFF
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1rem, 3vw, 1.4rem)",
                color: accent,
                letterSpacing: "0.08em",
              }}
            >
              {fixture.time}
            </span>
            <span
              className="text-fine"
              style={{ color: "var(--clr-text-secondary)", display: "block", marginTop: "0.2rem" }}
            >
              {fixture.date}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="text-micro" style={{ color: "var(--clr-text-dim)", display: "block" }}>
              VENUE
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
                letterSpacing: "0.04em",
                lineHeight: 1.2,
              }}
            >
              {fixture.venue}
            </span>
            <span className="text-fine" style={{ color: "var(--clr-text-dim)", display: "block" }}>
              {fixture.city}
            </span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function BracketPaths({ activeSlot }: { activeSlot: string | null }) {
  const pathToFinal = activeSlot
    ? new Set(
        BRACKET_PATHS.flatMap((p) => {
          if (p.from === activeSlot || p.to === activeSlot) return [p.from, p.to];
          if (activeSlot === "final") return ["sf-top", "sf-bottom", "final"];
          return [];
        })
      )
    : new Set<string>();

  if (activeSlot === "sf-top" || activeSlot === "sf-bottom") {
    pathToFinal.add(activeSlot);
    pathToFinal.add("final");
    BRACKET_PATHS.filter((p) => p.to === activeSlot).forEach((p) => pathToFinal.add(p.from));
  }
  if (activeSlot?.startsWith("qf-")) {
    const sf = BRACKET_PATHS.find((p) => p.from === activeSlot)?.to;
    if (sf) {
      pathToFinal.add(activeSlot);
      pathToFinal.add(sf);
      pathToFinal.add("final");
    }
  }
  if (activeSlot === "final") {
    ["qf-a", "qf-b", "qf-c", "qf-d", "sf-top", "sf-bottom", "final"].forEach((s) =>
      pathToFinal.add(s)
    );
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {BRACKET_PATHS.map(({ from, to }) => {
        const a = slotCenter(from);
        const b = slotCenter(to);
        const isLit =
          pathToFinal.has(from) && pathToFinal.has(to) && activeSlot !== null;
        const midY = (a.cy + b.cy) / 2;
        const d = `M ${a.cx} ${a.cy} C ${a.cx} ${midY}, ${b.cx} ${midY}, ${b.cx} ${b.cy}`;

        return (
          <motion.path
            key={`${from}-${to}`}
            d={d}
            fill="none"
            stroke={isLit ? "var(--clr-gold)" : "var(--clr-border)"}
            strokeWidth={isLit ? 0.35 : 0.2}
            strokeDasharray={isLit ? "none" : "1.2 1.8"}
            initial={{ pathLength: 0, opacity: 0.3 }}
            animate={{
              pathLength: 1,
              opacity: isLit ? 0.9 : 0.35,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </svg>
  );
}

export default function KnockoutBracket() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeFixture = knockoutFixtures.find((f) => f.id === activeId) ?? null;
  const activeSlot = activeFixture?.bracketSlot ?? null;

  const litSlots = new Set<string>();
  if (activeSlot) {
    if (activeSlot === "final") {
      Object.keys(SLOT_LAYOUT).forEach((s) => litSlots.add(s));
    } else if (activeSlot.startsWith("qf-")) {
      const sf = BRACKET_PATHS.find((p) => p.from === activeSlot)?.to;
      litSlots.add(activeSlot);
      if (sf) litSlots.add(sf);
      litSlots.add("final");
    } else if (activeSlot.startsWith("sf-")) {
      litSlots.add(activeSlot);
      litSlots.add("final");
      BRACKET_PATHS.filter((p) => p.to === activeSlot).forEach((p) => litSlots.add(p.from));
    }
  }

  function handleSelect(fixture: Fixture) {
    setActiveId((prev) => (prev === fixture.id ? null : fixture.id));
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--clr-void)" }}>
      {/* ── Hero scene ── */}
      <header
        style={{
          position: "relative",
          padding: "clamp(2rem, 8vh, 5rem) clamp(1rem, 4vw, 2rem) 0",
          zIndex: 5,
        }}
      >
        <Link
          href="/"
          className="text-micro"
          style={{
            color: "var(--clr-text-dim)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "1.5rem",
          }}
        >
          ← ARENA
        </Link>

        <div style={{ position: "relative" }}>
          {/* Monumental ghost type behind */}
          <span
            aria-hidden
            className="text-stroke-gold"
            style={{
              position: "absolute",
              top: "-0.15em",
              left: "-0.02em",
              fontFamily: "var(--font-display)",
              fontSize: "var(--size-monumental)",
              lineHeight: 0.85,
              opacity: 0.07,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            KO
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--size-hero)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              position: "relative",
            }}
          >
            ROAD TO
            <br />
            <span style={{ color: "var(--clr-red-hot)", marginLeft: "0.15em" }}>GLORY</span>
          </h1>

          <p
            className="text-fine"
            style={{
              color: "var(--clr-text-secondary)",
              marginTop: "1.25rem",
              maxWidth: "28ch",
              lineHeight: 1.6,
            }}
          >
            Quarter-finals through the final — tap a bout to trace the path to the trophy.
          </p>
        </div>
      </header>

      {/* ── Bracket arena (desktop / tablet) ── */}
      <section
        aria-label="Knockout bracket"
        className="hidden sm:block"
        style={{
          position: "relative",
          margin: "clamp(1rem, 4vh, 2rem) auto 0",
          width: "min(96vw, 1100px)",
          height: "clamp(520px, 72vh, 680px)",
          padding: "0 clamp(0.5rem, 2vw, 1rem)",
        }}
      >
        {/* Pitch floor */}
        <div
          style={{
            position: "absolute",
            inset: "8% 2% 4%",
            background: `
              radial-gradient(ellipse 80% 60% at 50% 80%, color-mix(in srgb, var(--clr-red-hot) 8%, transparent) 0%, transparent 60%),
              radial-gradient(ellipse 100% 80% at 50% 50%, var(--clr-pitch) 0%, var(--clr-void) 100%)
            `,
            border: "1px solid var(--clr-border)",
            clipPath: "polygon(0 3%, 100% 0%, 100% 97%, 0 100%)",
          }}
        />

        {/* Stage labels — editorial, not grid headers */}
        <span
          className="text-micro"
          style={{
            position: "absolute",
            left: "4%",
            top: "2%",
            color: "var(--clr-gold)",
            transform: "rotate(-3deg)",
          }}
        >
          QUARTERS
        </span>
        <span
          className="text-micro"
          style={{
            position: "absolute",
            left: "38%",
            top: "36%",
            color: "var(--clr-red)",
            transform: "rotate(2deg)",
          }}
        >
          SEMIS
        </span>
        <span
          className="text-micro"
          style={{
            position: "absolute",
            right: "8%",
            bottom: "18%",
            color: "var(--clr-red-hot)",
            letterSpacing: "0.3em",
          }}
        >
          FINAL
        </span>

        <BracketPaths activeSlot={activeSlot} />

        {knockoutFixtures.map((fixture) => (
          <MatchNode
            key={fixture.id}
            fixture={fixture}
            isActive={activeId === fixture.id}
            isLit={litSlots.has(fixture.bracketSlot ?? "")}
            onClick={() => handleSelect(fixture)}
          />
        ))}

        {/* Trophy whisper at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          aria-hidden
          style={{
            position: "absolute",
            bottom: "2%",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem, 14vw, 9rem)",
            color: "var(--clr-gold)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          ★
        </motion.div>
      </section>

      {/* Mobile stack fallback — visible only on small screens */}
      <section
        className="sm:hidden"
        style={{
          padding: "var(--space-lg) clamp(1rem, 4vw, 2rem) var(--space-2xl)",
        }}
      >
        <p className="text-micro mb-6" style={{ color: "var(--clr-text-dim)" }}>
          SCROLL THE BRACKET ABOVE — OR PICK BELOW
        </p>
        <div className="flex flex-col gap-3">
          {knockoutFixtures.map((fixture, i) => {
            const home = teams[fixture.homeTeamId];
            const away = teams[fixture.awayTeamId];
            if (!home || !away) return null;
            const accent = STAGE_ACCENT[fixture.stage];
            const isActive = activeId === fixture.id;
            return (
              <motion.button
                key={fixture.id}
                type="button"
                onClick={() => handleSelect(fixture)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  textAlign: "left",
                  padding: "0.85rem 1rem",
                  background: isActive ? "var(--clr-mid)" : "var(--clr-surface)",
                  border: isActive ? `1px solid ${accent}` : "1px solid var(--clr-border)",
                  cursor: "pointer",
                }}
              >
                <span className="text-micro" style={{ color: accent }}>
                  {stageLabel[fixture.stage]}
                </span>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    marginTop: "0.3rem",
                  }}
                >
                  {home.flag} {home.shortName} vs {away.flag} {away.shortName}
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <p
        className="text-micro hidden sm:block"
        style={{
          textAlign: "center",
          color: "var(--clr-text-dim)",
          padding: "0 var(--space-lg) var(--space-2xl)",
        }}
      >
        TAP A MATCH — WATCH THE PATH LIGHT UP
      </p>

      <AnimatePresence>
        {activeFixture && (
          <MatchDetail fixture={activeFixture} onClose={() => setActiveId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
