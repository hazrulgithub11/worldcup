"use client";

import { useState, useMemo } from "react";
import ArenaHero from "@/components/landing/ArenaHero";
import MatchdaySelector from "@/components/landing/MatchdaySelector";
import VersusStage from "@/components/landing/VersusStage";
import ScheduleField from "@/components/landing/ScheduleField";
import { fixtures as allFixtures, Fixture } from "@/data/fixtures";

export default function HomePage() {
  const [activeMatchday, setActiveMatchday] = useState(1);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const filteredFixtures = useMemo(
    () => allFixtures.filter((f) => f.matchday === activeMatchday),
    [activeMatchday]
  );

  function handleMatchdayChange(id: number) {
    setActiveMatchday(id);
    setSelectedFixture(null);
  }

  function handleFixtureSelect(fixture: Fixture) {
    setSelectedFixture((prev) => (prev?.id === fixture.id ? null : fixture));
  }

  return (
    <main
      style={{
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        background: "var(--clr-void)",
      }}
    >
      {/* ── Scene 1: Arena Hero ── */}
      <ArenaHero />

      {/* ── Scene 2: Matchday Selector + Schedule ── */}
      <div
        style={{
          position: "relative",
          background: "var(--clr-void)",
        }}
      >
        <MatchdaySelector active={activeMatchday} onChange={handleMatchdayChange} />

        {/* ── Scene 3: Versus Stage (signature interaction) ── */}
        <VersusStage fixture={selectedFixture} />

        {/* ── Scene 4: Schedule Field (fight tickets) ── */}
        <ScheduleField
          fixtures={filteredFixtures}
          activeId={selectedFixture?.id ?? null}
          onSelect={handleFixtureSelect}
        />
      </div>

      {/* ── Scene 5: Footer strip — intentionally quiet ── */}
      <footer
        style={{
          borderTop: "1px solid var(--clr-border)",
          padding: "2rem clamp(1rem, 4vw, 2rem)",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="flex flex-col gap-1">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.8rem, 1.5vw, 1.1rem)",
              color: "var(--clr-gold)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            World Cup 2026
          </span>
          <span
            className="text-micro"
            style={{ color: "var(--clr-text-dim)" }}
          >
            USA · CANADA · MEXICO
          </span>
        </div>

        <div
          className="flex items-center gap-6"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-micro)",
            color: "var(--clr-text-dim)",
            letterSpacing: "0.15em",
          }}
        >
          <span>FAN USE ONLY</span>
          <span>·</span>
          <span>NOT AFFILIATED WITH FIFA</span>
          <span>·</span>
          <span>ALL TIMES LOCAL</span>
        </div>
      </footer>
    </main>
  );
}
