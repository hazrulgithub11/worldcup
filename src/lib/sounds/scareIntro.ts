let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Deep sub-bass thud — the initial "slam" */
function playSubBoom(ctx: AudioContext, start: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(65, start);
  osc.frequency.exponentialRampToValueAtTime(22, start + 0.45);
  gain.gain.setValueAtTime(0.7, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.6);
}

/** White-noise static burst — corrupted signal */
function playStaticBurst(ctx: AudioContext, start: number) {
  const bufferSize = Math.floor(ctx.sampleRate * 0.18);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.9;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(start);
  source.stop(start + 0.2);
}

/** High-pitched sting — signal found */
function playHighSting(ctx: AudioContext, start: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(920, start);
  osc.frequency.exponentialRampToValueAtTime(280, start + 0.09);
  gain.gain.setValueAtTime(0.04, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.1);
}

/** Low hum that slowly builds under the portrait hold */
function playThreatHum(ctx: AudioContext, start: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(38, start);
  gain.gain.setValueAtTime(0.0, start);
  gain.gain.linearRampToValueAtTime(0.06, start + 0.6);
  gain.gain.linearRampToValueAtTime(0.09, start + 1.5);
  gain.gain.linearRampToValueAtTime(0.0, start + 2.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 2.5);
}

/** Full scare sequence fired on "Enter Arena" tap */
export function playScareIntroSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playStaticBurst(ctx, now);
  playSubBoom(ctx, now + 0.02);
  playHighSting(ctx, now + 0.04);
  playThreatHum(ctx, now + 0.15);
}

/** Exit glitch sound (called when scene fades out) */
export function playScareExitSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playStaticBurst(ctx, now);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}
