import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '../store'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  const el = useRef()

  useEffect(() => {
    if (!toast || !el.current) return
    const node = el.current
    gsap.killTweensOf(node)
    gsap.fromTo(
      node,
      { y: -20, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' },
    )
    const out = gsap.to(node, { y: -14, opacity: 0, duration: 0.4, delay: 2.2, ease: 'power2.in' })
    return () => out.kill()
  }, [toast])

  return (
    <div className="toast" ref={el} role="status" aria-live="polite" style={{ opacity: 0 }}>
      {toast ? toast.text : ''}
    </div>
  )
}
