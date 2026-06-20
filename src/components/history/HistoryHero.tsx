"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const HISTORY_RUNWAY_VH = 720;

export default function HistoryHero() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scene2006Ref = useRef<HTMLDivElement>(null);
  const sceneStageRef = useRef<HTMLDivElement>(null);
  const messiRef = useRef<HTMLImageElement>(null);
  const year2006Ref = useRef<HTMLHeadingElement>(null);

  const skip = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  useEffect(() => {
    if (skip) return;

    const ctx = gsap.context(() => {
      const st = {
        trigger: runwayRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
      };

      ScrollTrigger.create({
        ...st,
        pin: pinRef.current,
        anticipatePin: 1,
      });

      gsap.set(scene2006Ref.current, { visibility: "hidden" });
      gsap.set(sceneStageRef.current, {
        x: "58vw",
        scale: 0.7,
        transformOrigin: "75% 50%",
      });
      gsap.set(year2006Ref.current, { visibility: "hidden", x: "32vw" });

      const master = gsap.timeline({ scrollTrigger: st });

      // ── Layer 1: messi history zooms until gone ──────────────────
      master
        .to(titleRef.current, {
          scale: 24,
          opacity: 0,
          duration: 0.25,
          ease: "none",
          transformOrigin: "50% 50%",
        })
        .to(hintRef.current, { opacity: 0, y: -10, duration: 0.05, ease: "none" }, 0)

        .to({}, { duration: 0.1 })

        // ── Layer 2: 2006 scene — one continuous camera move ──────
        .set(scene2006Ref.current, { visibility: "visible" })
        .fromTo(
          sceneStageRef.current,
          { x: "58vw", scale: 0.7, transformOrigin: "75% 50%" },
          { x: "-65vw", scale: 2.6, duration: 0.55, ease: "none" }
        )

        // "2006" slides out from behind Messi — right to left
        .set(year2006Ref.current, { visibility: "visible" }, "-=0.48")
        .fromTo(
          year2006Ref.current,
          { x: "32vw" },
          { x: 0, duration: 0.14, ease: "none" },
          "<"
        )

        .to({}, { duration: 0.1 });
    }, runwayRef);

    return () => ctx.revert();
  }, [skip]);

  if (skip) {
    return (
      <section
        className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6"
        style={{ background: "#ffffff" }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.75rem, 9.5vw, 6.5rem)",
            color: "var(--clr-red-hot)",
            textTransform: "lowercase",
          }}
        >
          messi history
        </h1>
        <p
          className="mt-8"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: "clamp(4rem, 18vw, 10rem)",
            color: "var(--clr-red)",
            lineHeight: 1,
          }}
        >
          2006
        </p>
      </section>
    );
  }

  return (
    <div
      ref={runwayRef}
      className="relative"
      style={{ height: `${HISTORY_RUNWAY_VH}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-svh w-full overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        {/* ── Layer 2: 2006 scene ─────────────────────────────── */}
        <div
          ref={scene2006Ref}
          className="invisible absolute inset-0 z-[2] overflow-hidden"
        >
          <div
            ref={sceneStageRef}
            className="absolute inset-0 will-change-transform"
          >
            <img
              ref={messiRef}
              src="/messi2006.png"
              alt="Messi 2006 World Cup"
              className="absolute bottom-0 right-0 z-[2] h-[88vh] w-auto max-w-none object-contain object-bottom"
              draggable={false}
              style={{ transformOrigin: "50% 100%" }}
            />

            <h2
              ref={year2006Ref}
              className="invisible absolute z-[1] select-none whitespace-nowrap will-change-transform"
              style={{
                top: "10vh",
                left: "4vw",
                fontFamily: '"Times New Roman", Times, serif',
                fontWeight: 400,
                fontSize: "clamp(4rem, 16vw, 11rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "var(--clr-red)",
              }}
            >
              2006
            </h2>
          </div>
        </div>

        {/* ── Layer 1: title ──────────────────────────────────── */}
        <div
          ref={titleRef}
          className="absolute inset-0 z-[4] flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <h1
            className="font-display whitespace-nowrap leading-[0.92] tracking-[-0.03em]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem, 9.5vw, 6.5rem)",
              color: "var(--clr-red-hot)",
              textTransform: "lowercase",
            }}
          >
            messi history
          </h1>
        </div>

        <div
          ref={hintRef}
          className="absolute bottom-10 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-micro" style={{ color: "#9a9a9a" }}>
            Scroll
          </span>
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: "#9a9a9a" }}
          />
        </div>
      </div>
    </div>
  );
}
