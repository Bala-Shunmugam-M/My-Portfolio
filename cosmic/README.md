# Portfolio Cosmic — Bala Shunmugam M

A single-page dark "cosmic" portfolio built with **React + Vite + TypeScript + Tailwind CSS + GSAP + Framer Motion + hls.js**.

## Run it

```bash
cd cosmic
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

A pre-built `dist/` is already included if you just want to deploy the static output.

## Structure

- `src/App.tsx` — page assembly + loading-screen gate
- `src/components/`
  - `LoadingScreen.tsx` — 000→100 counter, rotating words, gradient progress bar
  - `Navbar.tsx` — floating pill nav with gradient logo ring + "Say hi"
  - `Hero.tsx` — HLS background video, GSAP entrance, cycling role line
  - `About.tsx` — "An unusual bridge" + education / plant exposure / target companies
  - `SelectedWorks.tsx` — bento grid: InventoryIQ, VGTPS, Relay Coordination, Agni Steels, Motor Audit, R/Python
  - `Tools.tsx` — InventoryIQ + Six Sigma Workbench
  - `Insights.tsx` — three plant-floor learnings
  - `Stats.tsx` — headline numbers
  - `Contact.tsx` — flipped HLS video, GSAP marquee, résumé download, footer

## Design system

- Fonts: Inter (body) + Instrument Serif italic (display)
- Forced dark theme via HSL CSS variables (`--bg`, `--surface`, `--text`, `--muted`, `--stroke`, `--accent`)
- Accent gradient: `linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)`
- Custom keyframes: `scroll-down`, `role-fade-in`, `gradient-shift`

## Notes

- Project cards and the résumé link point to your existing files in the parent folder
  (e.g. `../inventoryiq.html`, `../six-sigma-workbench.html`, `../Bala_Shunmugam_resume.pdf`).
  Keep `cosmic/` as a subfolder of your portfolio for those links to resolve, or update the
  `href`s in the components.
- The background video uses the template's Mux HLS stream. Swap `HLS_SRC` in `Hero.tsx`
  and `Contact.tsx` to use your own footage.
