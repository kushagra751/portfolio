import { useStore } from './store'

// Shared, non-reactive input state (read every frame by the player).
export const input = {
  keys: { up: false, down: false, left: false, right: false, run: false },
  joy: { x: 0, y: 0 },
}

const keyMap = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'run',
  ShiftRight: 'run',
}

function isTyping(target) {
  if (!target) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function setupInput() {
  const down = (e) => {
    const store = useStore.getState()

    if (e.code === 'Escape') {
      if (store.panel) store.closePanel()
      else if (store.travelOpen) store.closeTravel()
      return
    }
    if (isTyping(e.target)) return

    const k = keyMap[e.code]
    if (k) {
      input.keys[k] = true
      if (e.code.startsWith('Arrow')) e.preventDefault()
      return
    }
    if (e.repeat) return
    if (e.code === 'KeyE' || e.code === 'Enter') store.interact()
    else if (e.code === 'KeyM') store.toggleMute()
    else if (e.code === 'KeyT') store.toggleTravel()
  }

  const up = (e) => {
    const k = keyMap[e.code]
    if (k) input.keys[k] = false
  }

  const reset = () => {
    Object.keys(input.keys).forEach((k) => (input.keys[k] = false))
    input.joy.x = 0
    input.joy.y = 0
  }

  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  window.addEventListener('blur', reset)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
    window.removeEventListener('blur', reset)
  }
}

// Writes the combined move vector into `out` (x: right, y: forward, both -1..1).
export function readMove(out) {
  const k = input.keys
  let x = (k.right ? 1 : 0) - (k.left ? 1 : 0) + input.joy.x
  let y = (k.up ? 1 : 0) - (k.down ? 1 : 0) + input.joy.y
  const len = Math.hypot(x, y)
  if (len > 1) {
    x /= len
    y /= len
  }
  out.x = x
  out.y = y
  out.run = k.run || Math.hypot(input.joy.x, input.joy.y) > 0.9
}
