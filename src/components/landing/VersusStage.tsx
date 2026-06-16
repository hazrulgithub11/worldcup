"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Fixture, stageLabel } from "@/data/fixtures";
import { teams } from "@/data/teams";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";

interface Props {
  fixture: Fixture | null;
}

function FighterSilhouette({ side }: { side: "home" | "away" }) {
  const isAway = side === "away";
  return (
    <svg
      viewBox="0 0 200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "100%",
        transform: isAway ? "scaleX(-1)" : "none",
        opacity: 0.25,
      }}
    >
      <ellipse cx="100" cy="60" rx="32" ry="36" fill="currentColor" />
      <path d="M60 100 Q60 80 100 80 Q140 80 140 100 L150 240 L50 240 Z" fill="currentColor" />
      <path d="M60 110 L20 200 Q16 210 24 214 L70 180 Z" fill="currentColor" />
      <path d="M140 110 L180 190 Q184 200 176 204 L130 170 Z" fill="currentColor" />
      <path d="M80 238 L70 340 Q68 355 82 356 L100 240 Z" fill="currentColor" />
      <path d="M120 238 L130 340 Q132 355 118 356 L100 240 Z" fill="currentColor" />
      {!isAway && <ellipse cx="24" cy="212" rx="14" ry="12" fill="currentColor" opacity="0.7" />}
      {isAway && <ellipse cx="176" cy="202" rx="14" ry="12" fill="currentColor" opacity="0.7" />}
    </svg>
  );
}

