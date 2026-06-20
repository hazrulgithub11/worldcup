"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NationBelt from "@/components/landing/NationBelt";

gsap.registerPlugin(ScrollTrigger);

/** Scroll distance for the portal hole animation */
export const STAGE_RUNWAY_VH = 800;

const RUNWAY_TOTAL_VH = STAGE_RUNWAY_VH;

/** Hole center — aligned to the red frame in stage-web.png */
const HOLE_CENTER = { cx: 0.5, cy: 0.44 };

/** Tiny peephole at scroll start, expands to full bleed */
const HOLE_START_SIZE = { w: 0.042, h: 0.022 };

const HOLE_START = {
  x: HOLE_CENTER.cx - HOLE_START_SIZE.w / 2,
  y: HOLE_CENTER.cy - HOLE_START_SIZE.h / 2,
  width: HOLE_START_SIZE.w,
  height: HOLE_START_SIZE.h,
};

const HOLE_END = { x: -1, y: -1, width: 3, height: 3 };

/** Soft feather on the mask cutout (objectBoundingBox units) */
const HOLE_EDGE_BLUR = 0.006;

export default function StagePortal() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageLayerRef = useRef<HTMLDivElement>(null);
  const holeRef = useRef<SVGRectElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const maskId = `stage-mask-${uid}`;
  const holeBlurId = `stage-hole-blur-${uid}`;
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    setSkip(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (skip) return;

    const ctx = gsap.context(() => {
      const portalSt = {
        trigger: runwayRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      };

      ScrollTrigger.create({
        ...portalSt,
        pin: stageLayerRef.current,
        pinSpacing: false,
        anticipatePin: 1,
      });

      gsap.fromTo(
        holeRef.current,
        { attr: HOLE_START },
        { attr: HOLE_END, ease: "none", scrollTrigger: portalSt }
      );

      gsap.fromTo(
        overlayRef.current,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            ...portalSt,
            start: "70% top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }
      );
    }, runwayRef);

    return () => ctx.revert();
  }, [skip]);

  if (skip) return <NationBelt />;

  return (
    <div
      ref={runwayRef}
      className="relative z-10"
      style={{ height: `${RUNWAY_TOTAL_VH}vh` }}
    >
      {/* Scene 2 + 3 — normal flow, then pin for portal scroll */}
      <div
        ref={stageLayerRef}
        className="relative z-[10] h-svh w-full overflow-hidden"
      >
        {/* Scene 3 — nation belt visible through the portal hole */}
        <div className="absolute inset-0 z-[5] h-full w-full overflow-hidden">
          <NationBelt embedded />
        </div>

        {/* Scene 2 — portal frame */}
        <div className="pointer-events-none absolute inset-0 z-[10] h-full w-full overflow-hidden">
          <svg
            className="pointer-events-none absolute h-0 w-0"
            aria-hidden
            focusable="false"
          >
            <defs>
              <filter id={holeBlurId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation={HOLE_EDGE_BLUR} />
              </filter>
              <mask
                id={maskId}
                maskUnits="objectBoundingBox"
                maskContentUnits="objectBoundingBox"
              >
                <rect width="1" height="1" fill="white" />
                <rect
                  ref={holeRef}
                  fill="black"
                  filter={`url(#${holeBlurId})`}
                  {...HOLE_START}
                />
              </mask>
            </defs>
          </svg>

          <div
            ref={overlayRef}
            className="absolute inset-0"
            style={{
              mask: `url(#${maskId})`,
              WebkitMask: `url(#${maskId})`,
            }}
          >
            <img
              src="/stage-mobile.png"
              alt=""
              className="h-full w-full object-cover object-center sm:hidden"
              draggable={false}
            />
            <img
              src="/stage-web.png"
              alt=""
              className="hidden h-full w-full object-cover object-[center_36%] sm:block"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
