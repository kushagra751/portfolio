import { profile } from '../data'
import { AboutPanel, ContactPanel, ExperiencePanel, ProjectsPanel, SkillsPanel } from './panels'

// Shown only when the browser cannot run WebGL, so the portfolio content is still reachable.
export default function Fallback() {
  const blocks = [
    ['About Me', AboutPanel],
    ['Projects', ProjectsPanel],
    ['Skills', SkillsPanel],
    ['Experience', ExperiencePanel],
    ['Contact', ContactPanel],
  ]
  return (
    <main className="fallback">
      <h1 className="fallback-title">{profile.name}</h1>
      <p className="muted">
        Your browser could not start the 3D world (WebGL is unavailable), so here is the portfolio as a simple page.
      </p>
      {blocks.map(([title, Body]) => (
        <section key={title} className="fallback-block">
          <h2 className="panel-title">{title}</h2>
          <Body />
        </section>
      ))}
    </main>
  )
}
