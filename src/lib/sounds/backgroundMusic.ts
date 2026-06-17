const SONG_SRC = "/audio/song.mp3";

let audio: HTMLAudioElement | null = null;
let userPaused = false;
const listeners = new Set<(playing: boolean) => void>();

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

export function subscribeBackgroundMusic(listener: (playing: boolean) => void): () => void {
  listeners.add(listener);
  listener(audio ? !audio.paused : false);
  return () => {
    listeners.delete(listener);
  };
}

export function startBackgroundMusic() {
  if (userPaused) return;
  const el = getAudio();
  if (!el) return;
  void el.play().catch(() => notify(false));
}

export function requestBackgroundMusic() {
  if (userPaused) return;
  const el = getAudio();
  if (!el) return;

  void el.play().catch(() => {
    const onInteraction = () => {
      if (!userPaused) void el.play().catch(() => notify(false));
    };
    document.addEventListener("pointerdown", onInteraction, { once: true });
    document.addEventListener("keydown", onInteraction, { once: true });
  });
}

export function pauseBackgroundMusic() {
  userPaused = true;
  audio?.pause();
}

export function resumeBackgroundMusic() {
  userPaused = false;
  startBackgroundMusic();
}

export function toggleBackgroundMusic() {
  if (audio && !audio.paused) {
    pauseBackgroundMusic();
  } else {
    resumeBackgroundMusic();
  }
}

export function disposeBackgroundMusic() {
  audio?.pause();
  audio = null;
  listeners.clear();
}
