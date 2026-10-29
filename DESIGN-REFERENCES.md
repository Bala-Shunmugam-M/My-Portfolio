# Atlas design research

Reviewed October 29, 2026 for the owner's request for established GitHub portfolio and animation references.

| Primary reference | Useful direction | Application in this portfolio |
| --- | --- | --- |
| [Magic UI](https://github.com/magicuidesign/magicui) | Animated components and polished interface details | Layered project panels, small hover transitions and a consistent visual rhythm. |
| [React Bits](https://github.com/DavidHDev/react-bits) | Animated backgrounds, text, image effects and interactive components | A softly moving violet/mint/coral atmosphere, geometric grid and more expressive image treatments. |
| [Magic Portfolio / Once UI](https://github.com/once-ui-system/magic-portfolio) | A coherent portfolio system built around personal content and projects | A concise recruiter route, selected evidence and consistent presentation across the homepage, archive and case studies. |
| [Motion](https://github.com/motiondivision/motion) | Gesture, scroll and transition primitives using browser animation capabilities | Short transitions when changing career evidence or introduction chapters, respecting the shared motion preference. |

These repositories informed the design direction. No component source, logos or assets were copied, and none of their libraries was added as a runtime dependency. Atlas uses original HTML/CSS/JavaScript and native browser animation APIs within the existing static site. Research descriptions are not endorsements or affiliations.

## What changed

- A layered hero background, translucent portrait frame, subtle grid and three career-route links.
- An optional four-chapter guided introduction with real career facts, pictures, keyboard controls, focus restoration and direct case-study links. It never advances automatically.
- Three career evidence panels combining a relevant image, narrative, methods and recommended case studies.
- A standalone recruiter profile with résumé, GitHub, selected evidence, contact details and a clean one-page A4 print layout.
- Coordinated background/card refinements on the homepage, archive and 13 case-study pages.

## Images and factual boundaries

All images come from the supplied repository: `assets/bala.jpg`, InventoryIQ/ProcessPilot screenshots, the Agni Steels case-study image, a generator protection chart and a customer clustering chart. Captions identify screenshots and case-study imagery. No stock image is presented as personal work or a visit. Missing WattsWorth screenshot placeholders are not used in the new interface.

Career facts follow the supplied résumé and existing project material. The site does not invent employers, endorsements, performance outcomes or proficiency scores. Example data is labeled as such. The standalone résumé PDF from the previous update remains included.

## Interaction and motion

The existing footer motion control and system reduced-motion preference govern the new effects. Backgrounds animate transforms only; content changes use opacity and translation. Touch users do not need hover or pointer tilt. The profile and core pages remain readable without JavaScript, and links remain ordinary browser navigation. The original standalone tools retain their existing interfaces.
