/* motion.js — Phase A global motion layer + Phase F dark/fade polish
 * Daybook v3 · "Daybook in motion" (Amendment 2026-06-19)
 * Augments redesign.js — does NOT replace it.
 * redesign.js owns: reveals, count-up, ticker, nav theme-switch, sticky rail.
 * motion.js owns:   Lenis smooth scroll, anchor-scroll, custom cursor,
 *                   magnetic buttons, scroll-progress hairline,
 *                   page-load fade-in (.js-ready class on <html>).
 *
 * Hard rules (CLAUDE.md / design.md):
 *   - animate transform / opacity ONLY
 *   - rAF-throttle every mousemove / scroll handler
 *   - prefers-reduced-motion → skip cursor / magnetic / Lenis / parallax / fade
 *   - touch (hover:none / pointer:coarse) → skip cursor / magnetic
 *   - degrade gracefully if GSAP or Lenis is absent
 */
(function () {
  "use strict";

  /* ── 0. Capability flags ──────────────────────────────── */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch  = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* Page-load fade (Phase F) REMOVED 2026-06-20: it animated body opacity on
     every load, which also faded the custom cursor (a body child) and made
     navigation feel less instant. The site renders immediately now. */

  /* ── 1. Inject DOM nodes ──────────────────────────────── */
  // Scroll-progress hairline — one element, always present
  var progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.appendChild(progressBar);

  // Custom cursor nodes — only created when they'll be used
  var cursorDot  = null;
  var cursorRing = null;
  if (!reduce && !touch) {
    cursorDot  = document.createElement("div");
    cursorDot.className = "cursor-dot";
    cursorDot.setAttribute("aria-hidden", "true");

    cursorRing = document.createElement("div");
    cursorRing.className = "cursor-ring";
    cursorRing.setAttribute("aria-hidden", "true");

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
  }

  /* ── 2. Scroll ─────────────────────────────────────────────
   * Lenis smooth-scroll REMOVED 2026-06-20: its inertia read as sticky/laggy,
   * and on the cosmic project pages it layered over a second WebGL rAF loop.
   * We use native scroll (crisp); GSAP ScrollTrigger drives native scroll
   * directly. `lenis` stays null so the anchor-scroll and scroll-progress
   * code below take their native paths.
   * ───────────────────────────────────────────────────────── */
  var lenis = null;
  if (!reduce && window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  /* ── 3. Anchor-link smooth scroll ────────────────────── */
  // redesign.js does NOT handle anchor scroll; we own it here.
  // lenis.scrollTo is used when Lenis is live; native scrollIntoView otherwise.
  document.addEventListener("click", function (e) {
    var anchor = e.target.closest("a[href^='#']");
    if (!anchor) return;

    var hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;

    var target = document.querySelector(hash);
    if (!target) return;

    // Let the browser handle the hash update normally
    // but override the scroll behaviour
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 }); // clear the 68px nav + gap
    } else if (!reduce) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Under reduce with no Lenis: let the browser instant-jump naturally.
  }, { passive: false });

  /* ── 4. Scroll-progress hairline ─────────────────────── */
  // Updated via Lenis scroll event (when available) or native scroll.
  // transform: scaleX() only — no layout properties.
  function updateProgress() {
    var scrollTop  = window.scrollY || document.documentElement.scrollTop;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var progress   = docHeight > 0 ? scrollTop / docHeight : 0;
    progressBar.style.transform = "scaleX(" + progress + ")";
  }

  if (!reduce) {
    if (lenis) {
      // Piggyback on Lenis scroll event for zero extra rAF cost
      lenis.on("scroll", function (e) {
        var progress = e.progress; // Lenis provides this directly (0→1)
        progressBar.style.transform = "scaleX(" + progress + ")";
      });
    } else {
      // Native scroll fallback — rAF-throttled
      var progressRaf = false;
      window.addEventListener("scroll", function () {
        if (progressRaf) return;
        progressRaf = true;
        requestAnimationFrame(function () {
          progressRaf = false;
          updateProgress();
        });
      }, { passive: true });
    }
    // Set initial value (in case page loads mid-scroll)
    updateProgress();
  }

  /* ── 5. Custom cursor ─────────────────────────────────── */
  // Only runs when !reduce && !touch (nodes were only created then).
  if (!reduce && !touch && cursorDot && cursorRing) {

    // Current pointer position (updated on mousemove)
    var mouseX = -999, mouseY = -999;
    // Lerp-followed ring position
    var ringX  = -999, ringY  = -999;
    // Ring scale (grows over interactive targets) — composed into transform
    var ringScale = 1, ringScaleTarget = 1;
    // rAF ID so we only run one loop
    var cursorRafId = null;
    // Whether the cursor has become visible yet
    var cursorVisible = false;

    // Interactive-target selectors that grow the ring
    var HOVER_TARGETS = "a, button, [data-cursor], label, [role='button']";

    // Tick: move dot instantly, lerp ring toward dot
    function cursorTick() {
      // Lerp ring toward mouse — factor 0.12 gives a pleasant follow lag
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      // Lerp ring scale toward its target (grows over interactive targets)
      ringScale += (ringScaleTarget - ringScale) * 0.15;

      // transform only — translate to pointer, centre, then scale about centre
      cursorDot.style.transform  = "translate(" + mouseX + "px, " + mouseY + "px) translate(-50%, -50%)";
      cursorRing.style.transform = "translate(" + ringX  + "px, " + ringY  + "px) translate(-50%, -50%) scale(" + ringScale + ")";

      cursorRafId = requestAnimationFrame(cursorTick);
    }

    // Track + reveal the cursor on movement
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // First real move: start the loop + hide the native cursor.
      if (!cursorVisible) {
        cursorVisible = true;
        document.documentElement.classList.add("custom-cursor");
        ringX = mouseX;   // seed ring to avoid a fly-in
        ringY = mouseY;
        cursorRafId = requestAnimationFrame(cursorTick);
      }

      // Ensure visible on every move. Fixes the "sometimes invisible" cursor:
      // when the pointer left the window (mouseleave → opacity 0) and re-entered
      // via a mousemove rather than a mouseenter, it used to stay hidden while
      // the native cursor was still suppressed. Restoring here is authoritative.
      if (cursorDot.style.opacity !== "1") {
        cursorDot.style.opacity  = "1";
        cursorRing.style.opacity = cursorDot.classList.contains("is-hover") ? "0.7" : "0.55";
      }
    }, { passive: true });

    // Hover state: grow ring over interactive targets
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(HOVER_TARGETS)) {
        cursorDot.classList.add("is-hover");
        ringScaleTarget = 1.55;                       // grow via transform scale only
        if (cursorVisible) cursorRing.style.opacity = "0.7";
      }
    }, { passive: true });

    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(HOVER_TARGETS)) {
        cursorDot.classList.remove("is-hover");
        ringScaleTarget = 1;
        if (cursorVisible) cursorRing.style.opacity = "0.55";
      }
    }, { passive: true });

    // Hide cursor when pointer leaves the viewport
    document.addEventListener("mouseleave", function () {
      cursorDot.style.opacity  = "0";
      cursorRing.style.opacity = "0";
    }, { passive: true });

    document.addEventListener("mouseenter", function () {
      if (cursorVisible) {
        cursorDot.style.opacity  = "1";
        cursorRing.style.opacity = "0.55";
      }
    }, { passive: true });
  }

  /* ── 6. Magnetic buttons ──────────────────────────────── */
  // Elements matching .btn or [data-magnetic] translate slightly
  // toward the cursor when within proximity, then ease back on leave.
  // transform only; displacement capped at ≤ 8px.
  if (!reduce && !touch) {

    var MAGNETIC_SEL = ".btn, [data-magnetic]";
    var MAX_SHIFT    = 8;    // px cap
    var PROXIMITY    = 80;   // px radius that activates the effect

    // rAF-throttled mousemove — shared across all magnetic elements
    var magRaf     = false;
    var magMouseX  = 0;
    var magMouseY  = 0;

    // Track which elements are currently "active" (in proximity)
    var activeMagnets = [];

    window.addEventListener("mousemove", function (e) {
      magMouseX = e.clientX;
      magMouseY = e.clientY;

      if (magRaf) return;
      magRaf = true;
      requestAnimationFrame(function () {
        magRaf = false;
        var magnets = document.querySelectorAll(MAGNETIC_SEL);
        magnets.forEach(function (el) {
          var rect   = el.getBoundingClientRect();
          var cx     = rect.left + rect.width  / 2;
          var cy     = rect.top  + rect.height / 2;
          var dx     = magMouseX - cx;
          var dy     = magMouseY - cy;
          var dist   = Math.sqrt(dx * dx + dy * dy);
          var radius = Math.max(rect.width, rect.height) / 2 + PROXIMITY;

          if (dist < radius) {
            // Normalise displacement — max MAX_SHIFT px at centre
            var ratio = 1 - dist / radius;
            var tx    = Math.min(Math.abs(dx * ratio * 0.4), MAX_SHIFT) * Math.sign(dx);
            var ty    = Math.min(Math.abs(dy * ratio * 0.4), MAX_SHIFT) * Math.sign(dy);

            // Remove ease class while tracking (real-time, no lag)
            el.classList.remove("magnetic-ease");
            el.style.transform = "translate(" + tx + "px, " + ty + "px)";

            if (activeMagnets.indexOf(el) === -1) activeMagnets.push(el);
          } else {
            // Outside radius — snap back with ease if was active
            if (activeMagnets.indexOf(el) !== -1) {
              el.classList.add("magnetic-ease");
              el.style.transform = "translate(0px, 0px)";
              activeMagnets.splice(activeMagnets.indexOf(el), 1);

              // Remove the ease class after the transition ends
              el.addEventListener("transitionend", function handler() {
                el.classList.remove("magnetic-ease");
                el.style.transform = "";
                el.removeEventListener("transitionend", handler);
              });
            }
          }
        });
      });
    }, { passive: true });
  }

}());
