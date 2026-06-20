"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { countryLogos } from "@/data/countryLogos";

const LOOP = [...countryLogos, ...countryLogos];
const SECONDS_PER_LOGO = 3.8;

interface NationBeltProps {
  /** Fills the portal pin layer instead of owning a full page section */
  embedded?: boolean;
}

export default function NationBelt({ embedded = false }: NationBeltProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const syncFocus = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { left, width } = viewport.getBoundingClientRect();
    const centerX = left + width / 2;
    const falloff = width * 0.38;

    let closest = 0;
    let closestDist = Infinity;

    slotRefs.current.forEach((slot, i) => {
      if (!slot) return;
      const rect = slot.getBoundingClientRect();
      const slotCenter = rect.left + rect.width / 2;
      const dist = Math.abs(slotCenter - centerX);

      if (dist < closestDist) {
        closestDist = dist;
        closest = i % countryLogos.length;
      }

      const t = Math.min(dist / falloff, 1);
      const scale = 1 - t * 0.38;
      const opacity = 1 - t * 0.72;
      const y = LOOP[i].yOffset * (1 - t * 0.4);

      slot.style.transform = `translateY(${y}px) scale(${scale})`;
      slot.style.opacity = String(opacity);
      slot.style.filter = t < 0.15 ? "brightness(1.08)" : `brightness(${1 - t * 0.35})`;
    });

    if (closest !== activeRef.current) {
      activeRef.current = closest;
      setActiveIndex(closest);
    }
  }, []);

  useEffect(() => {
    if (reduced) return;

    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const halfWidth = track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: -halfWidth,
      duration: countryLogos.length * SECONDS_PER_LOGO,
      ease: "none",
      repeat: -1,
      onUpdate: syncFocus,
    });

    syncFocus();

    const observer = new IntersectionObserver(
      ([entry]) => {
        tweenRef.current?.paused(!entry.isIntersecting);
      },
      { threshold: 0.08 }
    );
    observer.observe(section);

    return () => {
      tweenRef.current?.kill();
      observer.disconnect();
    };
  }, [reduced, syncFocus]);

  useEffect(() => {
    if (!reduced) return;
    const mid = Math.floor(countryLogos.length / 2);
    activeRef.current = mid;
    setActiveIndex(mid);
  }, [reduced]);

  const active = countryLogos[activeIndex];

  return (
    <section
      ref={sectionRef}
      className={`relative flex w-full flex-col overflow-hidden ${embedded ? "h-full" : "z-[8] min-h-svh"}`}
      style={{ background: "var(--clr-void)" }}
      aria-label="Nation roster"
    >
      {/* Top seam from portal handoff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
        style={{
          height: "clamp(4rem, 14vh, 8rem)",
          background:
            "linear-gradient(to bottom, var(--clr-pitch) 0%, transparent 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, transparent 6%, var(--clr-red-hot) 50%, transparent 94%)",
          opacity: 0.45,
          boxShadow: "0 0 24px rgba(255, 51, 51, 0.35)",
        }}
      />

      <div
        className="absolute left-5 top-6 z-30 sm:left-9 sm:top-10"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span
          className="text-micro block"
          style={{ color: "var(--clr-text-dim)", letterSpacing: "0.2em" }}
        >
          SCENE 03
        </span>
        <span
          className="text-micro mt-0.5 block"
          style={{ color: "var(--clr-text-dim)", letterSpacing: "0.2em" }}
        >
          SELECT YOUR NATION
        </span>
      </div>

      <div
        className="absolute right-5 top-6 z-30 text-right sm:right-9 sm:top-10"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span
          className="text-micro block"
          style={{ color: "var(--clr-text-dim)", letterSpacing: "0.2em" }}
        >
          {String(countryLogos.length).padStart(2, "0")} NATIONS
        </span>
        <span
          className="text-micro mt-0.5 block"
          style={{ color: "var(--clr-gold-dim)", letterSpacing: "0.2em" }}
        >
          ROSTER LIVE
        </span>
      </div>

      {/* Monumental flicker title — behind the belt */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <div
          className="relative flex w-full items-center justify-center"
          style={{
            marginTop: "clamp(-2rem, -4vh, 0rem)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={active.id}
              className="nation-belt-flicker text-monumental text-stroke-gold block select-none text-center"
              style={{
                fontSize: "clamp(4rem, 22vw, 14rem)",
                lineHeight: 0.82,
                whiteSpace: "nowrap",
                maxWidth: "120vw",
              }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={reduced ? { opacity: 0.55, y: 0 } : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={reduced ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {active.name}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Center flare */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(70vw, 680px)",
          height: "min(38vw, 360px)",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(232,184,75,0.04) 42%, transparent 72%)",
        }}
      />

      {/* Scrolling crest belt */}
      <div
        ref={viewportRef}
        className="relative z-[3] flex flex-1 items-center justify-center"
        style={{
          maskImage: reduced
            ? undefined
            : "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: reduced
            ? undefined
            : "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex items-center will-change-transform"
          style={{
            gap: "clamp(2.5rem, 7vw, 5.5rem)",
            paddingLeft: reduced ? 0 : "clamp(3rem, 12vw, 8rem)",
            paddingRight: reduced ? 0 : "clamp(3rem, 12vw, 8rem)",
          }}
        >
          {(reduced ? countryLogos : LOOP).map((country, i) => (
            <div
              key={`${country.id}-${i}`}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className="flex shrink-0 items-center justify-center"
              style={{
                width: "clamp(6.5rem, 15vw, 10.5rem)",
                height: "clamp(9rem, 22vh, 14rem)",
                transformOrigin: "center center",
                transition: reduced ? undefined : "filter 0.15s ease",
              }}
            >
              <img
                src={country.logo}
                alt=""
                draggable={false}
                className="h-full w-full object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute inset-x-0 z-20 flex justify-center text-center"
        style={{ bottom: "clamp(3rem, 10vh, 5.5rem)" }}
      >
        <Link
          href="/character-select"
          className="text-micro"
          style={{
            color: "var(--clr-gold)",
            letterSpacing: "0.28em",
            textDecoration: "none",
          }}
        >
          ENTER ROSTER →
        </Link>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32"
        style={{
          background: "linear-gradient(to top, var(--clr-void), transparent)",
        }}
      />
    </section>
  );
}
