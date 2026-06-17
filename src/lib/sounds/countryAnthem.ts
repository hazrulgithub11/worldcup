/** teamId → audio filename when the file name differs */
const AUDIO_FILE_OVERRIDES: Record<string, string> = {
  colombia: "columbia",
};

const ANTHEM_VOLUME = 1;
const FADE_IN_MS = 700;

let current: HTMLAudioElement | null = null;
let fadeRaf: number | null = null;
let fadeToken = 0;

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume));
}

function cancelFade() {
  fadeToken += 1;
  if (fadeRaf !== null) {
    cancelAnimationFrame(fadeRaf);
    fadeRaf = null;
  }
}

function fadeVolume(el: HTMLAudioElement, from: number, to: number, durationMs: number) {
  cancelFade();
  const token = fadeToken;
  const startFrom = clampVolume(from);
  const startTo = clampVolume(to);
  const duration = Math.max(1, durationMs);
  const start = performance.now();

  const step = (now: number) => {
    if (token !== fadeToken || current !== el) return;

    const t = Math.max(0, Math.min(1, (now - start) / duration));
    const ease = t * (2 - t);
    el.volume = clampVolume(startFrom + (startTo - startFrom) * ease);

    if (t < 1) {
      fadeRaf = requestAnimationFrame(step);
    } else {
      fadeRaf = null;
    }
  };

  fadeRaf = requestAnimationFrame(step);
}

function getCountryAudioSrc(teamId: string) {
  const fileName = AUDIO_FILE_OVERRIDES[teamId] ?? teamId;
  return `/audio/COUNTRY/${fileName}.mp3`;
}

export function playCountryAnthem(teamId: string) {
  if (typeof window === "undefined") return;

  const src = getCountryAudioSrc(teamId);
  if (current) {
    cancelFade();
    current.pause();
    current = null;
  }

  const audio = new Audio(src);
  audio.volume = 0;
  current = audio;
  audio.addEventListener("ended", () => {
    if (current === audio) current = null;
  });
  void audio.play().catch(() => {
    if (current === audio) current = null;
  });
  fadeVolume(audio, 0, ANTHEM_VOLUME, FADE_IN_MS);
}

export function stopCountryAnthem() {
  cancelFade();
  if (!current) return;
  current.pause();
  current.currentTime = 0;
  current = null;
}
