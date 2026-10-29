# Software project evidence

Four additions were prepared from the owner's local projects and captured in running local applications during October 29–30, 2026. The original project files and operational databases were preserved. Only screenshots and explanatory portfolio pages are included here; the application source, databases, model binaries, environment files and runtime dependencies are not bundled.

| Case study | Captured application | Evidence boundary |
| --- | --- | --- |
| `project-16.html` — AI Data Science Workbench | Dashboard, evaluation diagnostics, trust review | Existing saved public California Housing benchmark artifacts. No new training or upload pipeline was executed for capture. |
| `project-17.html` — KERNEL-OPS | Operations overview, asset telemetry, companion showcase | Read-only shadow demo with stand-in public wind-farm records. Recorded activity does not establish predictive value. |
| `project-18.html` — CampusPulse | Public reporting, staff overview, case queue | Isolated seeded PostgreSQL database with fictional institutions/accounts and simulated reports. Final captured institution has ten reports and nine cases. |
| `project-19.html` — AetherForge Ops | Inventory economics, OEE/SPC, demand forecasting | Running FastAPI service and standalone cockpit over a generated catalogue and synthetic plant. Financial outputs are hypothetical model results. |

## Why AetherForge was selected

It directly connects the owner's operations and engineering interests: inventory policy economics, service-level trade-offs, plant losses, control charts and forecasting. Its working cockpit provides stronger demonstrable operations evidence than a generic additional software listing.

## Screenshot provenance

Twelve screenshots are stored under `assets/shots/workbench/`, `kernel/`, `campus/` and `aether/`. They were captured with a real local browser, not generated as mockups. The CampusPulse development indicator was hidden during capture; application content was not altered. Desktop thumbnails may crop for layout; case-study galleries and full-image links preserve the complete captures.

Kernel Ops telemetry attribution: CARE to Compare, wind farm A — Fraunhofer IEE, https://doi.org/10.3390/data9120138, CC BY-SA 4.0. See `assets/shots/kernel/ATTRIBUTION.md` for the data-derived chart license. No private repository is represented as public source code.

## Verification

The Workbench dashboard/evaluation/trust and Kernel console/site routes returned HTTP 200 in browser capture. The AetherForge API identified its source as a generated demo catalogue with 280 items; all three cockpit views rendered without uncaught browser errors. CampusPulse ran against a newly initialized local PostgreSQL cluster and the refreshed captures show its simulated reporting/case workflow.

The portfolio has 59 passing browser checks, including seven for the new project discovery, categories, saves/comparison, screenshot loading/zoom/focus, mobile/dark layout and no-JavaScript fallback. Existing suites verify the earlier portfolio interactions. These checks are not a full test suite of the four underlying applications. Independent source review found no additional actionable issues; visual review corrected thumbnail sizing before delivery.

Source descriptions and runtime observations are separated on each case-study page. Public source/showcase URLs come from the projects' own metadata; no temporary local app URL is shipped as a public demo link. The portfolio itself remains a static site with no additional production dependency.


## InventoryIQ refresh — 30 October 2026

The existing project-07.html now documents the supplied InventoryIQ application, with five real screenshots in assets/shots/inventory/: manager dashboard, reorder list, forecast, scenario planner and mobile home. Captures ran from an isolated copy of the static web files using the application's built-in 12-product sample basket. No original project files or user store data were changed.

The verified order cycle used Colgate Toothpaste: 25 units on hand, 140 suggested units recorded as incoming, reorder action cleared, then 165 on hand and zero incoming after receipt. The balance persisted after a reload. Both source tests/check.mjs and tests/sync.mjs passed. External service requests were blocked during capture; cloud sync, LLM calls, native Android and PWA installation were not verified. The scenario screen's AI Recommendation is locally constructed text, not an LLM response. Revenue, profit, forecast and scenario values are demo/model outputs, not measured retail results.

The current public app, desktop dashboard and source repository links returned HTTP 200 when checked. The older bundled inventoryiq-app is unchanged and explicitly labeled as an earlier demo on the case study. The original teaching calculator is retained in a disclosure and identified as a simplified model. inventoryiq.html redirects to the maintained case study. Homepage previews, gallery, guided introduction, project archive/search and recruiter profile now describe the current workflow.

All seven portfolio browser suites passed: 66 checks total, including seven new InventoryIQ checks. The local link/anchor audit resolved 395 references. Source review found no actionable issues; desktop/mobile screenshots and all five app captures were visually inspected. Tests cover portfolio integration and a sample local workflow, not every feature of the underlying app.
