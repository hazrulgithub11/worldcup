const SONG_SRC = "/audio/history.mp3";

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

export function subscribeHistoryMusic(listener: (playing: boolean) => void): () => void {
  listeners.add(listener);
  listener(audio ? !audio.paused : false);
  return () => {
    listeners.delete(listener);
  };
}

export function startHistoryMusic() {
  if (userPaused || suspended) return;
  const el = getAudio();
  if (!el || !el.paused) return;
  removeInteractionFallback();
  void el.play().catch(() => notify(false));
}

export function requestHistoryMusic() {
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

/** Entering history — always auto-play, even if paused elsewhere */
export function enterHistoryMusic() {
  userPaused = false;
  suspended = false;
  requestHistoryMusic();
}

export function pauseHistoryMusic() {
  userPaused = true;
  removeInteractionFallback();
  audio?.pause();
}

export function resumeHistoryMusic() {
  userPaused = false;
  suspended = false;
  startHistoryMusic();
}

export function toggleHistoryMusic() {
  if (audio && !audio.paused) {
    pauseHistoryMusic();
  } else {
    resumeHistoryMusic();
  }
}

export function stopHistoryMusic() {
  removeInteractionFallback();
  audio?.pause();
  if (audio) audio.currentTime = 0;
}

export function suspendHistoryMusic() {
  suspended = true;
  removeInteractionFallback();
  audio?.pause();
  notify(false);
}

export function resumeSuspendedHistoryMusic() {
  suspended = false;
  if (!userPaused) startHistoryMusic();
}
