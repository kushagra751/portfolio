import { useEffect } from 'react'
import Scene from './world/Scene'
import Intro from './ui/Intro'
import HUD from './ui/HUD'
import Panel from './ui/Panel'
import Touch from './ui/Touch'
import Toast from './ui/Toast'
import Fallback from './ui/Fallback'
import { setupInput } from './input'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const webgl = hasWebGL()

export default function App() {
  useEffect(() => setupInput(), [])

  if (!webgl) return <Fallback />

  return (
    <>
      <div className="canvas-wrap">
        <Scene />
      </div>
      <HUD />
      <Touch />
      <Toast />
      <Panel />
      <Intro />
    </>
  )
}
