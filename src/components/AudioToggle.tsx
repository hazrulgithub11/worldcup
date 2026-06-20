"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  subscribeBackgroundMusic,
  toggleBackgroundMusic,
} from "@/lib/sounds/backgroundMusic";
import {
  subscribeCharacterMusic,
  toggleCharacterMusic,
} from "@/lib/sounds/characterMusic";
import {
  subscribeHistoryMusic,
  toggleHistoryMusic,
} from "@/lib/sounds/historyMusic";

export default function AudioToggle() {
  const pathname = usePathname();
  const isCharacterSelect = pathname.startsWith("/character-select");
  const isHistory = pathname.startsWith("/history");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (isCharacterSelect) {
      return subscribeCharacterMusic(setPlaying);
    }
    if (isHistory) {
      return subscribeHistoryMusic(setPlaying);
    }
    return subscribeBackgroundMusic(setPlaying);
  }, [isCharacterSelect, isHistory]);

  function toggle() {
    if (isCharacterSelect) {
      toggleCharacterMusic();
    } else if (isHistory) {
      toggleHistoryMusic();
    } else {
      toggleBackgroundMusic();
    }
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
        width: "2.65rem",
        height: "2.65rem",
        padding: 0,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${playing ? "var(--clr-gold-dim)" : "var(--clr-border)"}`,
        background: playing
          ? "color-mix(in srgb, var(--clr-gold) 12%, var(--clr-pitch))"
          : "color-mix(in srgb, var(--clr-pitch) 88%, transparent)",
        color: playing ? "var(--clr-gold)" : "var(--clr-text-secondary)",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        transition: "border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s",
        boxShadow: playing ? "0 0 18px color-mix(in srgb, var(--clr-gold) 25%, transparent)" : "none",
      }}
    >
      {playing ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M3.2 6.4v5.2c0 .5.5.8 1 .6l3.4-1.7 3.1 2.7c.4.3 1-.1 1-.6V4.4c0-.5-.6-.9-1-.6L7.6 6.5 4.2 5c-.5-.2-1 .1-1 .6Z"
            fill="currentColor"
          />
          <path
            d="M12.2 5.8c1 .8 1.6 1.8 1.6 3s-.6 2.2-1.6 3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M14.2 4.2c1.6 1.2 2.6 3 2.6 5.1s-1 3.9-2.6 5.1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M3.2 6.4v5.2c0 .5.5.8 1 .6l3.4-1.7 3.1 2.7c.4.3 1-.1 1-.6V4.4c0-.5-.6-.9-1-.6L7.6 6.5 4.2 5c-.5-.2-1 .1-1 .6Z"
            fill="currentColor"
          />
          <path
            d="M12.5 6.5l4 4M16.5 6.5l-4 4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
