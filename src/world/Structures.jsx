import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Sparkles } from '@react-three/drei'
import { glow, isMobile } from '../utils'
import { zoneById } from './layout'
import Label from './Label'

// Every building faces the plaza in the middle of the island.
function Facing({ zone, children }) {
  const [x, , z] = zone.pos
  return (
    <group position={zone.pos} rotation-y={Math.atan2(-x, -z)}>
      {children}
      {!isMobile && <pointLight position={[0, 5, 5]} color={zone.color} intensity={60} distance={22} decay={2} />}
    </group>
  )
}

/* ------------------------------------------------------------- about */

export function AboutHouse() {
  const zone = zoneById.about
  return (
    <Facing zone={zone}>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[5, 3.2, 4.2]} />
        <meshStandardMaterial color="#2c3d7a" flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.35, 0]} rotation-y={Math.PI / 4} scale={[1, 1, 0.86]}>
        <coneGeometry args={[4.1, 2.6, 4]} />
        <meshStandardMaterial color="#1b6fa8" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[1.4, 5.1, -0.7]}>
        <boxGeometry args={[0.7, 1.6, 0.7]} />
        <meshStandardMaterial color="#3a2a63" flatShading />
      </mesh>
      {/* door */}
      <mesh position={[0, 1.05, 2.12]}>
        <boxGeometry args={[1.1, 2.1, 0.08]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={1.6} />
      </mesh>
      {/* windows */}
      {[-1.75, 1.75].map((x) => (
        <mesh key={x} position={[x, 1.9, 2.12]}>
          <boxGeometry args={[0.95, 0.95, 0.08]} />
          <meshBasicMaterial color={glow('#4cc9f0', 2.2)} toneMapped={false} />
        </mesh>
      ))}
      {/* porch lamp */}
      <mesh position={[2.9, 1.0, 2.6]}>
        <cylinderGeometry args={[0.06, 0.08, 2, 6]} />
        <meshStandardMaterial color="#222244" />
      </mesh>
      <mesh position={[2.9, 2.15, 2.6]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshBasicMaterial color={glow('#ffd166', 2.6)} toneMapped={false} />
      </mesh>
      <Label text={zone.label} sub={zone.sub} color={zone.color} position={[0, 8.4, 0]} />
    </Facing>
  )
}

/* ----------------------------------------------------------- projects */

