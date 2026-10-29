# Bala Shunmugam M — Portfolio

MBA Operations & Business Analytics · Plant Floor to P&L

A static portfolio with 17 distinct project case studies, operations tools, analytics coursework and field studies. The two legacy pages `project-01.html` and `project-03.html` redirect into merged studies.

## Preview locally

From this directory, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000 in a browser. There is no production build step and no production package installation required. The separate `cosmic/` experiment is not required to serve the main portfolio.

## Main files

- `index.html`: homepage, featured work, experience and contact details.
- `projects.html`: searchable project archive with category filters, saved projects, comparison and shareable searches.
- `project-02.html` through `project-15.html`: case studies (with the legacy redirects noted above).
- `inventoryiq-app/`, `processpilot.html`, `six-sigma-workbench.html`: working tools.
- `tokens.css`: shared Daybook design tokens and light/dark themes.
- `css/enhancements.css`: scoped homepage and archive refinements.
- `js/redesign.js`: accessible navigation, section tracking, reveals and counters.
- `css/interactive.css`: focus explorer, quick navigation, saved controls and comparison styling.
- `js/interactive.js`: searchable quick navigation (Ctrl/Cmd+K) and the homepage focus explorer.
- `js/projects.js`: archive search, local saves, comparison, URL state and clipboard fallback.
- `js/project-catalog.js`: generated project metadata used by navigation and the explorer.
- `css/career.css`, `js/career.js`: portrait-led layout, image previews, contact copying and the inventory decision example.
- `Bala_Shunmugam_resume.pdf`: downloadable résumé.

## Hosting

Serve the repository root with any static host. For GitHub Pages, choose the branch containing these changes and the repository root in the Pages settings. Keep relative paths and the directory structure intact.

Google Fonts and optional animation libraries load from CDNs. Content, navigation and project filtering work if those external resources are unavailable; the local scripts are still required for interactive features. With JavaScript disabled, the homepage content, navigation and all project cards remain accessible.

## Browser checks

The optional regression checks use Playwright; it is a development tool only:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/browser-check.cjs
node tests/interactive-check.cjs
node tests/career-check.cjs
node tests/studio-check.cjs
node tests/atlas-check.cjs
node tests/software-check.cjs
```

Keep the local server running on port 8000 in another terminal. Override `PORTFOLIO_URL` for another address or `BROWSER_CHANNEL` to use an installed browser such as `msedge`. The tests save their results and screenshots under `test-results/`.

See `ENHANCEMENTS.md` for the changes and validation scope.

## Interactive features

Use the search button in the navigation or Ctrl/Cmd+K to jump to a page or project. On the homepage, choose Energy & systems, Operations & improvement, or Analytics & ML to explore related work.

In the archive, save projects to revisit in the same browser, enable Saved only, or compare two or three case studies side by side. Saves use browser local storage, without an account; if storage is blocked, saves remain available for the current visit. Share this search copies the current keywords and category as a URL, with a manual-copy fallback. Saved choices are not included in shared links.

After editing project titles, tags or descriptions in `projects.html`, regenerate the navigation catalog:

```sh
python tools/build-catalog.py
```

Curated focus groups are configured in `js/interactive.js`. Comparison content comes directly from the archive cards.

The career journey uses native expandable sections and remains usable without JavaScript. The image gallery uses existing project screenshots and case-study imagery. The Decision Lab is a teaching example of EOQ and reorder-point calculations, with explicit units, assumptions and input limits; it does not represent business results. The updated one-page résumé includes clickable GitHub, portfolio and LinkedIn links.

## Contact

- Email: balashunmugamruthran@gmail.com
- Phone: +91 70104 69326
- LinkedIn: https://www.linkedin.com/in/bala-shunmugam-m-66a546387
- GitHub: https://github.com/Bala-Shunmugam-M
- Location: Coimbatore, Tamil Nadu, India

## Studio design

The homepage, archive and 13 case studies share a colorful Studio theme. The featured-work carousel supports buttons and arrow keys, with all three projects visible without JavaScript. Motion controls at the foot of each page remember the visitor's choice and respect system reduced-motion preferences. Local scripts provide section entrances, pointer tilt on precise-pointer devices, scroll progress and back-to-top. Existing case-study data and standalone tools are preserved.

Studio colors live in tokens.css; presentation lives in css/studio.css and css/studio-case.css; interactions live in js/studio.js. No external animation library is required by these pages.

## Atlas career experience

The homepage now includes an optional four-chapter introduction and richer career evidence panels. `profile.html` provides a concise recruiter overview with résumé, GitHub and contact links; its Print / Save as PDF control opens the browser's print dialog. The profile prints in light colors even when the site is in dark mode.

`css/atlas.css` adds the layered background, image treatments and profile/intro styling. `js/atlas.js` controls the introduction and print action; career panel data remains in `js/interactive.js`. All motion follows the existing shared controls. See `DESIGN-REFERENCES.md` for the GitHub research and image provenance. No new production packages are needed.

## Software project additions

The archive now contains 17 distinct case studies. `project-16.html` covers AI Data Science Workbench, `project-17.html` covers KERNEL-OPS together with its companion site, `project-18.html` covers CampusPulse Business Data Management, and `project-19.html` covers AetherForge Ops. The homepage software showcase links to all four, and the archive adds MLOps, Data Management and Operations Systems categories.

Each new page includes three real application screenshots, an architecture summary, a walkthrough and explicit evidence limits. The existing image-preview interaction supports enlargement; full-size image links remain usable without JavaScript. Styling lives in `css/software.css`. Update project metadata through `projects.html`, then run `python tools/build-catalog.py` as described above. See `PROJECT-EVIDENCE.md` for runtime verification, data provenance and limitations.


## InventoryIQ application update

InventoryIQ remains P/07 in the 17-project archive. Its updated case study includes five current app captures, source/live links, a verified order-and-receive example and an expandable original calculator. assets/shots/inventory/ contains unmodified captures; css/inventory-case.css adds the mobile screenshot treatment and calculator styles. Run tests/inventory-check.cjs with the same Playwright settings as the existing suites. See PROJECT-EVIDENCE.md for provenance and scope.
