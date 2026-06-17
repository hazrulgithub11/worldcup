const SONG_SRC = "/audio/song.mp3";

let audio: HTMLAudioElement | null = null;
let userPaused = false;
let suspended = false;
const listeners = new Set<(playing: boolean) => void>();
let clearInteractionFallback: (() => void) | null = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio(SONG_SRC);
    audio.loop = true;
    audio.volume = 0.65;
    audio.addEventListener("play", () => notify(true));
    audio.addEventListener("pause", () => notify(false));
  }
  return audio;
}

function notify(playing: boolean) {
  listeners.forEach((fn) => fn(playing));
}

function removeInteractionFallback() {
  clearInteractionFallback?.();
  clearInteractionFallback = null;
}

export function subscribeBackgroundMusic(listener: (playing: boolean) => void): () => void {
  listeners.add(listener);
  listener(audio ? !audio.paused : false);
  return () => {
    listeners.delete(listener);
  };
}

export function startBackgroundMusic() {
  if (userPaused || suspended) return;
  const el = getAudio();
  if (!el || !el.paused) return;
  removeInteractionFallback();
  void el.play().catch(() => notify(false));
}

export function requestBackgroundMusic() {
  if (userPaused || suspended) return;
  const el = getAudio();
  if (!el) return;
  if (!el.paused) return;

  removeInteractionFallback();
  void el.play().catch(() => {
    const onInteraction = () => {
      removeInteractionFallback();
      if (!userPaused && !suspended) void el.play().catch(() => notify(false));
    };
    document.addEventListener("pointerdown", onInteraction, { once: true });
    document.addEventListener("keydown", onInteraction, { once: true });
    clearInteractionFallback = () => {
      document.removeEventListener("pointerdown", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  });
}

export function pauseBackgroundMusic() {
  userPaused = true;
  removeInteractionFallback();
  audio?.pause();
}

export function resumeBackgroundMusic() {
  userPaused = false;
  suspended = false;
  startBackgroundMusic();
}

export function toggleBackgroundMusic() {
  if (audio && !audio.paused) {
    pauseBackgroundMusic();
  } else {
    resumeBackgroundMusic();
  }
}

export function suspendBackgroundMusic() {
  suspended = true;
  removeInteractionFallback();
  audio?.pause();
  notify(false);
}

export function resumeSuspendedBackgroundMusic() {
  suspended = false;
  if (!userPaused) startBackgroundMusic();
}