function HudBar({
  label,
  value,
  color,
  align = "left",
}: {
  label: string;
  value: number;
  color: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{ alignItems: align === "right" ? "flex-end" : "flex-start" }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          color: "var(--clr-text-secondary)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 4,
          background: "var(--clr-border)",
          borderRadius: 2,
          overflow: "hidden",
          width: "min(120px, 30vw)",
          direction: align === "right" ? "rtl" : "ltr",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          style={{ height: "100%", background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  );
}

/* ── Mobile layout ──────────────────────────────────────────────── */
function MobileVersusStage({
  fixture,
  home,
  away,
  isKO,
  isFinal,
  isSF,
}: {
  fixture: Fixture;
  home: ReturnType<typeof Object.values<(typeof import("@/data/teams"))["teams"][string]>>[number];
  away: ReturnType<typeof Object.values<(typeof import("@/data/teams"))["teams"][string]>>[number];
  isKO: boolean;
  isFinal: boolean;
  isSF: boolean;
}) {
  return (
    <motion.section
      key={fixture.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative w-full overflow-hidden"
      style={{ background: "var(--clr-pitch)" }}
    >
      {/* Split color bg */}
      <motion.div
        key={`bg-${fixture.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right,
            color-mix(in srgb, ${home.primaryColor} 30%, var(--clr-pitch)) 0%,
            var(--clr-pitch) 48%,
            var(--clr-pitch) 52%,
            color-mix(in srgb, ${away.primaryColor} 30%, var(--clr-pitch)) 100%
          )`,
        }}
      />

      {/* Stage badge */}
      {isKO && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 flex justify-center pt-4"
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: isFinal ? "var(--clr-red-hot)" : "var(--clr-gold)",
              border: `1px solid ${isFinal ? "var(--clr-red-hot)" : "var(--clr-gold)"}`,
              padding: "0.2em 0.7em",
            }}
          >
            {isFinal ? "⚡ GRAND FINAL ⚡" : isSF ? "★ SEMI-FINAL ★" : stageLabel[fixture.stage]}
          </span>
        </motion.div>
      )}
      {fixture.groupLabel && !isKO && (
        <div
          className="relative z-20 flex justify-center pt-4"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            color: "var(--clr-text-dim)",
          }}
        >
          {fixture.groupLabel}
        </div>
      )}

      {/* Fighter stage + VS overlay */}
      <div className="relative z-10" style={{ height: "clamp(200px, 48vw, 320px)" }}>
        {/* Home fighter */}
        <motion.div
          key={`m-home-${fixture.id}`}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0"
          style={{ width: "46%", color: home.primaryColor }}
        >
          {fixture.homeFighterImage ? (
            <Image
              src={fixture.homeFighterImage}
              alt={home.name}
              fill
              style={{ objectFit: "contain", objectPosition: "bottom center" }}
            />
          ) : (
            <FighterSilhouette side="home" />
          )}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 40,
              background: `radial-gradient(ellipse 80% 100% at 50% 100%, color-mix(in srgb, ${home.primaryColor} 25%, transparent), transparent)`,
            }}
          />
        </motion.div>

        {/* Away fighter */}
        <motion.div
          key={`m-away-${fixture.id}`}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 right-0"
          style={{ width: "46%", color: away.primaryColor }}
        >
          {fixture.awayFighterImage ? (
            <Image
              src={fixture.awayFighterImage}
              alt={away.name}
              fill
              style={{
                objectFit: "contain",
                objectPosition: "bottom center",
                transform: "scaleX(-1)",
              }}
            />
          ) : (
            <FighterSilhouette side="away" />
          )}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 40,
              background: `radial-gradient(ellipse 80% 100% at 50% 100%, color-mix(in srgb, ${away.primaryColor} 25%, transparent), transparent)`,
            }}
          />
        </motion.div>

        {/* VS overlay dead-center */}
        <motion.div
          key={`m-vs-${fixture.id}`}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 15 }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 12vw, 4rem)",
              color: "var(--clr-gold)",
              lineHeight: 1,
              textShadow: "0 0 20px rgba(232,184,75,0.5), 0 2px 0 rgba(0,0,0,0.8)",
            }}
          >
            VS
          </span>
        </motion.div>
      </div>

      {/* Team names row */}
      <motion.div
        key={`m-names-${fixture.id}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="relative z-10 flex items-center justify-between"
        style={{ padding: "0.75rem 1rem 0" }}
      >
        {/* Home */}
        <div className="flex flex-col items-start gap-1">
          <span style={{ fontSize: "1.2rem" }}>{home.flag}</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 5vw, 1.6rem)",
              color: "var(--clr-text-primary)",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {home.shortName}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              color: "var(--clr-text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            1P
          </span>
        </div>

        {/* Center metadata */}
        <div className="flex flex-col items-center gap-0.5" style={{ flex: 1, padding: "0 0.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.7rem, 3vw, 1rem)",
              color: "var(--clr-gold)",
              letterSpacing: "0.06em",
            }}
          >
            {fixture.time}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              color: "var(--clr-text-secondary)",
              letterSpacing: "0.08em",
              textAlign: "center",
            }}
          >
            {fixture.date.replace(", 2026", "")}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.42rem",
              color: "var(--clr-text-dim)",
              letterSpacing: "0.1em",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {fixture.city}
          </span>
          <span
            style={{
              marginTop: "0.25rem",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.9rem, 4vw, 1.5rem)",
              color: isKO ? "var(--clr-red-hot)" : "var(--clr-electric)",
              textShadow: "0 0 8px currentColor",
            }}
          >
            {isKO ? "⚡" : "∞"}
          </span>
        </div>

        {/* Away */}
        <div className="flex flex-col items-end gap-1">
          <span style={{ fontSize: "1.2rem" }}>{away.flag}</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 5vw, 1.6rem)",
              color: "var(--clr-text-primary)",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {away.shortName}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              color: "var(--clr-text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            2P
          </span>
        </div>
      </motion.div>

      {/* HUD bars row */}
      <motion.div
        key={`m-hud-${fixture.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex items-center justify-between"
        style={{ padding: "0.75rem 1rem 1.5rem" }}
      >
        <HudBar label="ATK" value={72 + Math.floor(Math.random() * 20)} color={home.primaryColor} />
        <HudBar label="ATK" value={72 + Math.floor(Math.random() * 20)} color={away.primaryColor} align="right" />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, var(--clr-void))" }}
      />
    </motion.section>
  );
}

