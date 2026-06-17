"use client";

import { useEffect, useRef, useState } from "react";

const SONG_SRC = "/audio/song.mp3";

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(SONG_SRC);
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => setPlaying(false));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
      style={{
        position: "fixed",
        left: "clamp(1rem, 3vw, 1.5rem)",
        bottom: "clamp(1rem, 3vw, 1.5rem)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.55rem",
        padding: "0.55rem 0.85rem",
        border: `1px solid ${playing ? "var(--clr-gold-dim)" : "var(--clr-border)"}`,
        background: playing
          ? "color-mix(in srgb, var(--clr-gold) 12%, var(--clr-pitch))"
          : "color-mix(in srgb, var(--clr-pitch) 88%, transparent)",
        color: playing ? "var(--clr-gold)" : "var(--clr-text-secondary)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.58rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        transition: "border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s",
        boxShadow: playing ? "0 0 18px color-mix(in srgb, var(--clr-gold) 25%, transparent)" : "none",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          width: 18,
          height: 18,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1.5" width="3.2" height="11" rx="0.6" />
            <rect x="8.8" y="1.5" width="3.2" height="11" rx="0.6" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M2.5 4.8v4.4c0 .5.5.8 1 .6l3.1-1.5 2.8 2.4c.4.3 1-.1 1-.6V3.9c0-.5-.6-.9-1-.6L6.6 5.7 3.5 4.2c-.5-.2-1 .1-1 .6Z" />
            <path
              d="M10.8 4.2c.8.6 1.2 1.4 1.2 2.3s-.4 1.7-1.2 2.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span>{playing ? "Pause" : "Audio"}</span>
    </button>
  );
}
