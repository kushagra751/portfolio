import { useEffect, useRef } from 'react'
import { input } from '../input'
import { useStore } from '../store'
import { isTouch } from '../utils'

const RADIUS = 52

// Virtual joystick for phones and tablets.
export default function Touch() {
  const started = useStore((s) => s.started)
  const panel = useStore((s) => s.panel)
  const base = useRef()
  const knob = useRef()
  const pointer = useRef(null)

  // never leave the joystick "held" when it disappears (e.g. a panel opens)
  useEffect(() => {
    if (panel || !started) {
      input.joy.x = 0
      input.joy.y = 0
    }
  }, [panel, started])

  if (!isTouch || !started || panel) return null

  const update = (e) => {
    const rect = base.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = e.clientX - cx
    let dy = e.clientY - cy
    const len = Math.hypot(dx, dy)
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS
      dy = (dy / len) * RADIUS
    }
    knob.current.style.transform = `translate(${dx}px, ${dy}px)`
    input.joy.x = dx / RADIUS
    input.joy.y = -dy / RADIUS
  }

  const down = (e) => {
    pointer.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
    update(e)
  }
  const move = (e) => {
    if (pointer.current === e.pointerId) update(e)
  }
  const end = (e) => {
    if (pointer.current !== e.pointerId) return
    pointer.current = null
    knob.current.style.transform = 'translate(0px, 0px)'
    input.joy.x = 0
    input.joy.y = 0
  }

  return (
    <div
      className="joystick"
      ref={base}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className="joystick-knob" ref={knob} />
    </div>
  )
}
