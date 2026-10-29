# Portfolio enhancements — 28 October 2026

## What changed

- Refreshed the supplied résumé as a one-page PDF with clickable GitHub, LinkedIn and portfolio links. Updated the site's résumé download, current city, education dates, internship details and stated skill levels from that source.
- Added a portrait-led hero with a graph-paper background, retaining the original flagship content in the projects section. The homepage no longer loads the decorative Three.js hero.
- Added an expandable career journey, screenshot/photo gallery with accessible image previews, résumé summary and copy-email shortcut with manual fallback.
- Added a live inventory Decision Lab with EOQ/reorder-point calculations, validation, reset and documented assumptions. These are illustrative calculations, not claimed achievements.
- Added searchable quick navigation with Ctrl/Cmd+K, arrow-key navigation and native dialog focus handling.
- Added a homepage focus explorer for energy, operations and analytics, linking to existing case studies.
- Added browser-local saved projects, a saved-only filter, and safe recovery from malformed or blocked storage.
- Added side-by-side comparison of up to three projects using their existing summaries, methods and evidence, including a scrollable mobile table.
- Added shareable keyword/category URLs and clipboard fallback. Saved choices remain local to the browser.
- Generated a reusable navigation catalog from the existing project archive, with a small maintenance script.
- Refined the homepage hero: tighter typography, a portrait signature, clearer calls to action, a more balanced flagship card and quieter backgrounds.
- Brought the project archive into the same warm Daybook visual system, including light and dark themes.
- Added case-insensitive, multiword project search that combines with category filters, calculates category counts, announces results and offers an empty state and reset action.
- Improved the mobile menu: accurate expanded state; dismissal on link selection, Escape, outside click, focus leaving the navigation and viewport changes; consistent theme/menu order.
- Added skip links, main landmarks, native anchor history and section navigation feedback.
- Made content and mobile navigation available without JavaScript. Animation reveals now enhance otherwise-visible content.
- Corrected stale project counts to 13 distinct archive entries and fixed the archive's Dashboard navigation target.
- Removed an unused Lenis download and bypassed the decorative preloader on the enhanced pages.
- Fixed the existing WebGL hero's out-of-scope animation callback, guarded duplicate loading and kept the renderer paused when the hero or document is hidden.

Project case-study content, downloadable source assets and working tools are preserved. The résumé and homepage career summary were updated from the newly supplied résumé. No new production dependency or build step was introduced.

## Validation

Fifty-nine browser checks passed in Microsoft Edge through Playwright. The original eleven regression checks cover:

1. Mobile menu opens/closes with accurate accessibility state.
2. Escape closes the menu and restores button focus.
3. Outside clicks and desktop resizing close the menu.
4. Search combines with categories and empty results can be reset.
5. Unmatched and empty queries behave correctly.
6. Multiword queries and announced result counts agree.
7. Theme choice persists across navigation.
8. Homepage and archive fit a 360px viewport.
9. Homepage content and mobile navigation remain visible without JavaScript.
10. Touch devices show the content without loading the WebGL hero.
11. No uncaught browser errors occur in the tested interactions.

Fifteen additional checks cover command search and keyboard controls, focus exploration, persistent saves and saved-only filtering, the three-project comparison limit, evidence readability, focus restoration after clearing filtered selections, shared URL restoration, clipboard fallback, malformed and blocked storage, safe unusual queries, mobile dialog/table fit and browser errors.

Eleven career checks cover the updated dates/city/profile links, résumé access, expandable internship, calculator results/reset/invalid inputs/exact rounding/maximum values, same-page command navigation, image-dialog focus, clipboard success/fallback, mobile/dark layout, no-JavaScript content and uncaught errors.

The primary interaction suites block external CDNs to verify graceful fallback. Normal-motion checks with external libraries enabled also completed without uncaught errors. Desktop, mobile, light and dark previews were visually inspected. JavaScript syntax checks passed for changed scripts. All 130 local file/anchor references in the homepage and archive resolved. The new PDF was rendered and visually reviewed; it contains one page and four working PDF link annotations.

