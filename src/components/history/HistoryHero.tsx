"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
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

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia("(max-width: 639px)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMobile() {
  return window.matchMedia("(max-width: 639px)").matches;
}

export const HISTORY_RUNWAY_VH = 3500;

/** Canvas background */
const CANVAS_COLOR = "#f4efe6";

const CANVAS_DOT_GRAIN =
  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)";

const CANVAS_NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

const canvasSurfaceStyle = {
  backgroundColor: CANVAS_COLOR,
  backgroundImage: CANVAS_DOT_GRAIN,
  backgroundSize: "3px 3px",
} as const;

export const HISTORY_CANVAS_STYLE = canvasSurfaceStyle;

const CARD_NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

function CanvasGrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden
      style={{
        backgroundImage: CANVAS_NOISE_URI,
        backgroundSize: "256px 256px",
        opacity: 0.26,
        mixBlendMode: "multiply",
      }}
    />
  );
}

const CARD_COPY_2006 = [
  "A teenage Lionel Messi gets his first taste of the World Cup.",
  "Bright flashes of talent… but Argentina fall early.",
  "A star is born, but the story is just starting.",
] as const;

const CARD_COPY_2010 = [
  "Now a rising superstar, expectations are heavy.",
  "But the goals don't come. The magic feels quiet.",
  "Doubt begins to follow him on the world stage.",
] as const;

const CARD_COPY_2014 = [
  "He carries Argentina to the final.",
  "One step from glory… then heartbreak.",
  "The golden dream slips away in extra time.",
] as const;

const CARD_COPY_2018 = [
  "Criticism grows louder than ever.",
  "Can he lead? Can he deliver?",
  "Another exit. The weight of a nation feels unbearable.",
] as const;

const CARD_COPY_2022 = [
  "One last run. One final chance.",
  "Through pain, pressure, and destiny… he rises.",
  "At last — a champion. The story is complete.",
] as const;

const LEGACY_BRIDGE_TEXT = "finally, the legacy..";

type SceneLayout = {
  messi: { height: string; endX: string };
  year: { top: string; endX: string; fontSize: string };
  card: { top: string; endX: string; width: string; rotate: number; padding: string };
};

/** Desktop layout */
const LAYOUT_DESKTOP: SceneLayout = {
  messi: { height: "82vh", endX: "18vw" },
  year: { top: "12vh", endX: "6vw", fontSize: "clamp(4rem, 16vw, 11rem)" },
  card: {
    top: "18vh",
    endX: "52vw",
    width: "min(36vw, 420px)",
    rotate: -2.5,
    padding: "1.75rem 2rem",
  },
};

/** Mobile-only layout */
const LAYOUT_MOBILE: SceneLayout = {
  messi: { height: "65vh", endX: "-8vw" },
  year: {
    top: "0",
    endX: "0vw",
    fontSize: "min(clamp(8rem, 34vh, 15rem), calc((100svh - 0.36em) / 4))",
  },
  card: {
    top: "16vh",
    endX: "20vw",
    width: "60vw",
    rotate: -3.5,
    padding: "1.25rem 1.5rem",
  },
};

type ChapterRefs = {
  stage: HTMLDivElement | null;
  scene: HTMLDivElement | null;
  messi: HTMLImageElement | null;
  year: HTMLHeadingElement | null;
  card: HTMLDivElement | null;
};

function prepareChapter(tl: gsap.core.Timeline, refs: ChapterRefs, layout: SceneLayout) {
  tl.set(refs.stage, {
    autoAlpha: 0,
    visibility: "hidden",
    scale: 1,
    x: 0,
    transformOrigin: "100% 50%",
    zIndex: 1,
  })
    .set(refs.scene, { visibility: "hidden" })
    .set([refs.messi, refs.year, refs.card], { x: "105vw" })
    .set(refs.card, {
      visibility: "hidden",
      x: "105vw",
      rotation: layout.card.rotate,
    });
}

function addChapterSlides(
  tl: gsap.core.Timeline,
  refs: ChapterRefs,
  layout: SceneLayout
) {
  tl.set(refs.stage, { autoAlpha: 1, visibility: "visible", zIndex: 3 })
    .set(refs.scene, { visibility: "visible" })
    .to(refs.messi, { x: layout.messi.endX, duration: 0.28, ease: "none" })
    .to(refs.year, { x: layout.year.endX, duration: 0.15, ease: "none" })
    .to({}, { duration: 0.08 })
    .set(refs.card, { visibility: "visible" })
    .to(refs.card, {
      x: layout.card.endX,
      rotation: layout.card.rotate,
      duration: 0.18,
      ease: "none",
    })
    .to({}, { duration: 0.04 });
}

