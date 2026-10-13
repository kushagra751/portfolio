import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { glow } from '../utils'
import { playerState, starSpots } from './layout'
import { useStore } from '../store'

const PICKUP_R = 1.9

export default function Collectibles() {
  const meshes = useRef([])
  // collectedAt[i] = clock time when star i was picked up (or 0)
  const state = useRef(starSpots.map(() => 0))

  useLayoutEffect(() => {
    state.current = starSpots.map(() => 0)
  }, [])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    const started = useStore.getState().started
    const p = playerState.pos
    for (let i = 0; i < starSpots.length; i++) {
      const m = meshes.current[i]
      if (!m) continue
      const at = state.current[i]
      if (at) {
        // quick pop-and-vanish
        const k = (t - at) / 0.35
        if (k >= 1) {
          m.visible = false
        } else {
          const sc = 1 + Math.sin(k * Math.PI) * 1.2 * (1 - k)
          m.scale.setScalar(sc * (1 - k))
          m.position.y = 1.6 + k * 2
        }
        continue
      }
      m.rotation.y = t * 1.8 + i
      m.position.y = 1.6 + Math.sin(t * 2.2 + i) * 0.3
      if (started) {
        const dx = p.x - starSpots[i][0]
        const dz = p.z - starSpots[i][1]
        if (dx * dx + dz * dz < PICKUP_R * PICKUP_R) {
          state.current[i] = t
          useStore.getState().collectStar()
        }
      }
    }
  })

  return (
    <group>
      {starSpots.map(([x, z], i) => (
        <mesh key={i} ref={(el) => {
            meshes.current[i] = el
          }} position={[x, 1.6, z]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshBasicMaterial color={glow('#ffd166', 2.6)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
