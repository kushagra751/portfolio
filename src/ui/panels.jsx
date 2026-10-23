import { useState } from 'react'
import { certifications, education, experience, profile, projects, skills } from '../data'
import { sfx } from '../audio'

/* small helpers */

function Section({ title, children }) {
  return (
    <section className="reveal panel-section">
      {title && <h3 className="panel-h3">{title}</h3>}
      {children}
    </section>
  )
}

function Chips({ items }) {
  if (!items || !items.length) return null
  return (
    <ul className="chips">
      {items.map((s) => (
        <li key={s} className="chip">
          {s}
        </li>
      ))}
    </ul>
  )
}

function ExternalLinks() {
  return (
    <div className="btn-row">
      <a className="btn btn-primary" href={profile.resume} download="Kushagra_Patidar_Resume.pdf" onClick={() => sfx.click()}>
        Download resume
      </a>
      <a className="btn" href={profile.github} target="_blank" rel="noreferrer noopener">
        GitHub
      </a>
      <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer noopener">
        LinkedIn
      </a>
    </div>
  )
}

/* ------------------------------------------------------------- about */

export function AboutPanel() {
  return (
    <>
      <div className="reveal about-top">
        <div className="avatar" aria-hidden="true">
          KP
        </div>
        <div>
          <h2 className="about-name">{profile.name}</h2>
          <p className="about-role">
            {profile.role} &middot; {profile.headline}
          </p>
        </div>
      </div>

      <Section>
        <p className="lead">{profile.summary}</p>
      </Section>

      <Section title="Education">
        <ul className="timeline">
          {education.map((e) => (
            <li key={e.title} className="timeline-item">
              <span className="timeline-period">{e.period}</span>
              <strong>{e.title}</strong>
              <span className="muted">{e.place}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Certifications">
        <ul className="plain-list">
          {certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>

      <Section>
        <ExternalLinks />
      </Section>
    </>
  )
}

/* ---------------------------------------------------------- projects */

export function ProjectsPanel() {
  return (
    <>
      <p className="reveal lead">A few things I have built. Live demos and source code are linked on each card.</p>
      <div className="cards">
        {projects.map((p) => (
          <article key={p.title} className="reveal card">
            <span className="card-tag">{p.tag}</span>
            <h3 className="card-title">{p.title}</h3>
            <p className="card-text">{p.description}</p>
            {p.features.length > 0 && (
              <ul className="card-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
            <Chips items={p.stack} />
            {p.links.length > 0 && (
              <div className="btn-row">
                {p.links.map((l) => (
                  <a key={l.href} className="btn btn-small" href={l.href} target="_blank" rel="noreferrer noopener">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------ skills */

export function SkillsPanel() {
  return (
    <>
      <p className="reveal lead">The tools and technologies I work with.</p>
      <div className="skill-grid">
        {skills.map((g) => (
          <section key={g.group} className="reveal skill-group">
            <h3 className="panel-h3">{g.group}</h3>
            <Chips items={g.items} />
          </section>
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------- experience */

export function ExperiencePanel() {
  return (
    <>
      {experience.map((job) => (
        <article key={job.company} className="reveal job">
          <div className="job-head">
            <div>
              <h3 className="job-role">{job.role}</h3>
              <p className="job-company">{job.company}</p>
            </div>
            <span className="timeline-period">{job.period}</span>
          </div>
          <ul className="plain-list">
            {job.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <Chips items={job.tech} />
        </article>
      ))}

      <Section title="Education">
        <ul className="timeline">
          {education.map((e) => (
            <li key={e.title} className="timeline-item">
              <span className="timeline-period">{e.period}</span>
              <strong>{e.title}</strong>
              <span className="muted">{e.place}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Certifications">
        <ul className="plain-list">
          {certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>
    </>
  )
}

/* ----------------------------------------------------------- contact */

// Optional: create a free form at https://formspree.io and put its id in .env
//   VITE_FORMSPREE_ID=abcdwxyz
// Without it, the form opens the visitor's email app with the message filled in.
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID

export function ContactPanel() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | mailto

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    sfx.click()

    if (FORMSPREE_ID) {
      setStatus('sending')
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('bad response')
        setStatus('sent')
        setForm({ name: '', email: '', message: '' })
      } catch {
        setStatus('error')
      }
      return
    }

    const subject = encodeURIComponent(`Portfolio message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n- ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setStatus('mailto')
  }

  return (
    <div className="contact-grid">
      <div>
        <p className="reveal lead">Looking for an entry-level Full Stack Developer or Software Engineer? Let us talk.</p>
        <ul className="reveal contact-list">
          <li>
            <span className="muted">Email</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <span className="muted">Phone</span>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
          </li>
          <li>
            <span className="muted">GitHub</span>
            <a href={profile.github} target="_blank" rel="noreferrer noopener">
              github.com/kushagra751
            </a>
          </li>
          <li>
            <span className="muted">LinkedIn</span>
            <a href={profile.linkedin} target="_blank" rel="noreferrer noopener">
              linkedin.com/in/kushagra751
            </a>
          </li>
        </ul>
        <div className="reveal">
          <a className="btn btn-primary" href={profile.resume} download="Kushagra_Patidar_Resume.pdf" onClick={() => sfx.click()}>
            Download resume
          </a>
        </div>
      </div>

      <form className="reveal form" onSubmit={submit}>
        <label>
          <span>Name</span>
          <input required value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />
        </label>
        <label>
          <span>Message</span>
          <textarea required rows={5} value={form.message} onChange={set('message')} placeholder="Say hello..." />
        </label>
        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>
        {status === 'sent' && <p className="form-note ok" role="status">Message sent. Thank you, I will get back to you soon.</p>}
        {status === 'mailto' && <p className="form-note ok" role="status">Your email app should open with the message ready to send.</p>}
        {status === 'error' && (
          <p className="form-note bad" role="alert">
            Could not send right now. Please email me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        )}
      </form>
    </div>
  )
}
