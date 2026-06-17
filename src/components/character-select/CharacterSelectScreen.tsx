"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { fighters } from "@/data/fighters";
import { teams } from "@/data/teams";
import { useIsMobile } from "@/hooks/useIsMobile";
import { playCharacterBrowseSound } from "@/lib/sounds/characterBrowse";
import FighterRoster from "./FighterRoster";

/* ── Fighter silhouette SVG (when no fullImage) ──────────────── */
function FighterSilhouette({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <ellipse cx="100" cy="55" rx="30" ry="34" fill={color} opacity="0.3" />
      <path d="M62 95 Q62 76 100 76 Q138 76 138 95 L148 250 L52 250 Z" fill={color} opacity="0.28" />
      <path d="M62 108 L18 205 Q14 215 23 219 L68 182 Z" fill={color} opacity="0.25" />
      <path d="M138 108 L182 198 Q186 208 177 212 L132 177 Z" fill={color} opacity="0.25" />
      <path d="M78 248 L66 360 Q64 376 80 377 L100 252 Z" fill={color} opacity="0.28" />
      <path d="M122 248 L134 360 Q136 376 120 377 L100 252 Z" fill={color} opacity="0.28" />
    </svg>
  );
}

/* ── Stat bar ────────────────────────────────────────────────── */
function StatBar({
  label,
  value,
  color,
  mobile = false,
}: {
  label: string;
  value: number;
  color: string;
  mobile?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: mobile ? 5 : 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: mobile ? "0.58rem" : "0.5rem",
            letterSpacing: "0.15em",
            color: "var(--clr-text-secondary)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: mobile ? "0.62rem" : "0.55rem",
            color: "var(--clr-text-primary)",
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: "var(--clr-border)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <motion.div
          key={value}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ height: "100%", background: color, boxShadow: `0 0 5px ${color}88` }}
        />
      </div>
    </div>
  );
}

