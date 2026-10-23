import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useStore } from '../store'
import { zoneById } from '../world/layout'
import { AboutPanel, ContactPanel, ExperiencePanel, ProjectsPanel, SkillsPanel } from './panels'

const content = {
  about: { title: 'About Me', Body: AboutPanel },
  projects: { title: 'Projects', Body: ProjectsPanel },
  skills: { title: 'Skills', Body: SkillsPanel },
  experience: { title: 'Experience', Body: ExperiencePanel },
  contact: { title: 'Contact', Body: ContactPanel },
}

export default function Panel() {
  const panel = useStore((s) => s.panel)
  const [current, setCurrent] = useState(null) // keeps the panel mounted while it animates out
  const backdrop = useRef()
  const card = useRef()
  const body = useRef()
  const closeBtn = useRef()
  const lastFocus = useRef(null)

  // Accessibility: move focus into the dialog on open and restore it on close.
  useEffect(() => {
    if (panel) {
      if (!lastFocus.current) lastFocus.current = document.activeElement
      closeBtn.current?.focus({ preventScroll: true })
    } else if (lastFocus.current) {
      const el = lastFocus.current
      lastFocus.current = null
      if (el && el.isConnected && typeof el.focus === 'function') el.focus({ preventScroll: true })
    }
  }, [panel, current])

  useEffect(() => {
    if (panel) {
      setCurrent(panel)
    } else if (current && card.current) {
      const tl = gsap.timeline({ onComplete: () => setCurrent(null) })
      tl.to(card.current, { y: 40, opacity: 0, scale: 0.96, duration: 0.25, ease: 'power2.in' }, 0)
      tl.to(backdrop.current, { opacity: 0, duration: 0.25 }, 0)
      return () => tl.kill()
    }
  }, [panel, current])

  useLayoutEffect(() => {
    if (!current || !panel) return
    const ctx = gsap.context(() => {
      gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(card.current, { y: 50, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' })
      gsap.from('.reveal', { y: 24, opacity: 0, stagger: 0.07, duration: 0.5, delay: 0.15, ease: 'power3.out' })
    }, card)
    if (body.current) body.current.scrollTop = 0
    return () => ctx.revert()
  }, [current, panel])

  if (!current) return null

  const { title, Body } = content[current]
  const zone = zoneById[current]

  return (
    <div className="panel-root" role="dialog" aria-modal="true" aria-label={title} style={{ '--accent': zone.color }}>
      <div className="panel-backdrop" ref={backdrop} onClick={() => useStore.getState().closePanel()} />
      <div className="panel-card" ref={card}>
        <header className="panel-head">
          <div>
            <p className="panel-kicker">{zone.sub}</p>
            <h2 className="panel-title">{title}</h2>
          </div>
          <button className="panel-close" ref={closeBtn} onClick={() => useStore.getState().closePanel()} aria-label="Close (Esc)">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="panel-body" ref={body}>
          <Body />
        </div>
        <footer className="panel-foot">Press Esc to return to the world</footer>
      </div>
    </div>
  )
}
