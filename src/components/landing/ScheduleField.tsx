"use client";

import { motion } from "framer-motion";
import { Fixture, stageLabel } from "@/data/fixtures";
import { teams } from "@/data/teams";

interface Props {
  fixtures: Fixture[];
  activeId: string | null;
  onSelect: (fixture: Fixture) => void;
}

/* Each ticket gets a unique "placed" feel — varied rotation, vertical offset */
function getTicketStyle(index: number): {
  rotate: number;
  translateY: number;
  zBase: number;
} {
  const pattern = [
    { rotate: -1.8, translateY: 0, zBase: 1 },
    { rotate: 0.6, translateY: -8, zBase: 2 },
    { rotate: -0.4, translateY: 4, zBase: 1 },
    { rotate: 1.2, translateY: -4, zBase: 3 },
    { rotate: -1.0, translateY: 12, zBase: 1 },
    { rotate: 0.3, translateY: -2, zBase: 2 },
    { rotate: -0.8, translateY: 6, zBase: 1 },
    { rotate: 1.5, translateY: -10, zBase: 2 },
  ];
  return pattern[index % pattern.length];
}

function TicketCard({
  fixture,
  isActive,
  index,
  onClick,
}: {
  fixture: Fixture;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  const home = teams[fixture.homeTeamId];
  const away = teams[fixture.awayTeamId];
  if (!home || !away) return null;

  const { rotate, translateY, zBase } = getTicketStyle(index);
  const isKO = fixture.stage !== "group";
  const isFinal = fixture.stage === "final";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, rotate }}
      animate={{
        opacity: 1,
        y: isActive ? translateY - 8 : translateY,
        rotate: isActive ? 0 : rotate,
        scale: isActive ? 1.04 : 1,
        zIndex: isActive ? 20 : zBase,
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: translateY - 6,
        rotate: rotate * 0.4,
        scale: 1.03,
        zIndex: 15,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      onClick={onClick}
      style={{
        cursor: "pointer",
        position: "relative",
        transformOrigin: "bottom center",
      }}
    >
      {/* Ticket body */}
      <div
        style={{
          position: "relative",
          background: isActive
            ? "var(--clr-mid)"
            : "var(--clr-surface)",
          border: isActive
            ? `1px solid var(--clr-gold)`
            : isFinal
            ? `1px solid var(--clr-red)`
            : `1px solid var(--clr-border)`,
          overflow: "hidden",
          transition: "border-color 0.25s, background 0.25s",
          /* Parallelogram ticket shape */
          clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
          padding: "0.75rem 1.2rem",
          minWidth: "clamp(160px, 44vw, 280px)",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: isActive
              ? "var(--clr-gold)"
              : isFinal
              ? "var(--clr-red)"
              : isKO
              ? "var(--clr-electric-dim)"
              : "transparent",
            transition: "background 0.25s",
          }}
        />

        {/* Stage micro-label */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: isActive
              ? "var(--clr-gold)"
              : "var(--clr-text-dim)",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
            transition: "color 0.2s",
          }}
        >
          {fixture.groupLabel ?? stageLabel[fixture.stage]}
        </div>

        {/* Matchup */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
            <div
              className="flex items-center gap-1.5"
              style={{ marginBottom: "0.2rem" }}
            >
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>{home.flag}</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(0.75rem, 1.8vw, 1.1rem)",
                  color: "var(--clr-text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {home.shortName}
              </span>
            </div>

            {/* VS divider */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.55rem",
                color: "var(--clr-gold)",
                letterSpacing: "0.3em",
                lineHeight: 1,
                margin: "0.1rem 0",
              }}
            >
              VS
            </div>

            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>{away.flag}</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(0.75rem, 1.8vw, 1.1rem)",
                  color: "var(--clr-text-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {away.shortName}
              </span>
            </div>
          </div>

          {/* Right: time/date block */}
          <div
            className="flex flex-col items-end"
            style={{ flexShrink: 0 }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.65rem, 1.4vw, 0.9rem)",
                color: isActive ? "var(--clr-gold)" : "var(--clr-text-secondary)",
                letterSpacing: "0.06em",
                transition: "color 0.2s",
              }}
            >
              {fixture.time}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5rem",
                color: "var(--clr-text-dim)",
                letterSpacing: "0.1em",
                textAlign: "right",
                lineHeight: 1.4,
                marginTop: "0.15rem",
              }}
            >
              {fixture.date.replace(", 2026", "")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.45rem",
                color: "var(--clr-text-dim)",
                letterSpacing: "0.1em",
                textAlign: "right",
                marginTop: "0.1rem",
              }}
            >
              {fixture.city}
            </span>
          </div>
        </div>

        {/* Active selected indicator */}
        {isActive && (
          <motion.div
            layoutId="ticket-active"
            style={{
              position: "absolute",
              inset: 0,
              border: "1px solid var(--clr-gold)",
              pointerEvents: "none",
              clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default function ScheduleField({ fixtures, activeId, onSelect }: Props) {
  if (!fixtures.length) {
    return (
      <section
        className="relative w-full flex items-center justify-center"
        style={{ minHeight: 200, padding: "var(--space-xl) var(--space-lg)" }}
      >
        <p
          className="text-fine"
          style={{ color: "var(--clr-text-dim)" }}
        >
          NO FIXTURES FOR THIS ROUND
        </p>
      </section>
    );
  }

  return (
    <section
      className="relative w-full"
      style={{
        padding: "0 clamp(1rem, 4vw, 2rem) var(--space-2xl)",
        zIndex: 10,
      }}
    >
      {/* Section label */}
      <div className="flex items-baseline gap-4 mb-8">
        <span
          className="text-fine"
          style={{ color: "var(--clr-text-dim)" }}
        >
          FIXTURES
        </span>
        <span
          className="text-fine"
          style={{ color: "var(--clr-text-dim)" }}
        >
          /{fixtures.length} MATCHES
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(to right, var(--clr-border), transparent)",
          }}
        />
      </div>

      {/* ── Ticket field — intentionally NOT a grid ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(0.6rem, 2vw, 1.5rem)",
          alignItems: "flex-start",
        }}
      >
        {fixtures.map((fixture, i) => (
          <TicketCard
            key={fixture.id}
            fixture={fixture}
            isActive={activeId === fixture.id}
            index={i}
            onClick={() => onSelect(fixture)}
          />
        ))}
      </div>

      {/* Footer instruction */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-micro mt-10"
        style={{ color: "var(--clr-text-dim)" }}
      >
        TAP A TICKET TO SELECT YOUR FIGHT
      </motion.p>
    </section>
  );
}
