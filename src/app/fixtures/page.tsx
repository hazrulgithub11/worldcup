import Link from "next/link";

export default function FixturesPage() {
  return (
    <main
      style={{
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        background: "var(--clr-void)",
      }}
    >
      <header
        style={{
          position: "relative",
          padding: "clamp(2rem, 8vh, 5rem) clamp(1rem, 4vw, 2rem)",
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
        </div>
      </header>
    </main>
  );
}