function Cabinet({ color, position, rotation = 0, phase = 0 }) {
  const screen = useRef()
  useFrame((state) => {
    if (!screen.current) return
    const t = state.clock.elapsedTime
    screen.current.color.setHSL((t * 0.15 + phase) % 1, 0.85, 0.55).multiplyScalar(1.8)
  })
  return (
    <group position={position} rotation-y={rotation}>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[1.9, 3.4, 1.6]} />
        <meshStandardMaterial color="#1a1442" flatShading roughness={0.6} />
      </mesh>
      {/* marquee */}
      <mesh position={[0, 3.3, 0.35]}>
        <boxGeometry args={[1.75, 0.5, 1.0]} />
        <meshBasicMaterial color={glow(color, 2.2)} toneMapped={false} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 2.25, 0.82]} rotation-x={-0.18}>
        <planeGeometry args={[1.45, 1.1]} />
        <meshBasicMaterial ref={screen} toneMapped={false} />
      </mesh>
      {/* control panel */}
      <mesh position={[0, 1.35, 0.95]} rotation-x={-0.5}>
        <boxGeometry args={[1.7, 0.18, 0.7]} />
        <meshStandardMaterial color="#2b2266" flatShading />
      </mesh>
      <mesh position={[-0.4, 1.55, 1.0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
        <meshStandardMaterial color="#ddd" />
      </mesh>
      <mesh position={[-0.4, 1.72, 1.0]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color="#f72585" emissive="#f72585" emissiveIntensity={0.8} />
      </mesh>
      {[0.1, 0.4].map((x) => (
        <mesh key={x} position={[x, 1.52, 1.05]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color={glow('#ffd166', 2)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export function ProjectsArcade() {
  const zone = zoneById.projects
  return (
    <Facing zone={zone}>
      <Cabinet color="#f72585" position={[-3.1, 0, 0.5]} rotation={0.4} phase={0} />
      <Cabinet color="#4cc9f0" position={[0, 0, -0.3]} rotation={0} phase={0.33} />
      <Cabinet color="#ffb703" position={[3.1, 0, 0.5]} rotation={-0.4} phase={0.66} />
      {/* neon back frame */}
      <mesh position={[0, 4.5, -1.8]}>
        <boxGeometry args={[9, 0.12, 0.12]} />
        <meshBasicMaterial color={glow('#f72585', 2.4)} toneMapped={false} />
      </mesh>
      {[-4.4, 4.4].map((x) => (
        <mesh key={x} position={[x, 2.2, -1.8]}>
          <boxGeometry args={[0.12, 4.6, 0.12]} />
          <meshBasicMaterial color={glow('#f72585', 2.4)} toneMapped={false} />
        </mesh>
      ))}
      <Sparkles count={30} scale={[10, 5, 4]} position={[0, 3, 0]} size={3} speed={0.5} color="#ff7bb5" />
      <Label text={zone.label} sub={zone.sub} color={zone.color} position={[0, 8, 0]} />
    </Facing>
  )
}

/* ------------------------------------------------------------- skills */

const crystalColors = ['#b388ff', '#4cc9f0', '#f72585', '#ffb703', '#4ade80', '#ff7b54', '#7c9cff', '#f0abfc']

export function SkillsGarden() {
  const zone = zoneById.skills
  const orbit = useRef()
  const core = useRef()
  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * 0.5
    if (core.current) core.current.rotation.y -= dt * 0.8
  })
  return (
    <Facing zone={zone}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.3, 2.6, 0.6, 8]} />
        <meshStandardMaterial color="#2a2060" flatShading />
      </mesh>
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.16, 8]} />
        <meshBasicMaterial color={glow('#b388ff', 2)} toneMapped={false} />
      </mesh>
      <Float speed={2} floatIntensity={0.8} rotationIntensity={0}>
        <mesh ref={core} position={[0, 3.2, 0]} scale={[1.3, 2.2, 1.3]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#c9a8ff" emissive="#9d6bff" emissiveIntensity={2} flatShading transparent opacity={0.92} />
        </mesh>
      </Float>
      <group ref={orbit} position={[0, 2.2, 0]}>
        {crystalColors.map((c, i) => {
          const a = (i / crystalColors.length) * Math.PI * 2
          return (
            <mesh key={c} position={[Math.cos(a) * 3.9, Math.sin(i * 1.7) * 0.9, Math.sin(a) * 3.9]} scale={[0.5, 0.85, 0.5]}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.6} flatShading />
            </mesh>
          )
        })}
      </group>
      <Sparkles count={40} scale={[9, 7, 9]} position={[0, 3, 0]} size={3.5} speed={0.6} color="#d6b8ff" />
      <Label text={zone.label} sub={zone.sub} color={zone.color} position={[0, 8, 0]} />
    </Facing>
  )
}

/* --------------------------------------------------------- experience */

export function ExperienceTower() {
  const zone = zoneById.experience
  const beacon = useRef()
  const dish = useRef()
  useFrame((state, dt) => {
    if (beacon.current) beacon.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.25)
    if (dish.current) dish.current.rotation.y += dt * 1.2
  })
  const floors = [
    { y: 0.6, w: 5.6, h: 1.2 },
    { y: 2.6, w: 4.6, h: 2.8 },
    { y: 5.0, w: 3.8, h: 2.0 },
    { y: 6.9, w: 3.0, h: 1.8 },
  ]
  return (
    <Facing zone={zone}>
      {floors.map((f, i) => (
        <group key={i} position={[0, f.y, 0]}>
          <mesh>
            <boxGeometry args={[f.w, f.h, f.w]} />
            <meshStandardMaterial color={i === 0 ? '#3a2f6b' : '#2a2358'} flatShading roughness={0.7} />
          </mesh>
          {i > 0 &&
            [-1, 0, 1].map((k) => (
              <mesh key={k} position={[k * (f.w / 3.4), 0, f.w / 2 + 0.03]}>
                <boxGeometry args={[0.55, f.h * 0.6, 0.06]} />
                <meshBasicMaterial color={glow('#ffd166', 2)} toneMapped={false} />
              </mesh>
            ))}
        </group>
      ))}
      {/* roof & antenna */}
      <mesh position={[0, 9.0, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 2.6, 6]} />
        <meshStandardMaterial color="#cfd3ff" />
      </mesh>
      <mesh ref={beacon} position={[0, 10.4, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial color={glow('#ff3b5c', 3)} toneMapped={false} />
      </mesh>
      <mesh ref={dish} position={[1.0, 8.2, 0]}>
        <torusGeometry args={[0.7, 0.07, 8, 24]} />
        <meshBasicMaterial color={glow('#ffb703', 2)} toneMapped={false} />
      </mesh>
      {/* entrance */}
      <mesh position={[0, 0.9, 2.82]}>
        <boxGeometry args={[1.4, 1.8, 0.08]} />
        <meshBasicMaterial color={glow('#ffb703', 2.2)} toneMapped={false} />
      </mesh>
      <Label text={zone.label} sub={zone.sub} color={zone.color} position={[0, 12.6, 0]} width={10} />
    </Facing>
  )
}

/* ------------------------------------------------------------ contact */

export function ContactPortal() {
  const zone = zoneById.contact
  const ring = useRef()
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
        uniforms: { t: { value: 0 }, c: { value: new THREE.Color('#4ade80').multiplyScalar(2) } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float t;
          uniform vec3 c;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p) * 2.0;
            float a = atan(p.y, p.x);
            float swirl = sin(a * 5.0 + r * 14.0 - t * 3.0) * 0.5 + 0.5;
            float glowAmt = smoothstep(1.0, 0.0, r);
            vec3 col = mix(c * 0.25, c, swirl * glowAmt);
            gl_FragColor = vec4(col, 0.35 + 0.6 * glowAmt);
          }
        `,
      }),
    [],
  )
  useEffect(() => () => mat.dispose(), [mat])

  useFrame((state, dt) => {
    mat.uniforms.t.value = state.clock.elapsedTime
    if (ring.current) ring.current.rotation.z += dt * 0.6
  })

  return (
    <Facing zone={zone}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[3.8, 4.1, 0.4, 8]} />
        <meshStandardMaterial color="#173b3a" flatShading />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.42, 0]}>
        <ringGeometry args={[3.2, 3.45, 48]} />
        <meshBasicMaterial color={glow('#4ade80', 2.2)} toneMapped={false} />
      </mesh>
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} position={[x, 2.6, 0]}>
          <boxGeometry args={[0.45, 5.2, 0.45]} />
          <meshStandardMaterial color="#1f4a47" flatShading />
        </mesh>
      ))}
      <group position={[0, 3.2, 0]}>
        <mesh ref={ring}>
          <torusGeometry args={[3.0, 0.2, 10, 48]} />
          <meshBasicMaterial color={glow('#4ade80', 2.6)} toneMapped={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[2.85, 48]} />
          <primitive object={mat} attach="material" />
        </mesh>
      </group>
      <Sparkles count={40} scale={[7, 7, 3]} position={[0, 3.2, 0]} size={3.5} speed={0.8} color="#9dffc2" />
      <Label text={zone.label} sub={zone.sub} color={zone.color} position={[0, 8.2, 0]} />
    </Facing>
  )
}
