/* about.js — Phase D: drawing journey timeline
 * Daybook v3 · "Daybook in motion" (Amendment 2026-06-19)
 *
 * What this does:
 *   - Injects a vertical .j-line connector into .journey
 *   - Draws the line top→bottom (scaleY 0→1) as #about scrolls in
 *   - Stagers each .journey-step in (opacity + small translateY) as
 *     the line passes that step
 *
 * What this does NOT touch:
 *   - .reveal / redesign.js (already owns the .journey card fade-in)
 *   - .bar-fill / .proj-bar-fill (redesign.js scaleX owns those)
 *   - Any other section or file
 *
 * Hard rules (CLAUDE.md / design.md):
 *   - prefers-reduced-motion → render final static state, no animation
 *   - animate transform / opacity only
 *   - rAF-throttled IO fallback when GSAP ScrollTrigger is absent
 *   - touch devices: scroll-reveal only (no cursor/parallax), which is
 *     what this already is — no special branch needed
 */
(function () {
  "use strict";

  /* ── 0. Reduced-motion gate ──────────────────────────────────── */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. Find the journey card ────────────────────────────────── */
  var journey = document.querySelector(".journey");
  if (!journey) return;

  var steps = journey.querySelectorAll(".journey-step");
  if (!steps.length) return;

  /* ── 2. Inject the drawing connector line ────────────────────── */
  /* .journey already has position:relative from redesign.css (it's a
     card — verify below and add inline if needed). The .j-line sits
     behind the dots, centred on the 40px dot column. */
  var computedPos = window.getComputedStyle(journey).position;
  if (computedPos === "static") {
    journey.style.position = "relative";
  }

  var line = document.createElement("div");
  line.className = "j-line";
  line.setAttribute("aria-hidden", "true");
  /* Insert as first child of journey so it's behind step content */
  journey.insertBefore(line, journey.firstChild);

  /* ── 3. Reduced-motion: skip animation, ensure static state ─── */
  if (reduce) {
    /* Line is fully drawn via CSS media query (see motion.css).
       Steps are already visible — redesign.js sets .is-in on .journey,
       but steps have no opacity:0 from us under reduce mode (CSS handles
       that too — see motion.css @media reduced-motion block). */
    return;
  }

  /* ── 4. Mark steps with initial hidden state ─────────────────── */
  /* We add the class .j-step-hidden so CSS motion.css sets their
     initial opacity:0 and translateY. JS removes it per-step as the
     line draws past. We do this AFTER the reduced-motion return so
     steps are never hidden under reduce. */
  for (var s = 0; s < steps.length; s++) {
    steps[s].classList.add("j-step-hidden");
  }

  /* ── 5. Animation ────────────────────────────────────────────── */
  /* Strategy: drive via GSAP ScrollTrigger when available (already
     loaded globally by index.html), else IntersectionObserver. */

  /* The line draws scaleY from 0→1 and steps reveal at evenly-spaced
     progress points as the line passes them. */

  var STEP_DELAYS = [0, 120, 240, 360, 480]; /* ms stagger per step */

  function revealStep(i) {
    /* Remove the hidden class — CSS transition handles opacity+translate */
    if (steps[i]) {
      steps[i].classList.remove("j-step-hidden");
      steps[i].classList.add("j-step-in");
    }
  }

  /* ── 5a. GSAP ScrollTrigger path ─────────────────────────────── */
  if (window.gsap && window.ScrollTrigger) {
    /* Ensure ScrollTrigger is registered (motion.js may have done this,
       but belt-and-suspenders) */
    window.gsap.registerPlugin(window.ScrollTrigger);

    /* Tween the line scaleY 0→1 */
    window.gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top 70%",     /* begin when top of #about is 70% down viewport */
          end:   "center 30%",  /* finish when centre of #about is 30% down */
          scrub: 0.6,           /* smooth scrub — matches line draw to scroll */
          onUpdate: function (self) {
            /* Reveal each step when the line progress passes its threshold.
               Steps are evenly spaced: step i reveals at progress >= (i+1)/6 */
            for (var i = 0; i < steps.length; i++) {
              var threshold = (i + 1) / (steps.length + 1);
              if (self.progress >= threshold) {
                revealStep(i);
              }
            }
          },
          onEnter: function () {
            /* Immediately reveal any steps that should be visible
               (handles fast-scroll-in) */
          },
          /* On scroll back to top: reset (optional, tasteful) */
          onLeaveBack: function () {
            /* Re-hide steps so the animation can replay on scroll back */
            for (var i = 0; i < steps.length; i++) {
              steps[i].classList.add("j-step-hidden");
              steps[i].classList.remove("j-step-in");
            }
          }
        }
      }
    );

  /* ── 5b. IntersectionObserver fallback ───────────────────────── */
  } else if ("IntersectionObserver" in window) {

    /* Observe #about — when it enters the viewport, trigger the
       line draw and step reveals sequentially. */
    var section = document.getElementById("about");
    var triggered = false;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || triggered) return;
        triggered = true;
        obs.disconnect();

        /* Animate line: add .j-line-active class → CSS transition draws it */
        line.classList.add("j-line-active");

        /* Stagger steps */
        for (var i = 0; i < steps.length; i++) {
          (function (idx) {
            setTimeout(function () {
              revealStep(idx);
            }, 300 + STEP_DELAYS[idx]); /* 300ms head-start so line leads */
          }(i));
        }
      });
    }, {
      rootMargin: "0px 0px -15% 0px",
      threshold: 0.15
    });

    if (section) obs.observe(section);

    /* Fallback if IntersectionObserver is also unavailable */
  } else {
    /* Render fully visible immediately */
    line.classList.add("j-line-active");
    for (var i = 0; i < steps.length; i++) {
      revealStep(i);
    }
  }

}());
