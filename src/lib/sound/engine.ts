/**
 * The site's UI sounds, synthesised with the Web Audio API — no audio files,
 * nothing to download, every cue a few oscillators and a burst of filtered
 * noise. Browsers only let audio start after a user gesture, so the context is
 * created lazily and `unlock()` is wired to the first pointerdown/keydown.
 *
 * Sound is opt-in: the preference lives in localStorage (see `soundStore`) and
 * defaults to off. Every public call is a no-op while it is off.
 */

export type Cue =
  | "hover"
  | "press"
  | "toggleOn"
  | "toggleOff"
  | "layer"
  | "note"
  | "ripple";

const STORAGE_KEY = "jd-sound";
const CHANGE_EVENT = "jd-soundchange";
const MASTER = 0.28;

/** Minimum gap between two of the same cue, so a fast sweep doesn't buzz. */
const THROTTLE_MS: Partial<Record<Cue, number>> = {
  hover: 55,
  note: 38,
  layer: 260,
  press: 30,
};

/* D major pentatonic over two octaves — every combination sounds consonant,
   so a cursor scribbling across a headline still plays something musical. */
const PENTATONIC = [587.33, 659.25, 739.99, 880, 987.77];

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let noise: AudioBuffer | null = null;
let unlocked = false;
const lastPlayed: Partial<Record<Cue, number>> = {};

// --- Preference store ------------------------------------------------------

export const soundStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  get(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      return false;
    }
  },
  getServer(): boolean {
    return false;
  },
  set(on: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      /* private mode: the toggle still works for this page view */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  },
};

// --- Audio graph -----------------------------------------------------------

function context(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor({ latencyHint: "interactive" });
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -16;
  limiter.ratio.value = 5;
  out = ctx.createGain();
  out.gain.value = MASTER;
  out.connect(limiter).connect(ctx.destination);

  // Half a second of white noise, reused (from a random offset) by every
  // percussive cue.
  noise = ctx.createBuffer(1, ctx.sampleRate / 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
}

/** Attack–decay envelope on a gain node. Exponential, so it never clicks. */
function envelope(g: GainNode, at: number, attack: number, peak: number, length: number) {
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + length);
}

function tone(
  type: OscillatorType,
  from: number,
  to: number,
  length: number,
  peak: number,
  delay = 0,
  attack = 0.004,
) {
  const c = ctx!;
  const at = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + length);
  envelope(g, at, attack, peak, length);
  osc.connect(g).connect(out!);
  osc.start(at);
  osc.stop(at + length + 0.03);
}

function hiss(
  length: number,
  peak: number,
  filter: BiquadFilterType,
  from: number,
  to = from,
  q = 1,
  delay = 0,
) {
  const c = ctx!;
  const at = c.currentTime + delay;
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(from, at);
  if (to !== from) f.frequency.exponentialRampToValueAtTime(to, at + length);
  const g = c.createGain();
  envelope(g, at, 0.003, peak, length);
  src.connect(f).connect(g).connect(out!);
  src.start(at, Math.random() * 0.3);
  src.stop(at + length + 0.03);
}

/** A soft mallet: fundamental plus a short, slightly inharmonic overtone. */
function mallet(freq: number, peak: number, delay = 0) {
  tone("sine", freq, freq, 0.32, peak, delay, 0.005);
  tone("sine", freq * 3.98, freq * 3.98, 0.06, peak * 0.22, delay, 0.002);
}

// --- Public API ------------------------------------------------------------

/** Call from a user gesture. Creates/resumes the context if sound is on. */
export function unlock() {
  unlocked = true;
  if (!soundStore.get()) return;
  const c = context();
  if (c?.state === "suspended") void c.resume().catch(() => {});
}

/**
 * Play a cue. `value` is cue-specific: for `note` a 0–1 position (left to
 * right across a headline), for `layer` the layer index.
 */
export function play(cue: Cue, value = 0) {
  if (!unlocked || !soundStore.get()) return;
  const c = context();
  if (!c) return;
  if (c.state === "suspended") void c.resume().catch(() => {});

  const now = performance.now();
  const gap = THROTTLE_MS[cue];
  if (gap && now - (lastPlayed[cue] ?? 0) < gap) return;
  lastPlayed[cue] = now;

  switch (cue) {
    case "hover":
      // A glassy tick, high and very short.
      tone("sine", 1568, 1661, 0.045, 0.045);
      tone("triangle", 3136, 3136, 0.02, 0.012);
      break;
    case "press":
      tone("triangle", 392, 247, 0.09, 0.13);
      hiss(0.025, 0.05, "highpass", 2600);
      break;
    case "toggleOn":
      mallet(PENTATONIC[0], 0.12);
      mallet(PENTATONIC[3], 0.12, 0.08);
      break;
    case "toggleOff":
      mallet(PENTATONIC[3], 0.1);
      mallet(PENTATONIC[0] / 2, 0.1, 0.08);
      break;
    case "layer": {
      // Dropping one layer deeper: an airy downward sweep and a lower note
      // for each layer.
      const i = Math.max(0, Math.min(5, Math.round(value)));
      hiss(0.4, 0.05, "bandpass", 2400, 420, 0.8);
      mallet(PENTATONIC[4 - (i % 5)] / (i >= 5 ? 4 : 2), 0.08, 0.03);
      break;
    }
    case "note": {
      const step = Math.round(Math.max(0, Math.min(1, value)) * 9);
      const freq = PENTATONIC[step % 5] * 2 ** Math.floor(step / 5);
      mallet(freq / 2, 0.075);
      break;
    }
    case "ripple":
      PENTATONIC.forEach((f, i) => mallet(f, 0.05, i * 0.055));
      break;
  }
}
