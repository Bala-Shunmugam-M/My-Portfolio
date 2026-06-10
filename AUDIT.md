# Hallmark audit — index.html ("Cosmic edition v3.1")

Audited 2026-06-10 against the locked design system in `design.md` ("Foundry", 29 May)
and the Hallmark anti-pattern catalogue. Grounded in rendered screenshots at desktop
(1280×860) and mobile (375×812) plus a full code read.

**Context that frames everything below:** this project is *system-managed* — `design.md`
defines an editorial "Foundry" identity (cool bone paper, graphite ink, single ember
accent, Fraunces + Inter Tight + JetBrains Mono). The live page is the polar opposite
of its own locked system. The copy, however, is genuinely strong — real numbers, honest
caveats, a distinctive "it said no" story. The words are good; the dress is template.

---

## Critical (ships as slop)

1. **Design-system drift** — entire file.
   The page ignores every axis of `design.md`: dark cosmic theme vs. bone paper, Inter-only
   vs. Fraunces display, triple accent (cyan/violet/teal) vs. single ember, 18px glass cards
   vs. 2px-radius hairline editorial. Per-page freestyle on a system-managed project.
   → Rebuild the visual layer on the Foundry tokens already present in `tokens.css` / `css/redesign.css`.

2. **The gradient headline** — `.grad-text` def L52–55; used on the H1 (L179) and on *every*
   section H2 (L220, 253, 384, 435, 474, 528, 557) plus stat numbers.
   `background-clip:text` cyan→violet is the single fastest "AI generated" signal.
   → Solid ink. Emphasis via the display face's italic, not a gradient fill.

3. **Inter-everywhere** — L10, L28–31. Inter is both display and body; JetBrains Mono only
   labels. A one-font page is a template page.
   → Fraunces display + Inter Tight body per design.md.

4. **The AI nav** — L137–165. Wordmark hard-left, six inline links, CTA button hard-right,
   sticky full-width glass bar with hairline border. The most-recognised AI nav fingerprint.
   → N9 edge-aligned minimal (already implemented in `css/redesign.css`).

5. **The AI footer** — L569–600. Link columns ("Sitemap" / "Direct links") + faint top border
   + tiny copyright tail. Genre-blind SaaS footer.
   → Ft1 mast-headed footer (already implemented in `css/redesign.css`).

6. **Cosmic decoration with no semantic role** — `.cosmic-bg` radial blooms L40–47 +
   animated starfield canvas L48, L134, L637–660. Aurora/floating-orb family; the declared
   genre (editorial) treats radial blooms as a hard tell. A starfield says nothing about
   industrial operations.
   → Cut. The "control-room band" in design.md is the legitimate dark moment.

7. **Card-in-card** — InventoryIQ card containing a bordered SKU micro-panel L304–313;
   flagship card containing meter panels L278–283. Visual nesting without semantic reason.
   → One containment layer; data panels become flat editorial asides with hairline rules.

8. **Templated structural fingerprint** — the identical section-head pattern (eyebrow +
   gradient H2 + right-meta) repeated six times (L217–223, 250–256, 432–438, 471–477,
   525–531); equal-card grids everywhere (3-col insights L533–549, 4-col analytics L388–420);
   uniform rhythm. Reads as one component stamped down a page.
   → design.md's home macrostructure: Marquee Hero + scroll-driven sticky-rail project
   narrative, with a ranked flagship hierarchy instead of a card dump.

## Major (looks AI-generated)

9. **Eyebrow on every section** — `.eyebrow` def L87–88; ~12 instances (L171–172, 199, 219,
   234, 252, 383, 434, 443, 452, 473, 527, 556), numbered "01—06" plus a "02B". When every
   section is chaptered, none is. → Cap at 1–2, stacked vertical, only where ordinal.

10. **Shadow-glow on dark** — cyan halos on card hover (L67, L100) and buttons (L80–83).
    → Elevation via lightness on dark surfaces; tight dark shadows if any.

11. **Animate-on-scroll on everything** — `.reveal` on nearly every block + stagger
    (L94–95, L617–634) + hero entrance (L108–117). The page never settles.
    → One orchestrated hero entrance; everything else is just there.

12. **Universal hover mega-lift** — projects/tools cards fire four signals at once:
    -14px lift + 1.015 scale + glow + tag scale (L98–106). → One signal per element.

13. **`transition: all`** — `.btn` L79. → Name the properties.

14. **Generic emoji as icons** — 🎓 ⚡ 🏭 📊 journey timeline L236–240; ✉ ☎ contact L560–561;
    ★ in eyebrows. OS-rendered, breaks the typographic voice. → Typographic labels or one
    SVG stroke set.

15. **Decorative meters quantifying nothing** — `bar-fill` widths (100%/62%/95%/78%…) on
    L279–283, 308–312, 491–497 present qualitative ranks as measured data. The honest
    captions ("shift in-charge estimate · not logged") partially redeem the Pareto block —
    keep those captions, lose the fake precision of pixel-width bars.

16. **Full-viewport hero** — `min-h-screen` L168. → Hero takes the height of its content.

17. **No `:focus-visible` anywhere** — keyboard users get no focus indication on nav, cards,
    or buttons. → Visible instant ring at ≥3:1 on every interactive element.

18. **Missing system reference** — no Hallmark stamp; on a `design.md`-managed project every
    page must declare its allegiance to the system.

## Minor (small taste issues)

19. **Every section padded the same** — `py-28 md:py-36` ×6 (L215, 248, 380, 430, 469, 523).
20. **Tailwind CDN at runtime** (L11) — browser-JIT in production: FOUC + slow LCP + 300 KB JS.
21. **`overflow-x-hidden` band-aid** on body (L131) — masks layout bugs; prefer `clip` + fixing the cause.
22. **Glassmorphism nav** (L50) — borderline-purposeful here; on the Foundry system it goes away anyway.

## What is genuinely good (keep in the rebuild)

- The copy: "Plant floor to P&L", "it said no" (refusing to over-certify), "Not just
  reports. Working tools.", the three Insights — distinctive, specific, human.
- Honest-metric discipline: real numbers with caveats ("operator estimate, not logged").
  design.md codifies this; preserve every caveat.
- `prefers-reduced-motion` is handled (L111–119, 617, 659).
- No horizontal scroll at 375px; mobile menu works.
- Real, deep content: 13 project pages, two live tools, a real flagship (WattsWorth).

---

**Summary — 8 critical · 10 major · 4 minor**
**Verdict — ships as slop** (visually: the cosmic/glass/gradient family is the
most-recognised AI template of all; structurally: one card component stamped down the
page). The fix is already specified by the project's own `design.md` — rebuild the home
page on the Foundry system with the current 6-June content (WattsWorth flagship first).
