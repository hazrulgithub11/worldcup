let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function playNoiseBurst(ctx: AudioContext, start: number, duration: number, volume: number) {
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.6;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(start);
  source.stop(start + duration);
}

/** Arcade-style punch/select SFX for match ticket clicks */
export function playMatchSelectSound(isKO = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  playNoiseBurst(ctx, now, isKO ? 0.12 : 0.08, isKO ? 0.35 : 0.22);

  const thump = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  thump.type = "sine";
  thump.frequency.setValueAtTime(isKO ? 90 : 110, now);
  thump.frequency.exponentialRampToValueAtTime(35, now + 0.1);
  thumpGain.gain.setValueAtTime(isKO ? 0.55 : 0.4, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  thump.connect(thumpGain);
  thumpGain.connect(ctx.destination);
  thump.start(now);
  thump.stop(now + 0.14);

  const hit = ctx.createOscillator();
  const hitGain = ctx.createGain();
  hit.type = "square";
  hit.frequency.setValueAtTime(isKO ? 520 : 740, now + 0.01);
  hit.frequency.exponentialRampToValueAtTime(isKO ? 180 : 260, now + 0.07);
  hitGain.gain.setValueAtTime(0.07, now + 0.01);
  hitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  hit.connect(hitGain);
  hitGain.connect(ctx.destination);
  hit.start(now + 0.01);
  hit.stop(now + 0.09);

  if (isKO) {
    const ring = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ring.type = "triangle";
    ring.frequency.setValueAtTime(880, now + 0.04);
    ring.frequency.exponentialRampToValueAtTime(440, now + 0.2);
    ringGain.gain.setValueAtTime(0.06, now + 0.04);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    ring.connect(ringGain);
    ringGain.connect(ctx.destination);
    ring.start(now + 0.04);
    ring.stop(now + 0.22);
  }
}
