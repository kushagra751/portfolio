import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { readMove } from '../input'
import { useStore } from '../store'
import { sfx } from '../audio'
import { glow } from '../utils'
import { BOUND, PLAYER_R, SPAWN, TRIGGER, colliders, playerState, zones } from './layout'

const move = { x: 0, y: 0, run: false }
const vel = new THREE.Vector3()
const camTarget = new THREE.Vector3()
const lookTarget = new THREE.Vector3(SPAWN[0], 1.2, SPAWN[2] - 4)
const lookNow = new THREE.Vector3(SPAWN[0], 1.2, SPAWN[2] - 4)

export default function Player() {
  const root = useRef()
  const model = useRef()
  const legL = useRef()
  const legR = useRef()
  const armL = useRef()
  const armR = useRef()
  const head = useRef()
  const phase = useRef(0)
  const lastStep = useRef(0)
  const prevNear = useRef(null)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const s = useStore.getState()
    const active = s.started && !s.panel

    if (active) readMove(move)
    else {
      move.x = 0
      move.y = 0
      move.run = false
    }

    const p = playerState.pos

    if (playerState.teleport) {
      p.copy(playerState.teleport)
      playerState.teleport = null
      vel.set(0, 0, 0)
    }

    // ---- movement (smooth acceleration)
    const speed = move.run ? 12 : 7.5
    const k = 1 - Math.exp(-10 * dt)
    vel.x += (move.x * speed - vel.x) * k
    vel.z += (-move.y * speed - vel.z) * k
    p.x += vel.x * dt
    p.z += vel.z * dt

    // ---- collisions against buildings and trees
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i]
      const dx = p.x - c.x
      const dz = p.z - c.z
      const min = c.r + PLAYER_R
      const d2 = dx * dx + dz * dz
      if (d2 < min * min && d2 > 1e-6) {
        const d = Math.sqrt(d2)
        p.x = c.x + (dx / d) * min
        p.z = c.z + (dz / d) * min
      }
    }

    // ---- stay on the island
    const rd = Math.hypot(p.x, p.z)
    if (rd > BOUND) {
      p.x *= BOUND / rd
      p.z *= BOUND / rd
    }

    const sp = Math.hypot(vel.x, vel.z)
    playerState.speed = sp

    // ---- facing
    if (sp > 0.5) {
      const target = Math.atan2(vel.x, vel.z)
      let diff = target - playerState.heading
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      playerState.heading += diff * (1 - Math.exp(-14 * dt))
    }

    // ---- walk animation
    phase.current += sp * dt * 0.9
    const amount = Math.min(sp / 7.5, 1.4)
    const swing = Math.sin(phase.current * 3.2) * 0.85 * amount
    const t = state.clock.elapsedTime
    if (legL.current) {
      legL.current.rotation.x = swing
      legR.current.rotation.x = -swing
      armL.current.rotation.x = -swing * 0.9
      armR.current.rotation.x = swing * 0.9
    }
    if (model.current) {
      model.current.position.y = Math.abs(Math.sin(phase.current * 3.2)) * 0.12 * amount + Math.sin(t * 2) * 0.02
      model.current.rotation.y = playerState.heading
      model.current.rotation.z = (-vel.x * 0.012) * (move.run ? 1.4 : 1)
    }
    if (head.current) head.current.rotation.y = Math.sin(t * 1.3) * 0.15 * (1 - Math.min(amount, 1))

    // ---- footsteps
    const stepIdx = Math.floor((phase.current * 3.2) / Math.PI)
    if (stepIdx !== lastStep.current) {
      lastStep.current = stepIdx
      if (sp > 2.5) sfx.step()
    }

    if (root.current) root.current.position.set(p.x, 0, p.z)

    // ---- nearest zone
    let nearId = null
    let best = TRIGGER
    for (let i = 0; i < zones.length; i++) {
      const z = zones[i]
      const d = Math.hypot(p.x - z.pos[0], p.z - z.pos[2])
      if (d < best) {
        best = d
        nearId = z.id
      }
    }
    if (s.started) {
      if (nearId !== prevNear.current) {
        if (nearId) sfx.zone()
        prevNear.current = nearId
      }
      s.setNear(nearId)
    }

    // ---- chase camera
    const portrait = state.size.width < state.size.height
    const zoom = portrait ? 1.55 : 1
    const focus = s.panel ? 0.62 : 1
    camTarget.set(p.x, 0, p.z)
    camTarget.y = 12.5 * zoom * focus
    camTarget.z += 15 * zoom * focus
    const ck = 1 - Math.exp(-4.5 * dt)
    state.camera.position.lerp(camTarget, ck)
    lookTarget.set(p.x, 1.4, p.z - 2)
    lookNow.lerp(lookTarget, 1 - Math.exp(-7 * dt))
    state.camera.lookAt(lookNow)
  })

  return (
    <group ref={root} position={[SPAWN[0], 0, SPAWN[2]]} scale={0.9}>
      {/* blob shadow */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.05}>
        <circleGeometry args={[0.95, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      <group ref={model}>
        {/* legs */}
        <group ref={legL} position={[-0.25, 0.8, 0]}>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.34]} />
            <meshStandardMaterial color="#26306b" flatShading />
          </mesh>
          <mesh position={[0, -0.78, 0.06]}>
            <boxGeometry args={[0.34, 0.14, 0.5]} />
            <meshStandardMaterial color="#f72585" flatShading />
          </mesh>
        </group>
        <group ref={legR} position={[0.25, 0.8, 0]}>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.34]} />
            <meshStandardMaterial color="#26306b" flatShading />
          </mesh>
          <mesh position={[0, -0.78, 0.06]}>
            <boxGeometry args={[0.34, 0.14, 0.5]} />
            <meshStandardMaterial color="#f72585" flatShading />
          </mesh>
        </group>

        {/* torso */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[0.95, 1.0, 0.62]} />
          <meshStandardMaterial color="#e9eeff" flatShading roughness={0.45} />
        </mesh>
        <mesh position={[0, 1.4, 0.32]}>
          <boxGeometry args={[0.4, 0.22, 0.03]} />
          <meshBasicMaterial color={glow('#4cc9f0', 2.5)} toneMapped={false} />
        </mesh>
        {/* backpack */}
        <mesh position={[0, 1.3, -0.45]}>
          <boxGeometry args={[0.7, 0.8, 0.28]} />
          <meshStandardMaterial color="#3a3f8f" flatShading />
        </mesh>
        <mesh position={[0, 1.3, -0.6]}>
          <boxGeometry args={[0.5, 0.08, 0.02]} />
          <meshBasicMaterial color={glow('#f72585', 2.5)} toneMapped={false} />
        </mesh>

        {/* arms */}
        <group ref={armL} position={[-0.62, 1.7, 0]}>
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[0.24, 0.72, 0.28]} />
            <meshStandardMaterial color="#e9eeff" flatShading />
          </mesh>
        </group>
        <group ref={armR} position={[0.62, 1.7, 0]}>
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[0.24, 0.72, 0.28]} />
            <meshStandardMaterial color="#e9eeff" flatShading />
          </mesh>
        </group>

        {/* head */}
        <group ref={head} position={[0, 2.35, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.7, 0.78]} />
            <meshStandardMaterial color="#e9eeff" flatShading roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.02, 0.4]}>
            <boxGeometry args={[0.74, 0.4, 0.04]} />
            <meshStandardMaterial color="#0b0b24" roughness={0.2} metalness={0.4} />
          </mesh>
          {[-0.17, 0.17].map((x) => (
            <mesh key={x} position={[x, 0.04, 0.43]}>
              <boxGeometry args={[0.14, 0.14, 0.02]} />
              <meshBasicMaterial color={glow('#4cc9f0', 3)} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
            <meshStandardMaterial color="#cfd3ff" />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshBasicMaterial color={glow('#f72585', 3)} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
