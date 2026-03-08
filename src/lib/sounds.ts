// Synthesize a page-turn sound using Web Audio API — no external files needed
let audioCtx: AudioContext | null = null;

const getAudioCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

export const playPageTurn = () => {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const duration = 0.35;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + duration);
  } catch {
    // Silently fail
  }
};

// ─── Paper Rustle (continuous, during drag) ──────────────────────────────────
interface RustleState {
  source: AudioBufferSourceNode | null;
  filter: BiquadFilterNode | null;
  gain: GainNode | null;
  running: boolean;
}

const rustle: RustleState = { source: null, filter: null, gain: null, running: false };

export const startPaperRustle = () => {
  if (rustle.running) return;
  try {
    const ctx = getAudioCtx();
    const sampleRate = ctx.sampleRate;
    const len = Math.floor(sampleRate * 2);
    const buf = ctx.createBuffer(1, len, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2500;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    rustle.source = source;
    rustle.filter = filter;
    rustle.gain = gain;
    rustle.running = true;
  } catch {
    rustle.running = false;
  }
};

export const updatePaperRustle = (intensity: number) => {
  if (!rustle.running || !rustle.gain || !rustle.filter) return;
  try {
    const ctx = getAudioCtx();
    const vol = Math.min(0.15, Math.abs(intensity) * 0.12);
    const freq = 1800 + Math.abs(intensity) * 1500;
    rustle.gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.03);
    rustle.filter.frequency.linearRampToValueAtTime(Math.min(freq, 5000), ctx.currentTime + 0.03);
  } catch { /* ok */ }
};

export const stopPaperRustle = () => {
  if (!rustle.running) return;
  try {
    const ctx = getAudioCtx();
    if (rustle.gain) {
      rustle.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    }
    const src = rustle.source;
    setTimeout(() => {
      try { src?.stop(); src?.disconnect(); } catch { /* ok */ }
    }, 150);
  } catch { /* ok */ }
  rustle.source = null;
  rustle.filter = null;
  rustle.gain = null;
  rustle.running = false;
};

export const playBookOpen = () => {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const duration = 0.6;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + duration);
  } catch {
    // Silently fail
  }
};

// ─── Dark Fantasy Ambient Music ───────────────────────────────────────────────
// Synthesized drone with layered oscillators, subtle modulation, and filtered noise

interface AmbientState {
  nodes: AudioNode[];
  masterGain: GainNode | null;
  running: boolean;
}

const ambient: AmbientState = { nodes: [], masterGain: null, running: false };

export const startAmbientMusic = () => {
  if (ambient.running) return;
  try {
    const ctx = getAudioCtx();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3); // Fade in over 3s
    master.connect(ctx.destination);
    ambient.masterGain = master;
    ambient.running = true;

    const nodes: AudioNode[] = [];

    // Layer 1: Deep sub-drone (D1 ~36.7 Hz)
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 36.7;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.35;
    sub.connect(subGain);
    subGain.connect(master);
    sub.start();
    nodes.push(sub, subGain);

    // Layer 2: Low drone (D2 ~73.4 Hz) with slow vibrato
    const drone = ctx.createOscillator();
    drone.type = "sawtooth";
    drone.frequency.value = 73.4;
    const droneLfo = ctx.createOscillator();
    droneLfo.type = "sine";
    droneLfo.frequency.value = 0.15;
    const droneLfoGain = ctx.createGain();
    droneLfoGain.gain.value = 1.5;
    droneLfo.connect(droneLfoGain);
    droneLfoGain.connect(drone.frequency);
    droneLfo.start();
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 200;
    droneFilter.Q.value = 2;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.15;
    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);
    drone.start();
    nodes.push(drone, droneLfo, droneLfoGain, droneFilter, droneGain);

    // Layer 3: Eerie pad (A2 ~110 Hz + minor third C3 ~130.8 Hz)
    const pad1 = ctx.createOscillator();
    pad1.type = "triangle";
    pad1.frequency.value = 110;
    const pad2 = ctx.createOscillator();
    pad2.type = "triangle";
    pad2.frequency.value = 130.8;
    // Slow detuning LFO
    const padLfo = ctx.createOscillator();
    padLfo.type = "sine";
    padLfo.frequency.value = 0.08;
    const padLfoGain = ctx.createGain();
    padLfoGain.gain.value = 2;
    padLfo.connect(padLfoGain);
    padLfoGain.connect(pad1.frequency);
    padLfoGain.connect(pad2.frequency);
    padLfo.start();
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 350;
    padFilter.Q.value = 1;
    // Slow filter sweep
    const filterLfo = ctx.createOscillator();
    filterLfo.type = "sine";
    filterLfo.frequency.value = 0.04;
    const filterLfoGain = ctx.createGain();
    filterLfoGain.gain.value = 100;
    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(padFilter.frequency);
    filterLfo.start();
    const padGain = ctx.createGain();
    padGain.gain.value = 0.08;
    pad1.connect(padFilter);
    pad2.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(master);
    pad1.start();
    pad2.start();
    nodes.push(pad1, pad2, padLfo, padLfoGain, padFilter, filterLfo, filterLfoGain, padGain);

    // Layer 4: Wind-like filtered noise
    const noiseLen = ctx.sampleRate * 4;
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      noiseData[i] = (Math.random() * 2 - 1);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 0.3;
    // Slow wind sweep
    const windLfo = ctx.createOscillator();
    windLfo.type = "sine";
    windLfo.frequency.value = 0.06;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 200;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(noiseFilter.frequency);
    windLfo.start();
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.06;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();
    nodes.push(noise, noiseFilter, windLfo, windLfoGain, noiseGain);

    ambient.nodes = nodes;
  } catch {
    ambient.running = false;
  }
};

export const stopAmbientMusic = () => {
  if (!ambient.running || !ambient.masterGain) return;
  try {
    const ctx = getAudioCtx();
    // Fade out over 2s then cleanup
    ambient.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    const nodesToClean = [...ambient.nodes];
    const gainToClean = ambient.masterGain;
    setTimeout(() => {
      nodesToClean.forEach(n => {
        try {
          if (n instanceof OscillatorNode || n instanceof AudioBufferSourceNode) n.stop();
          n.disconnect();
        } catch { /* already stopped */ }
      });
      try { gainToClean.disconnect(); } catch { /* ok */ }
    }, 2500);
  } catch { /* ok */ }
  ambient.nodes = [];
  ambient.masterGain = null;
  ambient.running = false;
};

export const isAmbientPlaying = () => ambient.running;
