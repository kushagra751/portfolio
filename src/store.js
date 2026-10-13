import { create } from 'zustand'
import { setMuted, sfx } from './audio'

export const TOTAL_STARS = 12

let toastId = 0

export const useStore = create((set, get) => ({
  ready: false, // scene has rendered a few frames
  started: false, // player pressed START
  muted: false,
  near: null, // id of the zone the player is standing in
  panel: null, // id of the open panel
  travelOpen: false,
  stars: 0,
  toast: null,

  setReady: () => set({ ready: true }),
  start: () => set({ started: true }),

  setNear: (id) => {
    if (get().near !== id) set({ near: id })
  },

  openPanel: (id) => {
    if (!id) return
    sfx.open()
    set({ panel: id, travelOpen: false })
  },
  closePanel: () => {
    if (get().panel) {
      sfx.close()
      set({ panel: null })
    }
  },
  interact: () => {
    const { near, panel, started } = get()
    if (!started || panel) return
    if (near) get().openPanel(near)
  },

  toggleTravel: () => {
    if (!get().started || get().panel) return
    sfx.click()
    set({ travelOpen: !get().travelOpen })
  },
  closeTravel: () => set({ travelOpen: false }),

  toggleMute: () => {
    const m = !get().muted
    setMuted(m)
    set({ muted: m })
  },

  showToast: (text) => set({ toast: { id: ++toastId, text } }),

  collectStar: () => {
    const n = get().stars + 1
    set({ stars: n })
    if (n >= TOTAL_STARS) {
      sfx.win()
      get().showToast('All stars collected! You are a legend.')
    } else {
      sfx.collect(n)
      get().showToast(`Star collected  ${n} / ${TOTAL_STARS}`)
    }
  },
}))
