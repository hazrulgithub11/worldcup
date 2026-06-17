let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

/** Arcade menu cursor tick when browsing fighters */
export function playCharacterBrowseSound(direction: "left" | "right" = "right") {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const isRight = direction === "right";

  const tick = ctx.createOscillator();
  const tickGain = ctx.createGain();
  tick.type = "triangle";
  tick.frequency.setValueAtTime(isRight ? 680 : 520, now);
  tick.frequency.exponentialRampToValueAtTime(isRight ? 420 : 320, now + 0.06);
  tickGain.gain.setValueAtTime(0.09, now);
  tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  tick.connect(tickGain);
  tickGain.connect(ctx.destination);
  tick.start(now);
  tick.stop(now + 0.08);

  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = "square";
  click.frequency.setValueAtTime(isRight ? 1100 : 900, now);
  click.frequency.exponentialRampToValueAtTime(600, now + 0.04);
  clickGain.gain.setValueAtTime(0.025, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  click.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(now);
  click.stop(now + 0.05);
}
