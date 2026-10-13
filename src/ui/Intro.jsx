import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useStore } from '../store'
import { initAudio, sfx } from '../audio'
import { isTouch } from '../utils'
import { profile } from '../data'

export default function Intro() {
  const ready = useStore((s) => s.ready)
  const [hidden, setHidden] = useState(false)
  const root = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.intro-letter', { y: 70, opacity: 0, rotateX: -80, stagger: 0.04, duration: 0.9, ease: 'back.out(1.8)' })
        .from('.intro-role', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.intro-hint', { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.3')
        .from('.intro-start', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
      gsap.to('.intro-glow', { scale: 1.15, opacity: 0.9, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, root)
    return () => ctx.revert()
  }, [])

  if (hidden) return null

  const start = () => {
    if (!ready) return
    initAudio()
    sfx.open()
    useStore.getState().start()
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => setHidden(true),
    })
  }

  const letters = profile.name.toUpperCase().split('')

  return (
    <div className="intro" ref={root}>
      <div className="intro-glow" />
      <div className="intro-inner">
        <p className="intro-kicker">PLAYER ONE</p>
        <h1 className="intro-title" aria-label={profile.name}>
          {letters.map((ch, i) => (
            <span key={i} className="intro-letter" aria-hidden="true">
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h1>
        <p className="intro-role">{profile.role} &middot; Interactive 3D Portfolio</p>

        <ul className="intro-hints">
          {isTouch ? (
            <>
              <li className="intro-hint">Drag the joystick to walk</li>
              <li className="intro-hint">Tap the button that appears to enter a zone</li>
            </>
          ) : (
            <>
              <li className="intro-hint">
                <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> or arrows to walk, <kbd>Shift</kbd> to run
              </li>
              <li className="intro-hint">
                <kbd>E</kbd> to enter a zone, <kbd>T</kbd> to fast travel, <kbd>M</kbd> for sound
              </li>
            </>
          )}
          <li className="intro-hint">Find all 12 floating stars</li>
        </ul>

        <button className="intro-start" onClick={start} disabled={!ready}>
          {ready ? 'PRESS START' : 'LOADING WORLD...'}
        </button>
      </div>
    </div>
  )
}
