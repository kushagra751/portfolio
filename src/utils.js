import * as THREE from 'three'

export const isMobile =
  typeof window !== 'undefined' &&
  (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches))

export const isTouch =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

// HDR colour helper: values above 1 make a material bloom.
const glowCache = new Map()
export function glow(hex, k = 2) {
  const key = hex + '|' + k
  let c = glowCache.get(key)
  if (!c) {
    c = new THREE.Color(hex).multiplyScalar(k)
    glowCache.set(key, c)
  }
  return c
}

export function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
