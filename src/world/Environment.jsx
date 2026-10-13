import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Sparkles, Stars } from '@react-three/drei'
import { ISLAND_R, TRIGGER, trees, zones } from './layout'
import { useStore } from '../store'
import { glow, isMobile } from '../utils'
import Label from './Label'

/* ---------------------------------------------------------------- sky */

export function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          top: { value: new THREE.Color('#04020d') },
          mid: { value: new THREE.Color('#2a1058') },
          bottom: { value: new THREE.Color('#ff5f8f') },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 top;
          uniform vec3 mid;
          uniform vec3 bottom;
          varying vec3 vDir;
          void main() {
            float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
            vec3 c = mix(bottom, mid, smoothstep(0.42, 0.56, h));
            c = mix(c, top, smoothstep(0.56, 0.92, h));
            gl_FragColor = vec4(c, 1.0);
          }
        `,
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  return (
    <mesh scale={420} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[1, 32, 20]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

export function Moon() {
  return (
    <group position={[-130, 120, -260]}>
      <mesh>
        <sphereGeometry args={[20, 32, 24]} />
        <meshBasicMaterial color={glow('#fff4d6', 1.6)} toneMapped={false} fog={false} />
      </mesh>
    </group>
  )
}

export function Cosmos() {
  return (
    <>
      <Stars radius={260} depth={80} count={isMobile ? 1800 : 4500} factor={6} fade speed={0.6} />
      <Sparkles
        count={isMobile ? 70 : 150}
        scale={[84, 14, 84]}
        position={[0, 7, 0]}
        size={4}
        speed={0.35}
        opacity={0.9}
        color="#9ad7ff"
      />
    </>
  )
}

/* ------------------------------------------------------------- island */

export function Island() {
  const gridTexture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 512
    const g = c.getContext('2d')
    g.fillStyle = '#17123a'
    g.fillRect(0, 0, 512, 512)
    g.strokeStyle = '#2f2680'
    g.lineWidth = 3
    for (let i = 0; i <= 512; i += 64) {
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i, 512)
      g.stroke()
      g.beginPath()
      g.moveTo(0, i)
      g.lineTo(512, i)
      g.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(9, 9)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [])
  useEffect(() => () => gridTexture.dispose(), [gridTexture])

  return (
    <group>
      {/* top slab */}
      <mesh position-y={-1}>
        <cylinderGeometry args={[ISLAND_R, ISLAND_R - 1.5, 2, 72]} />
        <meshStandardMaterial map={gridTexture} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* underside rock */}
      <mesh position-y={-17} rotation-x={Math.PI}>
        <coneGeometry args={[ISLAND_R - 1.5, 30, 9]} />
        <meshStandardMaterial color="#2a1f55" flatShading roughness={1} />
      </mesh>
      {/* neon rim */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.03}>
        <ringGeometry args={[ISLAND_R - 0.7, ISLAND_R, 96]} />
        <meshBasicMaterial color={glow('#4cc9f0', 2.4)} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------------------- plaza */

export function Plaza() {
  const ring = useRef()
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.25
  })
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={0.04}>
        <circleGeometry args={[6.2, 64]} />
        <meshStandardMaterial color="#1d1650" roughness={0.6} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.06}>
        <ringGeometry args={[4.6, 4.85, 6]} />
        <meshBasicMaterial color={glow('#b388ff', 2.2)} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.06}>
        <ringGeometry args={[5.9, 6.2, 64]} />
        <meshBasicMaterial color={glow('#4cc9f0', 2.2)} toneMapped={false} />
      </mesh>
      <Label text="KUSHAGRA PATIDAR" sub="Full Stack Developer" color="#4cc9f0" position={[0, 6.4, 0]} width={13} />
    </group>
  )
}

/* -------------------------------------------------------------- paths */

export function Paths() {
  const items = useMemo(
    () =>
      zones.map((z) => {
        const dx = z.pos[0]
        const dz = z.pos[2]
        const dist = Math.hypot(dx, dz)
        const start = 6.2
        const end = dist - (TRIGGER - 0.5)
        const len = end - start
        const mid = start + len / 2
        return {
          id: z.id,
          color: z.color,
          len,
          x: (dx / dist) * mid,
          z: (dz / dist) * mid,
          angle: Math.atan2(dx, dz),
        }
      }),
    [],
  )
  return (
    <group>
      {items.map((p) => (
        <group key={p.id} position={[p.x, 0.03, p.z]} rotation-y={p.angle}>
          <mesh>
            <boxGeometry args={[2.6, 0.05, p.len]} />
            <meshStandardMaterial color="#231b5e" roughness={0.7} />
          </mesh>
          <mesh position={[-1.25, 0.04, 0]}>
            <boxGeometry args={[0.1, 0.03, p.len]} />
            <meshBasicMaterial color={glow(p.color, 2)} toneMapped={false} />
          </mesh>
          <mesh position={[1.25, 0.04, 0]}>
            <boxGeometry args={[0.1, 0.03, p.len]} />
            <meshBasicMaterial color={glow(p.color, 2)} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------- zone rings */

export function ZoneRing({ zone }) {
  const active = useStore((s) => s.near === zone.id)
  const ref = useRef()
  const mat = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pulse = active ? 1 + Math.sin(t * 6) * 0.025 : 1
    ref.current.scale.set(pulse, pulse, 1)
    if (mat.current) mat.current.opacity = active ? 1 : 0.55 + Math.sin(t * 2 + zone.pos[0]) * 0.15
  })
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[zone.pos[0], 0.07, zone.pos[2]]}>
      <ringGeometry args={[TRIGGER - 0.35, TRIGGER, 72]} />
      <meshBasicMaterial ref={mat} color={glow(zone.color, active ? 3 : 1.8)} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

/* -------------------------------------------------------------- trees */

export function Trees() {
  const lower = useRef()
  const upper = useRef()
  const trunk = useRef()

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const color = new THREE.Color()
    trees.forEach((t, i) => {
      e.set(0, t.rot, 0)
      q.setFromEuler(e)
      m.compose(new THREE.Vector3(t.x, 1.0 * t.s, t.z), q, new THREE.Vector3(t.s, t.s, t.s))
      lower.current.setMatrixAt(i, m)
      m.compose(new THREE.Vector3(t.x, 2.3 * t.s, t.z), q, new THREE.Vector3(t.s * 0.75, t.s * 0.8, t.s * 0.75))
      upper.current.setMatrixAt(i, m)
      m.compose(new THREE.Vector3(t.x, 0.4 * t.s, t.z), q, new THREE.Vector3(t.s, t.s, t.s))
      trunk.current.setMatrixAt(i, m)
      color.setHSL(0.45 + t.tint * 0.2, 0.55, 0.28 + t.tint * 0.12)
      lower.current.setColorAt(i, color)
      upper.current.setColorAt(i, color)
    })
    lower.current.instanceMatrix.needsUpdate = true
    upper.current.instanceMatrix.needsUpdate = true
    trunk.current.instanceMatrix.needsUpdate = true
    if (lower.current.instanceColor) lower.current.instanceColor.needsUpdate = true
    if (upper.current.instanceColor) upper.current.instanceColor.needsUpdate = true
  }, [])

  const n = trees.length
  return (
    <group>
      <instancedMesh ref={trunk} args={[null, null, n]}>
        <cylinderGeometry args={[0.18, 0.28, 0.8, 6]} />
        <meshStandardMaterial color="#4a2f27" flatShading />
      </instancedMesh>
      <instancedMesh ref={lower} args={[null, null, n]}>
        <coneGeometry args={[1.25, 2.1, 7]} />
        <meshStandardMaterial flatShading roughness={0.8} emissive="#0c3a38" emissiveIntensity={0.5} />
      </instancedMesh>
      <instancedMesh ref={upper} args={[null, null, n]}>
        <coneGeometry args={[1.25, 2.1, 7]} />
        <meshStandardMaterial flatShading roughness={0.8} emissive="#0c3a38" emissiveIntensity={0.5} />
      </instancedMesh>
    </group>
  )
}

/* ------------------------------------------------------- floating rocks */

const rocks = [
  [-62, 10, -30, 5],
  [64, 18, -24, 6.5],
  [-70, -2, 30, 4],
  [58, 4, 44, 5],
  [-40, 26, -70, 7],
  [30, 30, -78, 4.5],
  [0, 14, 78, 6],
  [-20, -6, 70, 3.5],
]

export function FloatingRocks() {
  return (
    <group>
      {rocks.map(([x, y, z, s], i) => (
        <Float key={i} speed={1 + (i % 3) * 0.4} floatIntensity={2} rotationIntensity={0.6}>
          <group position={[x, y, z]}>
            <mesh scale={s}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#3b2a7a" flatShading roughness={1} />
            </mesh>
            <mesh position={[0, s * 0.9, 0]} scale={s * 0.55}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#3fd0c9" flatShading roughness={1} emissive="#1b6b66" emissiveIntensity={0.7} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}
