# Portfolio — working agreement (motion upgrade)

This is a STATIC HTML/CSS/JS site ("Daybook v3"). **Do not** introduce React,
Next.js, a bundler, or a build step. Motion is **progressive enhancement only**.
The locked visual contract is `design.md` (read it — especially Amendment v4
"Daybook in motion"). `tokens.css` is the single source of truth for colour,
type, spacing and easing — never hard-code values that a token exists for.

## Hard rules (non-negotiable)
- Preserve all existing content, copy, links, and project data **exactly**.
- Animate **only `transform` and `opacity`**. Never animate layout properties
  (width/height/top/left/margin) — use `scaleX`/`translate` instead.
- Throttle every `mousemove` / `scroll` handler through `requestAnimationFrame`.
- Every motion effect ships a `prefers-reduced-motion: reduce` fallback that
  renders the final, static state.
- Disable custom cursor, parallax, tilt and magnetic effects on **touch devices**
  (`(hover: none)` / `(pointer: coarse)`) — replace with scroll-reveal only.
- Hover-only info must also be reachable on keyboard **focus** and **tap**.
- `defer` all scripts; **lazy-load** the heavy 3D asset; never block first paint.
  The Three.js hero must fall back to the existing SVG if WebGL/JS is unavailable.
- Keep the accent (ultramarine) ≤ 5% of any viewport; one ultramarine band per page.

## Libraries (CDN, no bundler)
- **GSAP + ScrollTrigger** — scroll-driven animation
- **Lenis** — smooth/inertia scroll (wire ScrollTrigger to Lenis; keep anchor-nav
  working via `lenis.scrollTo`; keep the existing nav theme-switch in `redesign.js`
  functioning by updating ScrollTrigger on Lenis scroll)
- **Three.js** — the single signature hero centerpiece only (Phase B), lazy-loaded
- Custom cursor / magnetic buttons / tilt / scroll-progress: **hand-rolled vanilla**

## Architecture
- Global motion lives in `css/motion.css` + `js/motion.js` (one shared layer,
  included on every page). Per-section/hero code goes in its own file (e.g.
  `js/hero.js`). Keep new CSS scoped; do not rewrite `redesign.css` or `tokens.css`.
- `redesign.js` (existing reveals, count-up, ticker, nav theme-switch, sticky rail)
  must keep working — `motion.js` augments, it does not replace.

## Workflow
- One phase per change. Smallest safe diff. Show the diff and a test checklist
  (desktop · mobile/touch · reduced-motion · keyboard) before moving on.
- Phases: A Foundation → B Hero → C Projects → D About/Field/Insights →
  E site-wide propagation → F polish (incl. dark mode) → G hardening.
