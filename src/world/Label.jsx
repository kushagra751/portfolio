import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Billboard, Float } from '@react-three/drei'

// A glowing text sign drawn once to a canvas (no font files, no DOM, very cheap).
export default function Label({ text, sub, color = '#ffffff', position = [0, 0, 0], width = 9, float = true }) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 256
    return c
  }, [])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [canvas])

  useEffect(() => {
    let alive = true
    const draw = () => {
      const g = canvas.getContext('2d')
      g.clearRect(0, 0, 1024, 256)
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.font = "800 104px Orbitron, 'Segoe UI', sans-serif"
      g.shadowColor = color
      g.shadowBlur = 30
      g.fillStyle = '#ffffff'
      g.fillText(text, 512, sub ? 98 : 128)
      g.shadowBlur = 0
      if (sub) {
        g.font = "600 46px 'Space Grotesk', 'Segoe UI', sans-serif"
        g.fillStyle = color
        g.fillText(sub.toUpperCase(), 512, 196)
      }
      texture.needsUpdate = true
    }
    draw()
    if (document.fonts && document.fonts.load) {
      document.fonts
        .load('800 104px Orbitron')
        .then(() => alive && draw())
        .catch(() => {})
    }
    return () => {
      alive = false
    }
  }, [text, sub, color, canvas, texture])

  useEffect(() => () => texture.dispose(), [texture])

  const sign = (
    <Billboard>
      <mesh>
        <planeGeometry args={[width, width / 4]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} fog={false} />
      </mesh>
    </Billboard>
  )

  return (
    <group position={position}>
      {float ? (
        <Float speed={2} floatIntensity={0.7} rotationIntensity={0}>
          {sign}
        </Float>
      ) : (
        sign
      )}
    </group>
  )
}