/* ── Desktop layout ─────────────────────────────────────────────── */
function DesktopVersusStage({
  fixture,
  home,
  away,
  isKO,
  isFinal,
  isSF,
}: {
  fixture: Fixture;
  home: (typeof import("@/data/teams"))["teams"][string];
  away: (typeof import("@/data/teams"))["teams"][string];
  isKO: boolean;
  isFinal: boolean;
  isSF: boolean;
}) {
  return (
    <motion.section
      key={fixture.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "80vh", background: "var(--clr-pitch)" }}
    >
      {/* Backdrop */}
      <motion.div
        key={`bg-${fixture.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right,
            color-mix(in srgb, ${home.primaryColor} 25%, var(--clr-pitch)) 0%,
            var(--clr-pitch) 40%,
            var(--clr-pitch) 60%,
            color-mix(in srgb, ${away.primaryColor} 25%, var(--clr-pitch)) 100%
          )`,
        }}
      />

      {/* Stage stamp */}
      {isKO && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.6rem, 1.2vw, 0.9rem)",
              letterSpacing: "0.3em",
              color: isFinal ? "var(--clr-red-hot)" : "var(--clr-gold)",
              border: `1px solid ${isFinal ? "var(--clr-red-hot)" : "var(--clr-gold)"}`,
              padding: "0.25em 0.8em",
              display: "block",
            }}
          >
            {isFinal ? "⚡ GRAND FINAL ⚡" : isSF ? "★ SEMI-FINAL ★" : stageLabel[fixture.stage]}
          </span>
        </motion.div>
      )}

      {fixture.groupLabel && (
        <div className="absolute top-6 left-6 z-20 text-fine" style={{ color: "var(--clr-text-dim)" }}>
          {fixture.groupLabel}
        </div>
      )}

      {/* 3-col layout */}
      <div className="relative z-10 flex items-stretch" style={{ minHeight: "80vh" }}>
        {/* Home */}
        <motion.div
          key={`home-${fixture.id}`}
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col items-start justify-end relative overflow-hidden"
          style={{ minWidth: 0, paddingBottom: "3rem", paddingLeft: "clamp(1rem, 4vw, 4rem)" }}
        >
          <div className="absolute inset-0 flex items-end" style={{ justifyContent: "flex-start" }}>
            <div
              style={{
                width: "clamp(180px, 38vw, 420px)",
                height: "clamp(260px, 60vh, 600px)",
                position: "relative",
                color: home.primaryColor,
              }}
            >
              {fixture.homeFighterImage ? (
                <Image src={fixture.homeFighterImage} alt={home.name} fill style={{ objectFit: "contain", objectPosition: "bottom" }} />
              ) : (
                <FighterSilhouette side="home" />
              )}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: 60,
                  background: `radial-gradient(ellipse 80% 100% at 50% 100%, color-mix(in srgb, ${home.primaryColor} 30%, transparent), transparent)`,
                }}
              />
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 10 }}>
            <motion.div
              key={`home-name-${fixture.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-micro)", letterSpacing: "0.2em", color: "var(--clr-text-secondary)", display: "block", marginBottom: "0.25rem" }}>
                1P
              </span>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>{home.flag}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 3.5rem)", color: "var(--clr-text-primary)", textTransform: "uppercase", lineHeight: 1 }}>
                  {home.name}
                </span>
              </div>
              <span style={{ display: "inline-block", marginTop: "0.5rem", fontFamily: "var(--font-display)", fontSize: "var(--size-fine)", letterSpacing: "0.1em", color: home.primaryColor, border: `1px solid ${home.primaryColor}`, padding: "0.1em 0.5em" }}>
                {home.shortName}
              </span>
            </motion.div>
            <motion.div key={`home-hud-${fixture.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col gap-2 mt-4">
              <HudBar label="Attack" value={72 + Math.floor(Math.random() * 20)} color={home.primaryColor} />
              <HudBar label="Form" value={60 + Math.floor(Math.random() * 35)} color={home.primaryColor} />
            </motion.div>
          </div>
        </motion.div>

        {/* Center */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: "clamp(140px, 20vw, 260px)", flexShrink: 0, zIndex: 20, gap: "clamp(0.5rem, 2vw, 1.5rem)" }}
        >
          <motion.div key={`vs-${fixture.id}`} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 8vw, 7rem)", color: "var(--clr-gold)", display: "block", textAlign: "center", lineHeight: 1, textShadow: "0 0 30px color-mix(in srgb, var(--clr-gold) 60%, transparent)" }}>
              VS
            </span>
          </motion.div>

          <motion.div key={`meta-${fixture.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="flex flex-col items-center gap-2 text-center">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(0.75rem, 1.8vw, 1.2rem)", color: "var(--clr-gold)", letterSpacing: "0.08em" }}>{fixture.time}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-fine)", color: "var(--clr-text-secondary)", letterSpacing: "0.1em" }}>{fixture.date}</span>
            <div style={{ width: 1, height: 24, background: "var(--clr-border)", margin: "0.25rem 0" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-micro)", color: "var(--clr-text-dim)", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.4 }}>
              {fixture.venue}<br />{fixture.city}
            </span>
          </motion.div>

          <motion.div key={`inf-${fixture.id}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 3vw, 2.5rem)", color: isKO ? "var(--clr-red-hot)" : "var(--clr-electric)", textShadow: "0 0 12px currentColor" }}>
            {isKO ? "⚡" : "∞"}
          </motion.div>
        </div>

        {/* Away */}
        <motion.div
          key={`away-${fixture.id}`}
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col items-end justify-end relative overflow-hidden"
          style={{ minWidth: 0, paddingBottom: "3rem", paddingRight: "clamp(1rem, 4vw, 4rem)" }}
        >
          <div className="absolute inset-0 flex items-end" style={{ justifyContent: "flex-end" }}>
            <div style={{ width: "clamp(180px, 38vw, 420px)", height: "clamp(260px, 60vh, 600px)", position: "relative", color: away.primaryColor }}>
              {fixture.awayFighterImage ? (
                <Image src={fixture.awayFighterImage} alt={away.name} fill style={{ objectFit: "contain", objectPosition: "bottom", transform: "scaleX(-1)" }} />
              ) : (
                <FighterSilhouette side="away" />
              )}
              <div className="absolute bottom-0 left-0 right-0" style={{ height: 60, background: `radial-gradient(ellipse 80% 100% at 50% 100%, color-mix(in srgb, ${away.primaryColor} 30%, transparent), transparent)` }} />
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 10, textAlign: "right" }}>
            <motion.div key={`away-name-${fixture.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-micro)", letterSpacing: "0.2em", color: "var(--clr-text-secondary)", display: "block", marginBottom: "0.25rem" }}>2P</span>
              <div className="flex items-center justify-end gap-3">
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 3.5rem)", color: "var(--clr-text-primary)", textTransform: "uppercase", lineHeight: 1 }}>{away.name}</span>
                <span style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>{away.flag}</span>
              </div>
              <span style={{ display: "inline-block", marginTop: "0.5rem", fontFamily: "var(--font-display)", fontSize: "var(--size-fine)", letterSpacing: "0.1em", color: away.primaryColor, border: `1px solid ${away.primaryColor}`, padding: "0.1em 0.5em" }}>
                {away.shortName}
              </span>
            </motion.div>
            <motion.div key={`away-hud-${fixture.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-end gap-2 mt-4">
              <HudBar label="Attack" value={72 + Math.floor(Math.random() * 20)} color={away.primaryColor} align="right" />
              <HudBar label="Form" value={60 + Math.floor(Math.random() * 35)} color={away.primaryColor} align="right" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent, var(--clr-void))" }} />
    </motion.section>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export default function VersusStage({ fixture }: Props) {
  const isMobile = useIsMobile(640);

  if (!fixture) {
    return (
      <section
        className="relative w-full flex items-center justify-center"
        style={{
          minHeight: isMobile ? "40vh" : "60vh",
          background: "var(--clr-pitch)",
          borderTop: "1px solid var(--clr-border)",
          borderBottom: "1px solid var(--clr-border)",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-fine"
          style={{ color: "var(--clr-text-dim)", letterSpacing: "0.3em" }}
        >
          SELECT A MATCH BELOW
        </motion.p>
      </section>
    );
  }

  const home = teams[fixture.homeTeamId];
  const away = teams[fixture.awayTeamId];
  if (!home || !away) return null;

  const isFinal = fixture.stage === "final";
  const isSF = fixture.stage === "semi-final";
  const isKO = fixture.stage !== "group";

  const sharedProps = { fixture, home, away, isKO, isFinal, isSF };

  return (
    <AnimatePresence mode="wait">
      {isMobile ? (
        <MobileVersusStage key={`mob-${fixture.id}`} {...sharedProps} />
      ) : (
        <DesktopVersusStage key={`desk-${fixture.id}`} {...sharedProps} />
      )}
    </AnimatePresence>
  );
}
