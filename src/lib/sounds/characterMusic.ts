const SONG_SRC = "/audio/character.mp3";

const NORMAL_VOLUME = 0.65;
const BLEND_VOLUME = 0.22;
const BLEND_DURATION_MS = 700;

let audio: HTMLAudioElement | null = null;
let userPaused = false;
let suspended = false;
let blendRaf: number | null = null;
let blendToken = 0;
const listeners = new Set<(playing: boolean) => void>();
let clearInteractionFallback: (() => void) | null = null;

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume));
}

function cancelBlendTween() {
  blendToken += 1;
  if (blendRaf !== null) {
    cancelAnimationFrame(blendRaf);
    blendRaf = null;
  }
}

function resetCharacterAudioMix(el: HTMLAudioElement) {
  el.volume = NORMAL_VOLUME;
}

function tweenCharacterVolume(
  el: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
  onComplete?: () => void
) {
  cancelBlendTween();
  const token = blendToken;
  const startFrom = clampVolume(from);
  const startTo = clampVolume(to);
  const duration = Math.max(1, durationMs);
  const start = performance.now();

  const step = (now: number) => {
    if (token !== blendToken || audio !== el) return;

    const t = Math.max(0, Math.min(1, (now - start) / duration));
    const ease = t * (2 - t);
    el.volume = clampVolume(startFrom + (startTo - startFrom) * ease);

    if (t < 1) {
      blendRaf = requestAnimationFrame(step);
    } else {
      blendRaf = null;
      onComplete?.();
    }
  };

  blendRaf = requestAnimationFrame(step);
}

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

export function subscribeCharacterMusic(listener: (playing: boolean) => void): () => void {
  listeners.add(listener);
  listener(audio ? !audio.paused : false);
  return () => {
    listeners.delete(listener);
  };
}

export function startCharacterMusic() {
  if (userPaused || suspended) return;
  const el = getAudio();
  if (!el || !el.paused) return;
  removeInteractionFallback();
  void el.play().catch(() => notify(false));
}

export function requestCharacterMusic() {
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

/** Entering character select — always auto-play, even if paused on home or last visit */
export function enterCharacterSelectMusic() {
  userPaused = false;
  suspended = false;
  cancelBlendTween();
  const el = getAudio();
  if (el) resetCharacterAudioMix(el);
  requestCharacterMusic();
}

export function pauseCharacterMusic() {
  userPaused = true;
  removeInteractionFallback();
  audio?.pause();
}

export function resumeCharacterMusic() {
  userPaused = false;
  suspended = false;
  startCharacterMusic();
}

export function toggleCharacterMusic() {
  if (audio && !audio.paused) {
    pauseCharacterMusic();
  } else {
    resumeCharacterMusic();
  }
}

export function stopCharacterMusic() {
  cancelBlendTween();
  removeInteractionFallback();
  audio?.pause();
  if (audio) {
    audio.currentTime = 0;
    resetCharacterAudioMix(audio);
  }
}

/** Duck character music volume so a country anthem can blend on top */
export function blendCharacterMusicForAnthem() {
  if (userPaused) return;
  const el = getAudio();
  if (!el) return;

  suspended = false;
  removeInteractionFallback();

  if (el.paused) {
    void el.play().catch(() => notify(false));
  }

  tweenCharacterVolume(el, clampVolume(el.volume), BLEND_VOLUME, BLEND_DURATION_MS);
}

/** Restore normal character music after anthem overlay */
export function restoreCharacterMusicFromBlend() {
  const el = getAudio();
  if (!el) return;

  tweenCharacterVolume(
    el,
    clampVolume(el.volume),
    NORMAL_VOLUME,
    BLEND_DURATION_MS,
    () => {
      if (!userPaused && !suspended && !el.paused) notify(true);
    }
  );
}

export function suspendCharacterMusic() {
  suspended = true;
  removeInteractionFallback();
  audio?.pause();
  notify(false);
}

export function resumeSuspendedCharacterMusic() {
  suspended = false;
  if (!userPaused) startCharacterMusic();
}