function addChapterExit(tl: gsap.core.Timeline, refs: ChapterRefs) {
  tl.to({}, { duration: 0.1 })
    .set(refs.stage, { transformOrigin: "100% 50%", x: 0 })
    .to(refs.stage, {
      scale: 20,
      x: "28vw",
      autoAlpha: 0,
      duration: 0.22,
      ease: "none",
    })
    .set(refs.scene, { visibility: "hidden" })
    .set(refs.stage, {
      autoAlpha: 0,
      visibility: "hidden",
      scale: 1,
      x: 0,
      transformOrigin: "100% 50%",
      zIndex: 1,
    })
    .to({}, { duration: 0.12 });
}

function addLegacyBridge(tl: gsap.core.Timeline, legacyEl: HTMLParagraphElement | null) {
  tl.set(legacyEl, { autoAlpha: 0, visibility: "visible", zIndex: 4 })
    .to(legacyEl, { autoAlpha: 1, duration: 0.1, ease: "none" })
    .to({}, { duration: 0.16 })
    .to(legacyEl, { autoAlpha: 0, duration: 0.1, ease: "none" })
    .set(legacyEl, { visibility: "hidden", zIndex: 1 });
}

type ChapterSceneProps = {
  stageRef: RefObject<HTMLDivElement | null>;
  sceneRef: RefObject<HTMLDivElement | null>;
  messiRef: RefObject<HTMLImageElement | null>;
  yearRef: RefObject<HTMLHeadingElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  year: string;
  image: string;
  imageAlt: string;
  copy: readonly string[];
  layout: SceneLayout;
  isMobile: boolean;
};

