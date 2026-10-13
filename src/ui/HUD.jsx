import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore, TOTAL_STARS } from '../store'
import { sfx } from '../audio'
import { isTouch } from '../utils'
import { profile } from '../data'
import { playerState, travelPoint, zones } from '../world/layout'

const MAP_R = 46

function Minimap() {
  const dot = useRef()
  useEffect(() => {
    let raf
    const loop = () => {
      if (dot.current) {
        const p = playerState.pos
        const deg = (-playerState.heading * 180) / Math.PI
        dot.current.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.z.toFixed(2)}) rotate(${deg.toFixed(1)})`)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg className="minimap" viewBox={`${-MAP_R} ${-MAP_R} ${MAP_R * 2} ${MAP_R * 2}`} aria-hidden="true">
      <circle cx="0" cy="0" r="43" className="minimap-bg" />
      <circle cx="0" cy="0" r="6" className="minimap-plaza" />
      {zones.map((z) => (
        <g key={z.id}>
          <line x1="0" y1="0" x2={z.pos[0]} y2={z.pos[2]} stroke={z.color} strokeOpacity="0.25" strokeWidth="1.2" />
          <circle cx={z.pos[0]} cy={z.pos[2]} r="5" fill={z.color} fillOpacity="0.9" />
          <text x={z.pos[0]} y={z.pos[2] + 2.6} textAnchor="middle" className="minimap-letter">
            {z.letter}
          </text>
        </g>
      ))}
      <g ref={dot}>
        <path d="M0,-4.5 L3.2,3.2 L0,1.6 L-3.2,3.2 Z" fill="#ffffff" stroke="#0a0618" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

function TravelMenu() {
  const open = useStore((s) => s.travelOpen)
  const ref = useRef()

  useLayoutEffect(() => {
    if (open && ref.current) {
      gsap.fromTo(ref.current, { y: -10, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' })
      gsap.from(ref.current.querySelectorAll('.travel-item'), { x: 14, opacity: 0, stagger: 0.04, duration: 0.3, delay: 0.05 })
    }
  }, [open])

  if (!open) return null

  const go = (id) => {
    sfx.teleport()
    playerState.teleport = travelPoint(id)
    useStore.getState().closeTravel()
  }

  return (
    <div className="travel" ref={ref}>
      <p className="travel-title">FAST TRAVEL</p>
      <button className="travel-item" onClick={() => go('home')}>
        <span className="travel-dot" style={{ background: '#ffffff' }} />
        Plaza
      </button>
      {zones.map((z) => (
        <button key={z.id} className="travel-item" onClick={() => go(z.id)}>
          <span className="travel-dot" style={{ background: z.color }} />
          {z.label}
        </button>
      ))}
    </div>
  )
}

export default function HUD() {
  const started = useStore((s) => s.started)
  const near = useStore((s) => s.near)
  const panel = useStore((s) => s.panel)
  const stars = useStore((s) => s.stars)
  const muted = useStore((s) => s.muted)
  const prompt = useRef()
  const hint = useRef()

  const zone = near ? zones.find((z) => z.id === near) : null
  const showPrompt = started && zone && !panel

  useLayoutEffect(() => {
    if (showPrompt && prompt.current) {
      gsap.fromTo(prompt.current, { y: 24, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' })
    }
  }, [showPrompt, near])

  // fade the controls hint away after a while
  useEffect(() => {
    if (!started || !hint.current) return
    const tween = gsap.to(hint.current, { opacity: 0, duration: 1, delay: 14 })
    return () => tween.kill()
  }, [started])

  if (!started) return null

  const download = () => sfx.click()

  return (
    <div className="hud">
      <div className="hud-card hud-name">
        <span className="hud-title">{profile.name.toUpperCase()}</span>
        <span className="hud-sub">{profile.role}</span>
        <span className="hud-stars" title="Stars collected">
          <span className="star-icon">&#9733;</span> {stars} / {TOTAL_STARS}
        </span>
      </div>

      <div className="hud-right">
        <div className="hud-buttons">
          <button className="hud-btn" onClick={() => useStore.getState().toggleTravel()} title="Fast travel (T)" aria-label="Fast travel">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M15.5 8.5l-2 5-5 2 2-5z" />
            </svg>
          </button>
          <button className="hud-btn" onClick={() => useStore.getState().toggleMute()} title="Sound (M)" aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4z" />
                <path d="M22 9l-6 6M16 9l6 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4z" />
                <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
              </svg>
            )}
          </button>
          <a className="hud-btn" href={profile.resume} download="Kushagra_Patidar_Resume.pdf" onClick={download} title="Download resume" aria-label="Download resume">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
            </svg>
          </a>
        </div>
        <TravelMenu />
        <Minimap />
      </div>

      {showPrompt && (
        <button
          className="prompt"
          ref={prompt}
          style={{ '--accent': zone.color }}
          onClick={() => useStore.getState().openPanel(zone.id)}
        >
          <span className="prompt-key">{isTouch ? 'TAP' : 'E'}</span>
          <span className="prompt-text">
            Enter <strong>{zone.label}</strong>
          </span>
        </button>
      )}

      {!isTouch && (
        <div className="controls-hint" ref={hint}>
          <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd> move &nbsp;&middot;&nbsp; <kbd>Shift</kbd> run &nbsp;&middot;&nbsp; <kbd>E</kbd> interact &nbsp;&middot;&nbsp; <kbd>T</kbd> travel
        </div>
      )}
    </div>
  )
}