An independent review of the career upgrade identified two issues: same-page command links leaving their dialog open and a floating-point reorder rounding edge case. Both were reproduced in browser tests and fixed. This is not a full accessibility certification or an audit of the existing embedded tools' calculations. The 13 case studies now share Studio styling; their data and tools remain intact. The separate cosmic experiment remains unchanged.

## Source and delivery

Original repository: https://github.com/Bala-Shunmugam-M/My-Portfolio

Source archive commit: `53f99d06ee60b620de87dfe7e14a017e166bcb55`.

The repository was downloaded as a source archive after Git clone transfers repeatedly disconnected. This folder does not include Git history. Changes are local; nothing has been pushed or deployed. The accompanying text-source patch can be reviewed or applied against the original source revision; it excludes binary assets, including the résumé replacement and new screenshots. Use the full ZIP to get code, images and the updated PDF.

The distributable ZIP omits the original `cosmic/node_modules` directory; the original experiment's package manifest and lockfile are retained. The full downloaded folder still contains those dependencies.

## Studio transformation

Added a colorful portrait composition, floating navigation, oversized typography, mint/lavender/coral project panels, a keyboard-accessible featured-work carousel, consistent case-study styling, a persistent motion control, scroll progress and back-to-top. Removed overlapping GSAP/Lenis/decorative motion loaders from the redesigned pages. The resume and GitHub integration from the previous update are retained.

Seven additional browser checks cover carousel controls and focus, motion preferences, system reduced motion, back-to-top, no-JavaScript content, all 13 case studies at mobile width and uncaught errors. Independent source review identified carousel focus transfer and motion-preference gaps; these were corrected. Mobile metric overflow and a browser-dependent page-transition error were also fixed. Cross-document experimental transitions were removed; local section and carousel animations remain.

## Atlas enhancement — October 29

Researched Magic UI, React Bits, Magic Portfolio and Motion through their primary GitHub repositories. Original local code applies the resulting design direction: a violet/mint/coral atmosphere, geometric grid, translucent portrait frame, career-route cards, richer project image treatments and short content transitions. `DESIGN-REFERENCES.md` records sources and image provenance. No framework or animation dependency was added.

Added an optional four-chapter introduction, three career evidence panels, recruiter-profile navigation and `profile.html`. The profile includes selected project evidence, the latest résumé, GitHub and contact links, with a one-page A4 print layout. Existing résumé facts and all original case-study data remain intact.

Eight new browser checks cover the guided introduction, chapter links, keyboard focus and Escape, career evidence/images, print action and dark-mode print colors, mobile layout, no-JavaScript fallback, motion preference changes and uncaught errors. All five suites passed (52 checks). Desktop, mobile, dark and print previews were inspected. Independent source review flagged a print specificity issue; the corrected selector and computed print colors were verified. The new energy panel uses an existing generator-protection chart after a missing original screenshot was detected.

## Software projects — October 29–30

Added AI Data Science Workbench, KERNEL-OPS with its companion site, CampusPulse and AetherForge Ops. The portfolio now has 17 case studies and 12 new screenshots taken from running local applications. New pages explain the business problem, workflow, architecture, screenshots, demonstrated behavior and limitations. The homepage introduces all four, the archive supports three new categories, quick navigation indexes them, and the recruiter profile now highlights the ML Workbench.

Seven new checks cover discovery, category counts, save/compare behavior, all screenshot files and zoom dialogs, focus restoration, narrow-screen/dark layouts, no-JavaScript content and runtime errors. All six suites passed (59 checks). Visual inspection corrected thumbnail aspect ratios. Independent source review reported no actionable findings. See `PROJECT-EVIDENCE.md` for app-specific verification and sample-data boundaries.


## InventoryIQ application update

Expanded InventoryIQ into a current application case study with five actual running-app screenshots, a sample order-cycle explanation, GitHub/current app links, screenshot enlargement and documented feature limits. Refreshed all discovery surfaces and consolidated the old case-study URL. Kept the original calculator available as a separate teaching exercise. Seven new checks bring the portfolio total to 66 passing browser checks.
