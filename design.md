# Design — Bala Shunmugam. M · MBA Operations & Business Analytics

A locked design system for this portfolio. Every page redesign reads this file
before emitting code. Do not regenerate per page — extend or amend it.

> **Amendment 2026-06-10 (v2 — "Daybook"):** theme changed from Foundry (bone
> paper / graphite / ember, dark control-room bands) to Daybook (butter-cream
> paper / graphite-blue ink / ultramarine accent, one ultramarine band) at the
> owner's request: lighter, warmer, more distinctive. Positioning reframed
> MBA-first. Wordmark is now **"Bala Shunmugam. M"**.
>
> **Amendment 2026-06-10 (v3 — "Daybook colorful"):** at the owner's direction
> (reference screenshot + motionsites.ai + Pinterest aesthetic-portfolio moodboard):
> display type back to **Fraunces** (the pointed-at reference style; colors stay light),
> body Inter Tight; an **art-hue palette** (coral / teal / violet / gold) scoped strictly
> to illustration panels, tags and journey markers — never body text; the "— LABEL"
> mono eyebrow above section heads is an owner-approved house style; motion set expanded:
> competency ticker marquee (hover-pause, off under reduced-motion), rise+blur reveals,
> bar-grow charts, hover art-zoom. Section order restored from the v1 overlay layout
> (hero+featured card → ticker → about+journey → projects → analytics → tools → field → insights → contact band).
>
> **Amendment 2026-06-19 (v4 — "Daybook in motion"):** at the owner's direction
> (landonorris.com energy reference + walkthrough video), the motion ban is
> *selectively* lifted. The site keeps the light editorial Daybook look but gains a
> reactive layer. **Now allowed (was banned):** a restrained custom cursor + magnetic
> buttons; subtle cursor-parallax / tilt on hero art and cards; a single signature
> interactive hero centerpiece (Three.js WebGL, on-brand, lazy-loaded, with the
> existing SVG as fallback); scroll-driven sequences via GSAP ScrollTrigger + Lenis
> smooth scroll; a thin scroll-progress hairline; optional opt-in hover/click sound
> (off by default). **Non-negotiable guardrails (unchanged):** animate transform/opacity
> only; rAF-throttle every mousemove/scroll handler; everything renders complete &
> static under `prefers-reduced-motion`; cursor / parallax / tilt / magnetic effects
> disabled on touch devices; defer all scripts and never block first paint on the
> heavy 3D asset; preserve all existing copy, links and data exactly. Accent still
> ≤5% of any viewport; one ultramarine band per page.

## Positioning
MBA Operations & Business Analytics portfolio. The site must communicate:
*this MBA candidate turns plant problems into business decisions — and ships
working tools, not slide decks.* Engineering core is the differentiator, the
MBA lens is the headline. Not a developer portfolio, not a SaaS template.

## Genre
Editorial, warm and light — a "daybook / ledger" treatment: graph-paper
textures, hairline rules, mono data labels, one deep-ultramarine ink moment
per page.

## Macrostructure family
- Home:        Marquee Hero (light) → scroll-driven project narrative (sticky rail showcase)
- Case study:  Long Document (meta rail + problem → approach → impact → limitations)
- Index/util:  Index-First (the four flagships as a ranked list)

## Theme — "Daybook"
Butter-cream paper · graphite-blue ink · single ultramarine accent. **One**
deep-ultramarine band per page maximum (the proof/field moment); footer chrome
may also sit on the band. Gold (`--color-accent-band`) is the accent *on* the
band only. Accent ≤ 5% of any viewport.

Canonical values live in `tokens.css` (see Exports below).

## Typography
- Display: Fraunces — 400/500; italic for emphasis and accent words; tracking −0.02em at display sizes.
- Body:    Inter Tight — 400 / 500 / 600.
- Mono:    JetBrains Mono — 400 / 500 / 600, uppercase labels & data, letter-spacing 0.08em.
- Scale anchor: `--text-display` = clamp(3rem, 8.5vw, 8rem).
- Eyebrows: "— LABEL" mono caps above section heads (owner house style), always stacked vertical.

