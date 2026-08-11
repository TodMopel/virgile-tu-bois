#!/usr/bin/env node
// Analyse offline des morceaux : décode chaque mp3 via ffmpeg en PCM mono,
// calcule l'énergie par bande de fréquence (bass/mid/treble) toutes les ~23ms,
// et écrit le résultat en JSON dans public/analysis/. Exécuté une fois, à l'avance —
// voir docs/adr/0002-reactivite-audio-live.md.
import { spawnSync } from "node:child_process";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dirname, "..", "public", "audio");
// Bundlé via import JS (pas public/) : fetch() sur file:// est peu fiable dans Safari
// (cas iPhone, ADR 0003) — voir aussi ADR 0002.
const OUT_DIR = join(__dirname, "..", "src", "data", "analysis");

const SAMPLE_RATE = 22050;
const FFT_SIZE = 1024;
const HOP_SIZE = 512;

const BAND_RANGES_HZ = {
  bass: [20, 250],
  mid: [250, 2000],
  treble: [2000, 9000],
};

mkdirSync(OUT_DIR, { recursive: true });

function decodeToPCM(filePath) {
  const result = spawnSync(
    "ffmpeg",
    ["-i", filePath, "-f", "f32le", "-ac", "1", "-ar", String(SAMPLE_RATE), "-loglevel", "error", "-"],
    { maxBuffer: 1024 * 1024 * 1024 },
  );
  if (result.status !== 0) {
    throw new Error(`ffmpeg a échoué pour ${filePath}: ${result.stderr}`);
  }
  const buf = result.stdout;
  return new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
}

// FFT radix-2 itérative, in-place (re/im doivent avoir une longueur puissance de 2)
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wRe = Math.cos(ang);
    const wIm = Math.sin(ang);
    const half = len / 2;
    for (let i = 0; i < n; i += len) {
      let curRe = 1;
      let curIm = 0;
      for (let k = 0; k < half; k++) {
        const uRe = re[i + k];
        const uIm = im[i + k];
        const vRe = re[i + k + half] * curRe - im[i + k + half] * curIm;
        const vIm = re[i + k + half] * curIm + im[i + k + half] * curRe;
        re[i + k] = uRe + vRe;
        im[i + k] = uIm + vIm;
        re[i + k + half] = uRe - vRe;
        im[i + k + half] = uIm - vIm;
        const nextRe = curRe * wRe - curIm * wIm;
        const nextIm = curRe * wIm + curIm * wRe;
        curRe = nextRe;
        curIm = nextIm;
      }
    }
  }
}

function hannWindow(size) {
  const w = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  return w;
}

const window_ = hannWindow(FFT_SIZE);
const binHz = SAMPLE_RATE / FFT_SIZE;

function bandBinRange([lo, hi]) {
  const start = Math.max(1, Math.floor(lo / binHz));
  const end = Math.min(FFT_SIZE / 2, Math.ceil(hi / binHz));
  return [start, end];
}

const bandBins = Object.fromEntries(
  Object.entries(BAND_RANGES_HZ).map(([name, range]) => [name, bandBinRange(range)]),
);

function normalize(arr) {
  const max = arr.reduce((m, v) => Math.max(m, v), 0) || 1;
  return arr.map((v) => Math.round((v / max) * 1000) / 1000);
}

function analyzeTrack(samples) {
  const frameCount = Math.max(0, Math.floor((samples.length - FFT_SIZE) / HOP_SIZE) + 1);
  const bass = new Array(frameCount);
  const mid = new Array(frameCount);
  const treble = new Array(frameCount);
  const overall = new Array(frameCount);

  const re = new Float32Array(FFT_SIZE);
  const im = new Float32Array(FFT_SIZE);

  for (let f = 0; f < frameCount; f++) {
    const offset = f * HOP_SIZE;
    let rms = 0;
    for (let i = 0; i < FFT_SIZE; i++) {
      const s = samples[offset + i] * window_[i];
      re[i] = s;
      im[i] = 0;
      rms += s * s;
    }
    fft(re, im);

    for (const name of ["bass", "mid", "treble"]) {
      const [start, end] = bandBins[name];
      let e = 0;
      for (let k = start; k < end; k++) e += Math.hypot(re[k], im[k]);
      if (name === "bass") bass[f] = e;
      if (name === "mid") mid[f] = e;
      if (name === "treble") treble[f] = e;
    }
    overall[f] = Math.sqrt(rms / FFT_SIZE);
  }

  return {
    sampleRate: SAMPLE_RATE,
    hop: HOP_SIZE / SAMPLE_RATE,
    frameCount,
    bass: normalize(bass),
    mid: normalize(mid),
    treble: normalize(treble),
    overall: normalize(overall),
  };
}

const files = readdirSync(AUDIO_DIR).filter((f) => f.toLowerCase().endsWith(".mp3"));
if (files.length === 0) {
  console.error(`Aucun mp3 trouvé dans ${AUDIO_DIR}`);
  process.exit(1);
}

for (const file of files) {
  const name = basename(file, extname(file));
  process.stdout.write(`Analyse ${file}... `);
  const samples = decodeToPCM(join(AUDIO_DIR, file));
  const data = analyzeTrack(samples);
  writeFileSync(join(OUT_DIR, `${name}.json`), JSON.stringify(data));
  console.log(`-> ${name}.json (${data.frameCount} frames)`);
}

console.log("Terminé.");