export default function CharacterSelectScreen() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const isMobile = useIsMobile(768);
  const skipSound = useRef(true);

  const fighter = fighters[focusedIndex];
  const team = teams[fighter.teamId];

  const browseTo = useCallback((index: number) => {
    setFocusedIndex((prev) => {
      if (prev === index) return prev;
      if (!skipSound.current) {
        const direction =
          index === 0 && prev === fighters.length - 1
            ? "right"
            : index === fighters.length - 1 && prev === 0
              ? "left"
              : index > prev
                ? "right"
                : "left";
        playCharacterBrowseSound(direction);
      }
      return index;
    });
  }, []);

  const goLeft = useCallback(() => {
    setFocusedIndex((i) => {
      const next = i <= 0 ? fighters.length - 1 : i - 1;
      if (!skipSound.current) playCharacterBrowseSound("left");
      return next;
    });
  }, []);

  const goRight = useCallback(() => {
    setFocusedIndex((i) => {
      const next = i >= fighters.length - 1 ? 0 : i + 1;
      if (!skipSound.current) playCharacterBrowseSound("right");
      return next;
    });
  }, []);

  useEffect(() => {
    skipSound.current = false;
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goLeft(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goRight(); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goLeft, goRight]);

  const accentColor = team?.primaryColor ?? "#e8b84b";
  const mobileRosterHeight = 152;
  const mobileBottomLift = 52;
  const mobileDockBottom = mobileRosterHeight + mobileBottomLift;
  const mobileHeroBottom = 218 + mobileBottomLift;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100svh",
        overflow: "hidden",
        background: "var(--clr-void)",
      }}
    >
      {/* ── BACKGROUND: animated team-colored spotlight ──────── */}
      <motion.div
        key={`bg-${fighter.teamId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: isMobile
            ? `radial-gradient(ellipse 60% 50% at 50% 45%, ${accentColor}28 0%, transparent 72%)`
            : `radial-gradient(ellipse 55% 65% at 50% 88%, ${accentColor}22 0%, transparent 70%)`,
        }}
      />
      {/* secondary electric ambient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,212,255,0.04) 0%, transparent 65%)",
        }}
      />
      {/* floor line — desktop only; mobile dock provides separation */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: 172,
            left: "8%",
            right: "8%",
            height: 1,
            zIndex: 5,
            background: `linear-gradient(90deg, transparent, ${accentColor}44, ${accentColor}88, ${accentColor}44, transparent)`,
            transition: "background 0.5s",
          }}
        />
      )}

      {/* ── CENTER HERO: the fighter ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          ...(isMobile
            ? {
                bottom: mobileHeroBottom,
                transform: "translateX(-50%)",
              }
            : {
                bottom: 88,
                transform: "translateX(-50%)",
              }),
          left: "50%",
          width: isMobile ? "clamp(280px, 82vw, 420px)" : "clamp(360px, 46vw, 620px)",
          height: isMobile ? "clamp(340px, 58vh, 500px)" : "clamp(480px, 78vh, 820px)",
          zIndex: 3,
          pointerEvents: "none",
          WebkitMaskImage: isMobile
            ? "linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.9) 62%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.2) 86%, transparent 100%)"
            : "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
          maskImage: isMobile
            ? "linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.9) 62%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.2) 86%, transparent 100%)"
            : "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={fighter.id}
            initial={{ y: 36, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: isMobile ? 1.15 : 1.38 }}
            exit={{ y: -16, opacity: 0, scale: isMobile ? 1.05 : 1.1 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            {fighter.fullImage ? (
              <Image
                src={fighter.fullImage}
                alt={fighter.name}
                fill
                sizes="(max-width: 768px) 72vw, 46vw"
                style={{
                  objectFit: "contain",
                  objectPosition: "bottom center",
                }}
                priority
              />
            ) : (
              <FighterSilhouette color={accentColor} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom fade — soft dissolve into info dock / roster */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "-8%",
            right: "-8%",
            height: isMobile ? "42%" : "38%",
            background: isMobile
              ? `linear-gradient(to top, var(--clr-void) 0%, var(--clr-void) 18%, var(--clr-void)e8 38%, var(--clr-void)99 55%, var(--clr-void)55 72%, transparent 100%)`
              : "linear-gradient(to top, var(--clr-void) 0%, var(--clr-void)cc 35%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Blur haze at feet — mobile only */}
        {isMobile && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "-5%",
              right: "-5%",
              height: "28%",
              background: `radial-gradient(ellipse 90% 80% at 50% 100%, ${accentColor}18, transparent 70%)`,
              filter: "blur(14px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* Foot glow */}
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            left: "10%",
            right: "10%",
            height: 48,
            background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${accentColor}55, transparent)`,
            filter: "blur(10px)",
            transition: "background 0.5s",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </div>

      {/* ── GIANT NAME — desktop decorative outline over lower body ── */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: 192,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            zIndex: 4,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <motion.span
            key={fighter.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem, 16vw, 15rem)",
              lineHeight: 0.82,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(232, 184, 75, 0.42)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              userSelect: "none",
              mixBlendMode: "screen",
            }}
          >
            {fighter.shortName}
          </motion.span>
        </div>
      )}

      {/* ── TOP-LEFT: P1 badge ───────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vh, 2rem)",
          left: "clamp(1rem, 3vw, 2.5rem)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
            color: "var(--clr-electric)",
            lineHeight: 1,
            letterSpacing: "0.05em",
            textShadow: "0 0 20px rgba(0,212,255,0.4)",
          }}
        >
          P1
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.45rem",
            letterSpacing: "0.2em",
            color: "var(--clr-text-dim)",
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          BROWSING
        </div>
      </div>

      {/* ── TOP-RIGHT: nation + group badge ─────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vh, 2rem)",
          right: "clamp(1rem, 3vw, 2.5rem)",
          zIndex: 10,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={fighter.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.22 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}
          >
            <span style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", lineHeight: 1 }}>
              {team?.flag ?? "🌐"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                color: "var(--clr-text-secondary)",
                textTransform: "uppercase",
              }}
            >
              {fighter.nationality}
            </span>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.42rem",
                letterSpacing: "0.14em",
                color: "var(--clr-text-dim)",
                border: "1px solid var(--clr-border)",
                padding: "2px 6px",
                textTransform: "uppercase",
              }}
            >
              GROUP {fighter.group}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── RIGHT STATS PANEL (desktop only) ─────────────────── */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "clamp(1.5rem, 3vw, 3rem)",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "clamp(160px, 18vw, 250px)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={fighter.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Name */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1rem, 1.8vw, 1.6rem)",
                    color: "var(--clr-text-primary)",
                    textTransform: "uppercase",
                    lineHeight: 1.05,
                    letterSpacing: "0.02em",
                  }}
                >
                  {fighter.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.45rem",
                    letterSpacing: "0.15em",
                    color: accentColor,
                    marginTop: 4,
                    textTransform: "uppercase",
                    opacity: 0.85,
                  }}
                >
                  {team?.shortName} · WC 2026
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--clr-border)" }} />

              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <StatBar label="PACE" value={fighter.stats.pace} color="var(--clr-electric)" />
                <StatBar label="SHOT" value={fighter.stats.shot} color="var(--clr-gold)" />
                <StatBar label="SKILL" value={fighter.stats.skill} color={accentColor} />
                <StatBar label="DEFEND" value={fighter.stats.defend} color="var(--clr-text-secondary)" />
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--clr-border)" }} />

              {/* Moves */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.42rem",
                    letterSpacing: "0.18em",
                    color: "var(--clr-text-dim)",
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  SIGNATURE MOVES
                </div>
                {fighter.moves.map((move) => (
                  <div
                    key={move.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5rem",
                        color: "var(--clr-text-primary)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {move.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.45rem",
                        color: "var(--clr-text-dim)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {move.input}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── MOBILE INFO DOCK (big name → small name → divider → stats) ── */}
      {isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: mobileDockBottom,
            left: 0,
            right: 0,
            zIndex: 10,
            pointerEvents: "none",
            padding: "0 clamp(0.75rem, 4vw, 1.5rem)",
            background:
              "linear-gradient(to top, var(--clr-void) 0%, var(--clr-void) 45%, var(--clr-void)f2 70%, transparent 100%)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={fighter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "0.5rem 0.75rem 0.75rem",
              }}
            >
              {/* Big outline title */}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.6rem, 15vw, 4.2rem)",
                  lineHeight: 0.85,
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(232, 184, 75, 0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                {fighter.shortName}
              </span>

              {/* Readable full name */}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(0.8rem, 3.8vw, 1rem)",
                  color: "var(--clr-text-primary)",
                  textTransform: "uppercase",
                  lineHeight: 1.1,
                  letterSpacing: "0.06em",
                  textAlign: "center",
                }}
              >
                {fighter.name}
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: 1,
                  marginTop: 2,
                  background: `linear-gradient(90deg, transparent, ${accentColor}55, var(--clr-border), ${accentColor}55, transparent)`,
                }}
              />

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.75rem",
                  width: "100%",
                  paddingTop: 4,
                }}
              >
                <StatBar label="PACE" value={fighter.stats.pace} color="var(--clr-electric)" mobile />
                <StatBar label="SKILL" value={fighter.stats.skill} color={accentColor} mobile />
                <StatBar label="SHOT" value={fighter.stats.shot} color="var(--clr-gold)" mobile />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── BOTTOM ROSTER ────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? mobileBottomLift : 0,
          left: 0,
          right: 0,
          zIndex: 10,
          height: isMobile ? mobileRosterHeight : 172,
          paddingBottom: isMobile ? "env(safe-area-inset-bottom, 0px)" : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(to top, var(--clr-void) 72%, var(--clr-void)ee 88%, transparent)",
        }}
      >
        {/* top fade — hides hero bleed */}
        <div
          style={{
            position: "absolute",
            top: -48,
            left: 0,
            right: 0,
            height: 56,
            background: "linear-gradient(to bottom, transparent, var(--clr-void))",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* roster strip */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <FighterRoster
            fighters={fighters}
            focusedIndex={focusedIndex}
            onFocus={browseTo}
            compact={isMobile}
          />
        </div>

        {/* keyboard hint */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            padding: isMobile ? "6px 0 10px" : "8px 0 14px",
            zIndex: 2,
          }}
        >
          <button
            onClick={goLeft}
            aria-label="Previous fighter"
            style={{
              background: "none",
              border: "1px solid var(--clr-border)",
              color: "var(--clr-text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              padding: "6px 14px",
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            ← PREV
          </button>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              letterSpacing: "0.18em",
              color: "var(--clr-text-dim)",
              textTransform: "uppercase",
            }}
          >
            {focusedIndex + 1} / {fighters.length}
          </span>
          <button
            onClick={goRight}
            aria-label="Next fighter"
            style={{
              background: "none",
              border: "1px solid var(--clr-border)",
              color: "var(--clr-text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              padding: "6px 14px",
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
}