## Spacing
4-point named scale in tokens.css. Pages reference `var(--space-*)`, never raw values.

## Motion
- Easings: `--ease-out` cubic-bezier(0.16,1,0.3,1); `--ease-in` cubic-bezier(0.7,0,0.84,0); `--ease-in-out` cubic-bezier(0.65,0,0.35,1).
- Reveal: one orchestrated hero entrance (staggered rise + ink-draw underline on the accent word); reveal-once fade + 10px rise elsewhere.
- Signature: scroll-synced sticky project rail; in-view count-up on real metrics only.
- v3 set (owner-directed, motionsites.ai reference): hero stagger + ink-draw ·
  reveal-once (rise + soft blur) · count-up on real metrics · bar-grow on chart reveal ·
  one competency ticker marquee (36s linear, pauses on hover) · hover art-zoom + card lift.
- Still banned: bounce easings, autoplaying media, pulsing dots, animating layout properties. (v4 lifted the parallax + custom-cursor ban, under guardrails — see Amendment 2026-06-19.)
- Reduced motion: everything renders complete and static; the ticker becomes a scrollable strip.

## Microinteractions stance
Silent success. Hover delay 800ms / focus delay 0ms. Accent underline draw on link hover.
Animate transform/opacity only. No bounce. (v4: custom cursor + cursor-parallax now permitted under guardrails — see Amendment 2026-06-19.)

## CTA voice
- Primary: solid ultramarine fill, pill shape (`--radius-pill`), mono uppercase label, arrow glyph.
- Secondary: ink hairline outline, same pill shape.

## Honest-copy rule
No invented metrics. Real numbers only (WattsWorth, InventoryIQ, Agni Steels, VGTPS).
Mark any unknown status/metric as "to confirm". Keep all field-data caveats —
they are a credibility asset, not a weakness.

## What pages MUST share
Wordmark ("Bala Shunmugam. M") · ultramarine accent + placement · Instrument
Serif/Instrument Sans/JetBrains Mono · CTA voice · section rhythm (display head
with italic emphasis + short accent rule above; mono kicker reserved for
genuinely ordinal moments, max 1–2 per page, always stacked above the head —
never a tag-left/heading-right two-column head).

## What pages MAY differ on
Macrostructure within the family · hero archetype · whether the ultramarine band is used.

## Exports

### tokens.css
```css
:root{
  --color-paper:oklch(97% 0.02 100);--color-paper-2:oklch(94% 0.03 100);--color-paper-3:oklch(91% 0.035 98);
  --color-ink:oklch(26% 0.02 264);--color-ink-2:oklch(43% 0.02 264);--color-ink-3:oklch(50% 0.018 264);
  --color-band:oklch(34% 0.085 264);--color-band-2:oklch(39% 0.09 264);
  --color-on-band:oklch(96.5% 0.02 100);--color-on-band-2:oklch(82% 0.04 255);
  --color-rule:oklch(88% 0.025 100);--color-rule-2:oklch(81% 0.03 100);--color-rule-band:oklch(46% 0.07 264);
  --color-accent:oklch(46% 0.19 264);--color-accent-band:oklch(85% 0.12 95);
  --color-accent-soft:oklch(92% 0.05 264);--color-accent-ink:oklch(98% 0.01 100);
  --color-focus:oklch(46% 0.19 264);
  --font-display:"Instrument Serif",Georgia,serif;--font-body:"Instrument Sans",system-ui,sans-serif;--font-mono:"JetBrains Mono",ui-monospace,monospace;
  --space-3xs:.25rem;--space-2xs:.5rem;--space-xs:.75rem;--space-sm:1rem;--space-md:1.5rem;--space-lg:2rem;--space-xl:3rem;--space-2xl:4.5rem;--space-3xl:7rem;--space-4xl:10rem;
  --text-display:clamp(3rem,8.5vw,8rem);--ease-out:cubic-bezier(0.16,1,0.3,1);--ease-in:cubic-bezier(0.7,0,0.84,0);--ease-in-out:cubic-bezier(0.65,0,0.35,1);
  --dur-micro:120ms;--dur-short:220ms;--dur-long:420ms;--radius:12px;--radius-pill:999px;
}
```
