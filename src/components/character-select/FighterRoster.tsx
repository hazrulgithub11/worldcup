"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Fighter } from "@/data/fighters";
import { teams } from "@/data/teams";

interface Props {
  fighters: Fighter[];
  focusedIndex: number;
  onFocus: (i: number) => void;
  compact?: boolean;
}

export default function FighterRoster({ fighters, focusedIndex, onFocus, compact = false }: Props) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRefs.current[focusedIndex];
    if (!card || !stripRef.current) return;
    const strip = stripRef.current;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const stripWidth = strip.offsetWidth;
    strip.scrollTo({
      left: cardLeft - stripWidth / 2 + cardWidth / 2,
      behavior: "smooth",
    });
  }, [focusedIndex]);

  return (
    <div
      ref={stripRef}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 0,
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingLeft: "50vw",
        paddingRight: "50vw",
        paddingBottom: 0,
      }}
    >
      {fighters.map((fighter, i) => {
        const team = teams[fighter.teamId];
        const isFocused = i === focusedIndex;
        const offset = i - focusedIndex;
        const absDist = Math.abs(offset);

        const cardWidth = isFocused ? (compact ? 84 : 100) : compact ? 68 : 78;
        const cardHeight = isFocused ? (compact ? 112 : 140) : compact ? 88 : 108;

        return (
          <button
            key={fighter.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            onClick={() => onFocus(i)}
            style={{
              position: "relative",
              flexShrink: 0,
              width: cardWidth,
              height: cardHeight,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              marginRight: -8,
              outline: "none",
              transition: "width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1)",
              zIndex: isFocused ? 10 : 5 - absDist,
            }}
            aria-label={`Browse ${fighter.name}`}
            tabIndex={-1}
          >
            {/* Card body — parallelogram */}
            <motion.div
              animate={{
                opacity: isFocused ? 1 : Math.max(0.25, 1 - absDist * 0.18),
                scale: isFocused ? 1 : 0.96,
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                background: isFocused
                  ? `linear-gradient(180deg, ${team?.primaryColor ?? "#1e2d44"}33 0%, ${team?.primaryColor ?? "#1e2d44"}88 100%)`
                  : "var(--clr-surface)",
                borderTop: isFocused
                  ? `2px solid ${team?.primaryColor ?? "var(--clr-gold)"}`
                  : "2px solid var(--clr-border)",
                transition: "background 0.3s, border-color 0.3s",
              }}
            />

            {/* Gold outline on focused card */}
            {isFocused && (
              <motion.div
                layoutId="roster-focus"
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                  boxShadow: `inset 0 0 0 2px var(--clr-gold), 0 0 16px ${team?.primaryColor ?? "var(--clr-gold)"}66`,
                  pointerEvents: "none",
                  zIndex: 2,
                }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            {/* Flag + shortname */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                pointerEvents: "none",
                transform: "skewX(0deg)",
                zIndex: 3,
              }}
            >
              <span style={{ fontSize: isFocused ? (compact ? "1.65rem" : "2rem") : compact ? "1.35rem" : "1.55rem", lineHeight: 1, transition: "font-size 0.2s" }}>
                {team?.flag ?? "🌐"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: isFocused ? "0.55rem" : "0.48rem",
                  letterSpacing: "0.12em",
                  color: isFocused ? "var(--clr-gold)" : "var(--clr-text-secondary)",
                  textTransform: "uppercase",
                  transition: "font-size 0.2s, color 0.2s",
                }}
              >
                {team?.shortName ?? "???"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
