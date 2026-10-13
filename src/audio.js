// Fully procedural audio (Web Audio API). No audio files, so nothing to download.

let ctx = null
let master = null
let musicBus = null
let sfxBus = null
let noiseBuffer = null
let timer = null
let muted = false
let step = 0
let nextTime = 0

// Am - F - C - G (MIDI notes)
const chords = [
  [57, 60, 64],
  [53, 57, 60],
  [48, 52, 55],
  [55, 59, 62],
]
const arp = [0, 1, 2, 1, 2, 1, 0, 2]
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12)

export function initAudio() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume()
    return
  }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()

  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.8
  master.connect(ctx.destination)

  musicBus = ctx.createGain()
  musicBus.gain.value = 0.3
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2200
  const delay = ctx.createDelay(1)
  delay.delayTime.value = 0.38
  const feedback = ctx.createGain()
  feedback.gain.value = 0.35
  const wet = ctx.createGain()
  wet.gain.value = 0.4
  musicBus.connect(lp)
  lp.connect(master)
  lp.connect(delay)
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(wet)
  wet.connect(master)

  sfxBus = ctx.createGain()
  sfxBus.gain.value = 0.55
  sfxBus.connect(master)

  // short white-noise buffer for footsteps
  const len = Math.floor(ctx.sampleRate * 0.12)
  noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1

  step = 0
  nextTime = ctx.currentTime + 0.15
  timer = setInterval(schedule, 100)

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) ctx.suspend()
    else ctx.resume()
  })
}

function schedule() {
  if (!ctx || ctx.state !== 'running') return
  while (nextTime < ctx.currentTime + 0.35) {
    const chord = chords[Math.floor(step / 16) % chords.length]
    if (step % 16 === 0) pad(chord, nextTime)
    if (step % 8 === 0) bass(chord[0] - 12, nextTime)
    if (step % 2 === 0) pluck(chord[arp[(step / 2) % arp.length]] + 12, nextTime)
    step++
    nextTime += 0.19
  }
}

function pad(chord, t) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(0.07, t + 0.9)
  g.gain.linearRampToValueAtTime(0.0001, t + 3.4)
  const f = ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 750
  f.connect(g)
  g.connect(musicBus)
  chord.forEach((n) => {
    ;[-7, 7].forEach((d) => {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = mtof(n)
      o.detune.value = d
      o.connect(f)
      o.start(t)
      o.stop(t + 3.5)
    })
  })
}

function bass(note, t) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.value = mtof(note)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(0.28, t + 0.03)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
  o.connect(g)
  g.connect(musicBus)
  o.start(t)
  o.stop(t + 1)
}

function pluck(note, t) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.value = mtof(note)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(0.16, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
  o.connect(g)
  g.connect(musicBus)
  o.start(t)
  o.stop(t + 0.5)
}

function tone({ freq, type = 'sine', dur = 0.15, vol = 0.3, slide = 0, delay = 0 }) {
  if (!ctx || muted) return
  const t = ctx.currentTime + delay
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur)
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  g.connect(sfxBus)
  o.start(t)
  o.stop(t + dur + 0.03)
}

export function setMuted(value) {
  muted = value
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(muted ? 0 : 0.8, ctx.currentTime + 0.15)
  }
}

export const sfx = {
  step() {
    if (!ctx || muted || !noiseBuffer) return
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 260 + Math.random() * 120
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.18, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)
    src.connect(f)
    f.connect(g)
    g.connect(sfxBus)
    src.start(t)
    src.stop(t + 0.1)
  },
  collect(n = 0) {
    const base = 660 * Math.pow(1.0595, Math.min(n, 12))
    tone({ freq: base, type: 'square', dur: 0.1, vol: 0.12 })
    tone({ freq: base * 1.5, type: 'square', dur: 0.18, vol: 0.12, delay: 0.08 })
  },
  win() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: 0.3, vol: 0.25, delay: i * 0.11 }))
  },
  open() {
    tone({ freq: 380, type: 'triangle', dur: 0.22, vol: 0.25, slide: 500 })
  },
  close() {
    tone({ freq: 700, type: 'triangle', dur: 0.2, vol: 0.2, slide: -400 })
  },
  zone() {
    tone({ freq: 520, type: 'sine', dur: 0.12, vol: 0.2 })
    tone({ freq: 780, type: 'sine', dur: 0.2, vol: 0.2, delay: 0.09 })
  },
  teleport() {
    tone({ freq: 200, type: 'sawtooth', dur: 0.45, vol: 0.12, slide: 1400 })
  },
  click() {
    tone({ freq: 900, type: 'square', dur: 0.05, vol: 0.08 })
  },
}
