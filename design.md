# Design — Bala Shunmugam M · Operations & Industrial Intelligence

A locked design system for this portfolio. Every page redesign reads this file
before emitting code. Do not regenerate per page — extend or amend it.

## Positioning
Operations & Industrial Intelligence Professional. The site must communicate:
*this person builds decision systems for industrial operations* — manufacturing,
quality systems, inventory optimisation, industrial analytics. Not a developer
portfolio, not a SaaS template.

## Genre
Editorial, with an industrial-intelligence treatment (data clarity borrowed from
the modern-minimal / Palantir school for metric moments only).

## Macrostructure family
- Home:        Marquee Hero → scroll-driven project narrative (sticky rail showcase)
- Case study:  Long Document (meta rail + problem → approach → impact → limitations)
- Index/util:  Index-First (the four flagships as a ranked list)

## Theme — "Foundry"
Cool bone paper · graphite ink · single ember accent. Two dark "control-room"
bands per page maximum (hero + one proof band). Accent ≤ 5% of any viewport.

- `--color-paper`        oklch(96.5% 0.004 75)   /* cool bone */
- `--color-paper-2`      oklch(93.5% 0.005 75)   /* alt band */
- `--color-ink`          oklch(24% 0.010 55)     /* near-black graphite text */
- `--color-ink-2`        oklch(42% 0.010 55)
- `--color-ink-3`        oklch(58% 0.008 55)
- `--color-band`         oklch(20% 0.012 60)     /* dark control-room band */
- `--color-on-band`      oklch(95% 0.004 75)
- `--color-on-band-2`    oklch(72% 0.008 60)
- `--color-rule`         oklch(87% 0.006 70)
- `--color-rule-band`    oklch(34% 0.012 60)
- `--color-accent`       oklch(57% 0.15 45)      /* industrial ember */
- `--color-accent-band`  oklch(66% 0.14 50)      /* ember on dark */
- `--color-accent-ink`   oklch(98% 0.010 80)
- `--color-focus`        oklch(57% 0.15 45)

## Typography
- Display: Fraunces — 300 for large headlines, 500/600 for emphasis; italic on accent words; tracking −0.02em at display sizes.
- Body:    Inter Tight — 400 / 450 / 500.
- Mono:    JetBrains Mono — 400 / 500, uppercase labels & data, letter-spacing 0.08em.
- Scale anchor: `--text-display` = clamp(3rem, 9vw, 8.5rem).

## Spacing
4-point named scale in tokens.css. Pages reference `var(--space-*)`, never raw values.

## Motion
- Easings: `--ease-out` cubic-bezier(0.16,1,0.3,1); `--ease-in` cubic-bezier(0.7,0,0.84,0); `--ease-in-out` cubic-bezier(0.65,0,0.35,1).
- Reveal: one orchestrated hero entrance; reveal-once fade + 10px rise elsewhere.
- Signature: scroll-synced sticky project rail; in-view count-up on real metrics only.
- Hard cap: ≤ 3 motion primitives per page (reveal-once · count-up · underline-draw).
  No ambient infinite loops — no pulsing dots, no nudging arrows. *(Amended 2026-06-10.)*
- Reduced motion: opacity-only, ≤ 150ms.

## Microinteractions stance
Silent success. Hover delay 800ms / focus delay 0ms. Accent underline draw on link hover.
Animate transform/opacity only. No parallax, no custom cursor, no bounce.

## CTA voice
- Primary: solid ember fill, 2px radius, mono label, arrow glyph.
- Secondary: ink hairline outline, same shape.

## Honest-copy rule
No invented metrics. Real numbers only (InventoryIQ, Agni Steels, VGTPS). For
ProcessPilot AI and Six Sigma Workbench, lead with real capability sets; mark any
unknown status/metric as "to confirm". Keep all field-data caveats — they are a
credibility asset, not a weakness.

## What pages MUST share
Wordmark · ember accent + placement · Fraunces/Inter Tight/JetBrains Mono · CTA
voice · section rhythm (display head with italic emphasis; mono kicker reserved
for genuinely ordinal moments, max 1–2 per page, always stacked above the head —
never a tag-left/heading-right two-column head). *(Amended 2026-06-10: numbered
kickers on every section read as templated chaptering.)*

## What pages MAY differ on
Macrostructure within the family · hero archetype · whether a dark band is used.
```

## Exports

### tokens.css
```css
:root{
  --color-paper:oklch(96.5% 0.004 75);--color-paper-2:oklch(93.5% 0.005 75);
  --color-ink:oklch(24% 0.010 55);--color-ink-2:oklch(42% 0.010 55);--color-ink-3:oklch(58% 0.008 55);
  --color-band:oklch(20% 0.012 60);--color-on-band:oklch(95% 0.004 75);--color-on-band-2:oklch(72% 0.008 60);
  --color-rule:oklch(87% 0.006 70);--color-rule-band:oklch(34% 0.012 60);
  --color-accent:oklch(57% 0.15 45);--color-accent-band:oklch(66% 0.14 50);--color-accent-ink:oklch(98% 0.010 80);
  --color-focus:oklch(57% 0.15 45);
  --font-display:"Fraunces",Georgia,serif;--font-body:"Inter Tight",system-ui,sans-serif;--font-mono:"JetBrains Mono",ui-monospace,monospace;
  --space-3xs:.25rem;--space-2xs:.5rem;--space-xs:.75rem;--space-sm:1rem;--space-md:1.5rem;--space-lg:2rem;--space-xl:3rem;--space-2xl:4.5rem;--space-3xl:7rem;--space-4xl:10rem;
  --text-display:clamp(3rem,9vw,8.5rem);--ease-out:cubic-bezier(0.16,1,0.3,1);--ease-in:cubic-bezier(0.7,0,0.84,0);--ease-in-out:cubic-bezier(0.65,0,0.35,1);
  --dur-micro:120ms;--dur-short:220ms;--dur-long:420ms;--radius:2px;
}
```
