import * as THREE from 'three'
import { mulberry32 } from '../utils'

export const ISLAND_R = 43
export const BOUND = 40.5
export const PLAYER_R = 0.7
export const TRIGGER = 9
export const SPAWN = [0, 0, 5]

// Where the player is and what they are doing (read by camera, minimap, pickups).
export const playerState = {
  pos: new THREE.Vector3(SPAWN[0], 0, SPAWN[2]),
  heading: 0,
  speed: 0,
  teleport: null,
}

export const zones = [
  { id: 'about', label: 'ABOUT ME', sub: 'Origin Story', letter: 'A', pos: [-19, 0, -11], color: '#4cc9f0', r: 4.6 },
  { id: 'projects', label: 'PROJECTS', sub: 'The Arcade', letter: 'P', pos: [19, 0, -11], color: '#f72585', r: 5.2 },
  { id: 'skills', label: 'SKILLS', sub: 'Crystal Garden', letter: 'S', pos: [-21, 0, 14], color: '#b388ff', r: 2.6 },
  { id: 'experience', label: 'EXPERIENCE', sub: 'Tech Tower', letter: 'E', pos: [21, 0, 14], color: '#ffb703', r: 4.2 },
  { id: 'contact', label: 'CONTACT', sub: 'Portal', letter: 'C', pos: [0, 0, -31], color: '#4ade80', r: 3.6 },
]

export const zoneById = Object.fromEntries(zones.map((z) => [z.id, z]))

// Collectible stars (x, z)
export const starSpots = [
  [-9, 3],
  [10, 2],
  [0, 18],
  [-31, -1],
  [31, -1],
  [-9, -27],
  [10, -27],
  [-27, 22],
  [27, 22],
  [0, 34],
  [-12, -14],
  [12, -18],
]

// Seeded trees so the world is identical on every load.
export const trees = (() => {
  const rand = mulberry32(7)
  const out = []
  let attempts = 0
  while (out.length < 46 && attempts < 1500) {
    attempts++
    const a = rand() * Math.PI * 2
    const r = 21 + rand() * 18.5
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (zones.some((zn) => Math.hypot(x - zn.pos[0], z - zn.pos[2]) < 12)) continue
    if (starSpots.some((s) => Math.hypot(x - s[0], z - s[1]) < 3)) continue
    if (out.some((t) => Math.hypot(x - t.x, z - t.z) < 3.4)) continue
    out.push({ x, z, s: 0.8 + rand() * 0.8, rot: rand() * Math.PI, tint: rand() })
  }
  return out
})()

export const colliders = [
  ...zones.map((z) => ({ x: z.pos[0], z: z.pos[2], r: z.r })),
  ...trees.map((t) => ({ x: t.x, z: t.z, r: 0.75 * t.s })),
]

// Where fast travel drops the player: just outside the building, facing it.
export function travelPoint(id) {
  if (id === 'home') return new THREE.Vector3(SPAWN[0], 0, SPAWN[2])
  const z = zoneById[id]
  const dir = new THREE.Vector3(-z.pos[0], 0, -z.pos[2]).normalize()
  return new THREE.Vector3(z.pos[0] + dir.x * 8, 0, z.pos[2] + dir.z * 8)
}
