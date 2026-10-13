import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useStore } from '../store'
import { isMobile } from '../utils'
import { zones } from './layout'
import { Cosmos, FloatingRocks, Island, Moon, Paths, Plaza, Sky, Trees, ZoneRing } from './Environment'
import { AboutHouse, ContactPortal, ExperienceTower, ProjectsArcade, SkillsGarden } from './Structures'
import Player from './Player'
import Collectibles from './Collectibles'

// Tells the UI the first frames have rendered so START can be enabled.
function ReadyGate() {
  const frames = useRef(0)
  useFrame(() => {
    if (frames.current < 30 && ++frames.current === 30) useStore.getState().setReady()
  })
  return null
}

function World() {
  return (
    <>
      <color attach="background" args={['#0a0618']} />
      <fog attach="fog" args={['#2a1058', 70, 210]} />

      <hemisphereLight args={['#9db0ff', '#1c0f3d', 0.9]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-30, 55, 25]} intensity={1.5} color="#c9d6ff" />

      <Sky />
      <Moon />
      <Cosmos />
      <FloatingRocks />

      <Island />
      <Plaza />
      <Paths />
      <Trees />
      {zones.map((z) => (
        <ZoneRing key={z.id} zone={z} />
      ))}

      <AboutHouse />
      <ProjectsArcade />
      <SkillsGarden />
      <ExperienceTower />
      <ContactPortal />

      <Collectibles />
      <Player />
      <ReadyGate />
    </>
  )
}

export default function Scene() {
  const [dpr, setDpr] = useState(isMobile ? [1, 1.5] : [1, 2])

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 12.5, 20], fov: 52, near: 0.1, far: 900 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
    >
      {/* if the frame rate drops, quietly lower the resolution */}
      <PerformanceMonitor onDecline={() => setDpr([0.75, 1])} />
      <Suspense fallback={null}>
        <World />
      </Suspense>
      {isMobile ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.05} luminanceThreshold={1} luminanceSmoothing={0.25} radius={0.75} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <SMAA />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={1.05} luminanceThreshold={1} luminanceSmoothing={0.25} radius={0.75} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
