# Kushagra Patidar | 3D Game Portfolio

A portfolio you **play** instead of scroll. Walk a little robot around a floating night-island, enter five zones (About, Projects, Skills, Experience, Contact), and collect 12 hidden stars along the way.

Built with **React + Three.js (React Three Fiber)**, **GSAP**, and procedural **Web Audio** (no audio files, nothing extra to download).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # preview the production build
```

Requires Node 18+.

## Controls

| Action | Desktop | Phone / tablet |
| --- | --- | --- |
| Move | `W A S D` or arrow keys | Virtual joystick |
| Run | `Shift` | Push the joystick to the edge |
| Enter a zone | `E` or `Enter` | Tap the prompt button |
| Fast travel | `T` | Compass button (top right) |
| Mute / unmute | `M` | Speaker button |
| Close a panel | `Esc` | Close button |

## What is inside

- **Walk-through 3D world**: low-poly island, glowing paths, chase camera, collisions, bloom + vignette + tone mapping.
- **Five zones**: a cottage (About), an arcade (Projects), a crystal garden (Skills), a tower (Experience) and a portal (Contact).
- **Game feel**: floating stars to collect, minimap, fast travel, footstep and UI sounds, generative background music.
- **Animated UI**: GSAP intro, panels, toasts and HUD.
- **Resume download** button (HUD, About and Contact panels).
- **Contact form** (see below).
- **Fast by design**: instanced trees, canvas-drawn signs, blob shadows (no shadow maps), adaptive resolution when the frame rate drops, lighter effects on phones, and a plain-page fallback when WebGL is unavailable.

## Edit your content

Everything you read in the panels comes from one file: [`src/data.js`](src/data.js) (profile, education, certifications, experience, projects, skills). Update it, save, and the site reloads.

Your resume PDF lives at `public/Kushagra_Patidar_Resume.pdf`. Replace the file (keep the name) to update the download.

Zone positions and colours are in [`src/world/layout.js`](src/world/layout.js).

## Contact form

The form works in two modes:

1. **Default**: opens the visitor's email app with the message filled in (to the email in `src/data.js`).
2. **Send directly from the site (optional)**: create a free form at [formspree.io](https://formspree.io), then create a `.env` file:

   ```
   VITE_FORMSPREE_ID=your_form_id
   ```

   Add the same variable in your hosting provider's environment settings.

## Deploy

**Vercel** (easiest): import the GitHub repo, framework preset *Vite*, deploy.

**GitHub Pages**: build with `npm run build` and publish the `dist/` folder (for example with the `gh-pages` package or a GitHub Actions workflow). The build uses relative paths, so it works under any sub-path.

## Project structure

```
src/
  data.js            all portfolio content
  store.js           game/UI state (zustand)
  input.js           keyboard + joystick input
  audio.js           procedural music and sound effects
  world/             3D scene (island, buildings, player, pickups)
  ui/                HUD, intro, panels, joystick, toasts
public/
  Kushagra_Patidar_Resume.pdf
```
