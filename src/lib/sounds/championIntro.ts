let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Percussive tick for WHO / IS / YOUR — index 0..2, gets slightly higher each time */
export function playChampionWordTick(index: number) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const baseFreqs = [140, 180, 220];
  const freq = baseFreqs[index] ?? 180;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 2.6, now);
  osc.frequency.exponentialRampToValueAtTime(freq, now + 0.045);
  gain.gain.setValueAtTime(0.11, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

/** Deep sub-bass thud for CHAMPION impact */
function playSubBoom(ctx: AudioContext, t: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(68, t);
  osc.frequency.exponentialRampToValueAtTime(22, t + 0.42);
  gain.gain.setValueAtTime(0.7, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.56);
}

/** White-noise static burst for CHAMPION impact */
function playStaticBurst(ctx: AudioContext, t: number, vol = 0.38) {
  const bufSize = Math.floor(ctx.sampleRate * 0.15);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize) * 0.9;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 950;
  filter.Q.value = 0.45;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(t);
  src.stop(t + 0.16);
}

/** High-pitched square sting on CHAMPION impact */
function playHighSting(ctx: AudioContext, t: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(270, t + 0.08);
  gain.gain.setValueAtTime(0.035, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

/** Full CHAMPION slam — sub + static + sting */
export function playChampionBoom() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  playSubBoom(ctx, now);
  playStaticBurst(ctx, now + 0.01);
  playHighSting(ctx, now + 0.03);
}

/** Rising whoosh + noise swell for the zoom-out exit */
export function playChampionExitSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Rising tone
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(55, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.045, now + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.42);

  // High-end noise swell
  playStaticBurst(ctx, now + 0.02, 0.18);
}