function ChapterScene({
  stageRef,
  sceneRef,
  messiRef,
  yearRef,
  cardRef,
  year,
  image,
  imageAlt,
  copy,
  layout,
  isMobile,
}: ChapterSceneProps) {
  return (
    <div
      ref={stageRef}
      className="pointer-events-none absolute inset-0 z-[1] opacity-0 will-change-transform"
      style={{ visibility: "hidden" }}
    >
      <div ref={sceneRef} className="absolute inset-0">
        <img
          ref={messiRef}
          src={image}
          alt={imageAlt}
          className="absolute bottom-0 left-0 z-[3] w-auto max-w-none object-contain object-bottom will-change-transform"
          style={{
            height: layout.messi.height,
            transform: "translateX(105vw)",
          }}
          draggable={false}
        />

        <h2
          ref={yearRef}
          className={`font-display absolute select-none will-change-transform ${
            isMobile
              ? "inset-0 z-[1] flex flex-col items-start justify-between gap-[0.12em] pt-[0.08em] pb-[0.08em] pl-[0.1em]"
              : "left-0 z-[1] whitespace-nowrap"
          }`}
          style={{
            top: isMobile ? undefined : layout.year.top,
            fontFamily: "var(--font-display)",
            fontSize: layout.year.fontSize,
            lineHeight: isMobile ? 1 : 0.92,
            letterSpacing: isMobile ? "-0.06em" : "-0.03em",
            color: "transparent",
            WebkitTextStroke: isMobile
              ? "clamp(2px, 1.2vw, 6px) var(--clr-red)"
              : "clamp(2px, 0.55vw, 4px) var(--clr-red)",
            paintOrder: "stroke fill",
            transform: "translateX(105vw)",
          }}
          aria-label={year}
        >
          {isMobile
            ? year.split("").map((digit, index) => (
                <span key={`${year}-${index}`} aria-hidden className="block leading-none">
                  {digit}
                </span>
              ))
            : year}
        </h2>

        <div
          ref={cardRef}
          className="invisible absolute left-0 z-[2] will-change-transform"
          style={{
            top: layout.card.top,
            width: layout.card.width,
            transformOrigin: "30% 0%",
            background: "#faf6ef",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.045) 1px, transparent 0)",
            backgroundSize: "3px 3px",
            padding: layout.card.padding,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: CARD_NOISE_URI,
              mixBlendMode: "multiply",
            }}
            aria-hidden
          />
          <div className={`relative ${isMobile ? "space-y-3" : "space-y-4"}`}>
            {copy.map((line) => (
              <p
                key={line}
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  fontSize: isMobile
                    ? "clamp(0.9rem, 3.8vw, 1.05rem)"
                    : "clamp(0.85rem, 1.6vw, 1rem)",
                  lineHeight: 1.65,
                  color: "#2a2420",
                  margin: 0,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function initChapter(refs: ChapterRefs, layout: SceneLayout) {
  gsap.set(refs.stage, {
    autoAlpha: 0,
    visibility: "hidden",
    scale: 1,
    x: 0,
    transformOrigin: "100% 50%",
    zIndex: 1,
  });
  gsap.set(refs.scene, { visibility: "hidden" });
  gsap.set([refs.messi, refs.year, refs.card], { x: "105vw" });
  gsap.set(refs.card, {
    visibility: "hidden",
    x: "105vw",
    rotation: layout.card.rotate,
  });
}

export default function HistoryHero() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const legacyRef = useRef<HTMLParagraphElement>(null);

  const stage2006Ref = useRef<HTMLDivElement>(null);
  const scene2006Ref = useRef<HTMLDivElement>(null);
  const messi2006Ref = useRef<HTMLImageElement>(null);
  const year2006Ref = useRef<HTMLHeadingElement>(null);
  const card2006Ref = useRef<HTMLDivElement>(null);

  const stage2010Ref = useRef<HTMLDivElement>(null);
  const scene2010Ref = useRef<HTMLDivElement>(null);
  const messi2010Ref = useRef<HTMLImageElement>(null);
  const year2010Ref = useRef<HTMLHeadingElement>(null);
  const card2010Ref = useRef<HTMLDivElement>(null);

  const stage2014Ref = useRef<HTMLDivElement>(null);
  const scene2014Ref = useRef<HTMLDivElement>(null);
  const messi2014Ref = useRef<HTMLImageElement>(null);
  const year2014Ref = useRef<HTMLHeadingElement>(null);
  const card2014Ref = useRef<HTMLDivElement>(null);

  const stage2018Ref = useRef<HTMLDivElement>(null);
  const scene2018Ref = useRef<HTMLDivElement>(null);
  const messi2018Ref = useRef<HTMLImageElement>(null);
  const year2018Ref = useRef<HTMLHeadingElement>(null);
  const card2018Ref = useRef<HTMLDivElement>(null);

  const stage2022Ref = useRef<HTMLDivElement>(null);
  const scene2022Ref = useRef<HTMLDivElement>(null);
  const messi2022Ref = useRef<HTMLImageElement>(null);
  const year2022Ref = useRef<HTMLHeadingElement>(null);
  const card2022Ref = useRef<HTMLDivElement>(null);

  const skip = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);

  const layout = isMobile ? LAYOUT_MOBILE : LAYOUT_DESKTOP;

  useEffect(() => {
    if (skip) return;

    const chapter2006: ChapterRefs = {
      stage: stage2006Ref.current,
      scene: scene2006Ref.current,
      messi: messi2006Ref.current,
      year: year2006Ref.current,
      card: card2006Ref.current,
    };

    const chapter2010: ChapterRefs = {
      stage: stage2010Ref.current,
      scene: scene2010Ref.current,
      messi: messi2010Ref.current,
      year: year2010Ref.current,
      card: card2010Ref.current,
    };

    const chapter2014: ChapterRefs = {
      stage: stage2014Ref.current,
      scene: scene2014Ref.current,
      messi: messi2014Ref.current,
      year: year2014Ref.current,
      card: card2014Ref.current,
    };

    const chapter2018: ChapterRefs = {
      stage: stage2018Ref.current,
      scene: scene2018Ref.current,
      messi: messi2018Ref.current,
      year: year2018Ref.current,
      card: card2018Ref.current,
    };

    const chapter2022: ChapterRefs = {
      stage: stage2022Ref.current,
      scene: scene2022Ref.current,
      messi: messi2022Ref.current,
      year: year2022Ref.current,
      card: card2022Ref.current,
    };

    const ctx = gsap.context(() => {
      initChapter(chapter2006, layout);
      initChapter(chapter2010, layout);
      initChapter(chapter2014, layout);
      initChapter(chapter2018, layout);
      initChapter(chapter2022, layout);

      gsap.set(legacyRef.current, { autoAlpha: 0, visibility: "hidden", zIndex: 1 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: runwayRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          pin: pinRef.current,
          anticipatePin: 1,
        },
      });

      master
        .set(titleRef.current, { transformOrigin: "100% 50%", x: 0 })
        .to(titleRef.current, {
          scale: 24,
          x: "28vw",
          opacity: 0,
          duration: 0.25,
          ease: "none",
        })
        .to(hintRef.current, { opacity: 0, y: -10, duration: 0.05, ease: "none" }, 0)
        .to({}, { duration: 0.1 });

      addChapterSlides(master, chapter2006, layout);
      addChapterExit(master, chapter2006);
      prepareChapter(master, chapter2010, layout);
      addChapterSlides(master, chapter2010, layout);
      addChapterExit(master, chapter2010);
      prepareChapter(master, chapter2014, layout);
      addChapterSlides(master, chapter2014, layout);
      addChapterExit(master, chapter2014);
      prepareChapter(master, chapter2018, layout);
      addChapterSlides(master, chapter2018, layout);
      addChapterExit(master, chapter2018);
      addLegacyBridge(master, legacyRef.current);
      prepareChapter(master, chapter2022, layout);
      addChapterSlides(master, chapter2022, layout);
    }, runwayRef);

    return () => ctx.revert();
  }, [skip, isMobile]);

  if (skip) {
    return (
      <section
        className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6"
        style={canvasSurfaceStyle}
      >
        <CanvasGrainOverlay />
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
          className="font-display mt-8"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: layout.year.fontSize,
            color: "transparent",
            WebkitTextStroke: "2px var(--clr-red)",
            paintOrder: "stroke fill",
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
        style={canvasSurfaceStyle}
      >
        <CanvasGrainOverlay />

        <ChapterScene
          stageRef={stage2006Ref}
          sceneRef={scene2006Ref}
          messiRef={messi2006Ref}
          yearRef={year2006Ref}
          cardRef={card2006Ref}
          year="2006"
          image="/messi2006.png"
          imageAlt="Messi 2006 World Cup"
          copy={CARD_COPY_2006}
          layout={layout}
          isMobile={isMobile}
        />

        <ChapterScene
          stageRef={stage2010Ref}
          sceneRef={scene2010Ref}
          messiRef={messi2010Ref}
          yearRef={year2010Ref}
          cardRef={card2010Ref}
          year="2010"
          image="/messi2010.png"
          imageAlt="Messi 2010 World Cup"
          copy={CARD_COPY_2010}
          layout={layout}
          isMobile={isMobile}
        />

        <ChapterScene
          stageRef={stage2014Ref}
          sceneRef={scene2014Ref}
          messiRef={messi2014Ref}
          yearRef={year2014Ref}
          cardRef={card2014Ref}
          year="2014"
          image="/messi2014.png"
          imageAlt="Messi 2014 World Cup"
          copy={CARD_COPY_2014}
          layout={layout}
          isMobile={isMobile}
        />

        <ChapterScene
          stageRef={stage2018Ref}
          sceneRef={scene2018Ref}
          messiRef={messi2018Ref}
          yearRef={year2018Ref}
          cardRef={card2018Ref}
          year="2018"
          image="/messi2018.png"
          imageAlt="Messi 2018 World Cup"
          copy={CARD_COPY_2018}
          layout={layout}
          isMobile={isMobile}
        />

        <ChapterScene
          stageRef={stage2022Ref}
          sceneRef={scene2022Ref}
          messiRef={messi2022Ref}
          yearRef={year2022Ref}
          cardRef={card2022Ref}
          year="2022"
          image="/messi2022.png"
          imageAlt="Messi 2022 World Cup"
          copy={CARD_COPY_2022}
          layout={layout}
          isMobile={isMobile}
        />

        <p
          ref={legacyRef}
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-8 text-center opacity-0 will-change-transform"
          style={{
            visibility: "hidden",
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: isMobile
              ? "clamp(0.85rem, 3.6vw, 1rem)"
              : "clamp(0.95rem, 1.8vw, 1.15rem)",
            fontStyle: "italic",
            letterSpacing: "0.02em",
            color: "var(--clr-red)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {LEGACY_BRIDGE_TEXT}
        </p>

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
