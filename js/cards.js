/* cards.js — Phase C: cursor-aware 3D tilt + art parallax on project/tool cards
 * Daybook v3 · "Daybook in motion" (Amendment 2026-06-19)
 *
 * What this does (and what it does NOT do):
 *   - Adds a subtle perspective tilt (±6 deg X/Y) toward the cursor while
 *     hovering a .proj or .tool-card, plus a matching art-parallax (≤10 px).
 *   - COMPOSES with the existing CSS lift (translateY(-5px)) — never fights it.
 *   - On pointerleave: eases back to rest, then clears the inline transform so
 *     CSS :hover rules resume ownership (no stale inline style).
 *   - Does NOT reveal hidden content — all card content is already visible.
 *   - Does NOT touch .reveal, redesign.js, motion.js, hero.js, or redesign.css.
 *
 * Hard rules (CLAUDE.md / design.md):
 *   - prefers-reduced-motion: reduce → bail immediately, CSS hover unchanged
 *   - touch device (hover:none / pointer:coarse) → bail, CSS hover unchanged
 *   - animate transform only (no opacity changes here)
 *   - rAF-throttled: one shared rAF loop per card while pointer is inside
 *   - Tilt capped at ±MAX_TILT degrees; art translate capped at ±MAX_PARALLAX px
 */
(function () {
  "use strict";

  /* ── 0. Capability gates ─────────────────────────────── */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch  = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* Touch OR reduced-motion: leave CSS hover exactly as-is. */
  if (reduce || touch) return;

  /* ── 1. Constants ────────────────────────────────────── */
  var MAX_TILT      = 6;    // degrees, capped each axis
  var MAX_PARALLAX  = 10;   // px, art translate cap
  var LERP_TILT     = 0.10; // smoothing for tilt (lower = more lag, silkier)
  var LERP_ART      = 0.08; // smoothing for art parallax (slightly lazier)
  var LIFT_PX       = -5;   // matches redesign.css translateY(-5px) on hover
  var LEAVE_EASE    = "transform 400ms cubic-bezier(0.16,1,0.3,1)";

  /* ── 2. Selectors ────────────────────────────────────── */
  var CARD_SEL = ".proj, .tool-card";
  /* Inner art elements that receive the parallax offset */
  var ART_SEL  = ".art, .proj-mini-art, .hero-side-art";

  /* ── 3. Per-card state ───────────────────────────────── */
  /* Each card gets a small state object attached as el._cardState so we
     can store lerp targets without polluting the DOM. */

  function initCard(el) {
    /* Find the art child (may be absent on some proj-third cards) */
    var artEl = el.querySelector(ART_SEL);

    var state = {
      el:        el,
      artEl:     artEl,
      /* Current lerp values (what is rendered) */
      rotX:      0, rotY:      0,
      artX:      0, artY:      0,
      lift:      0,
      /* Target lerp values (where we want to go) */
      tRotX:     0, tRotY:     0,
      tArtX:     0, tArtY:     0,
      tLift:     0,
      /* Whether the pointer is currently inside */
      inside:    false,
      /* rAF id for this card */
      rafId:     null,
      /* Whether we're in the "leaving" ease-back phase */
      leaving:   false,
    };

    el._cardState = state;

    el.addEventListener("pointerenter", function (e) {
      /* Only react to real mouse/pen, not touch (belt-and-suspenders) */
      if (e.pointerType === "touch") return;
      state.inside  = true;
      state.leaving = false;
      state.tLift   = LIFT_PX;   // ease the lift IN (and back OUT on leave)

      /* Remove any CSS transition we added during leave */
      el.style.transition = "";
      if (artEl) artEl.style.transition = "";

      /* Start the rAF loop for this card */
      if (!state.rafId) {
        state.rafId = requestAnimationFrame(function tick() {
          if (!state.inside && !state.leaving) {
            state.rafId = null;
            return;
          }
          tickCard(state);
          state.rafId = requestAnimationFrame(tick);
        });
      }
    });

    el.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      if (!state.inside) return;

      var rect = el.getBoundingClientRect();
      /* Normalised position relative to card centre: -0.5 → +0.5 */
      var nx = (e.clientX - rect.left)  / rect.width  - 0.5;
      var ny = (e.clientY - rect.top)   / rect.height - 0.5;

      /* Tilt: cursor right → rotate Y positive (lean right); cursor down → rotate X negative (lean toward viewer at bottom) */
      state.tRotY =  nx * MAX_TILT * 2;   // full range = 2 * cap → clamp inside tick
      state.tRotX = -ny * MAX_TILT * 2;

      /* Art parallax: opposite direction to tilt gives depth illusion */
      state.tArtX =  nx * MAX_PARALLAX * 2;
      state.tArtY =  ny * MAX_PARALLAX * 2;
    }, { passive: true });

    el.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "touch") return;
      state.inside  = false;
      state.leaving = true;

      /* Snap targets back to zero — the lerp loop will ease there */
      state.tRotX = 0; state.tRotY = 0;
      state.tArtX = 0; state.tArtY = 0;
      state.tLift = 0;   // ease the lift back out so there's no 5px snap at settle

      /* Add ease transitions so the snap-back looks smooth.
         The loop detects when values are near-zero and then clears itself. */
      el.style.transition = LEAVE_EASE;
      if (artEl) artEl.style.transition = LEAVE_EASE;
    });
  }

  /* ── 4. Per-card lerp tick ───────────────────────────── */
  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function tickCard(state) {
    var el    = state.el;
    var artEl = state.artEl;

    /* Lerp toward targets */
    state.rotX += (state.tRotX - state.rotX) * LERP_TILT;
    state.rotY += (state.tRotY - state.rotY) * LERP_TILT;
    state.artX += (state.tArtX - state.artX) * LERP_ART;
    state.artY += (state.tArtY - state.artY) * LERP_ART;
    state.lift += (state.tLift - state.lift) * LERP_TILT;

    /* Clamp to caps */
    var rX = clamp(state.rotX, -MAX_TILT,     MAX_TILT);
    var rY = clamp(state.rotY, -MAX_TILT,     MAX_TILT);
    var aX = clamp(state.artX, -MAX_PARALLAX, MAX_PARALLAX);
    var aY = clamp(state.artY, -MAX_PARALLAX, MAX_PARALLAX);

    /* Detect "at rest" during leave phase — values within 0.05 px/deg of zero */
    if (state.leaving) {
      var settled = Math.abs(rX) < 0.05 && Math.abs(rY) < 0.05 &&
                    Math.abs(aX) < 0.05 && Math.abs(aY) < 0.05 &&
                    Math.abs(state.lift) < 0.05;
      if (settled) {
        /* Clear inline transforms so CSS :hover / :focus take back control */
        el.style.transform  = "";
        el.style.transition = "";
        if (artEl) {
          artEl.style.transform  = "";
          artEl.style.transition = "";
        }
        state.rotX = state.rotY = state.artX = state.artY = 0;
        state.leaving = false;
        return; /* Stop the rAF loop for this card */
      }
    }

    /* Compose with the existing lift so we don't fight redesign.css.
       When inside: translateY(LIFT_PX) is the same lift CSS would apply.
       We own the transform, so we include it explicitly.
       When leaving (targets → 0): lift also lerps away naturally.
       Note: perspective() must be outermost in the transform string. */
    el.style.transform =
      "perspective(700px)" +
      " rotateX(" + rX.toFixed(3) + "deg)" +
      " rotateY(" + rY.toFixed(3) + "deg)" +
      " translateY(" + state.lift.toFixed(3) + "px)";

    /* Art parallax: translate only, toward the cursor (same sign as mouse offset) */
    if (artEl) {
      /* Preserve existing CSS art-zoom (scale) by composing — we add a
         translate in front of any scale that redesign.css may be adding.
         We write only translate here; the CSS transition on .art svg for
         scale(1.05) is on the SVG child, not the art container, so no conflict. */
      artEl.style.transform =
        "translate(" + aX.toFixed(3) + "px, " + aY.toFixed(3) + "px)";
    }
  }

  /* ── 5. Boot: init all cards when DOM is ready ───────── */
  function boot() {
    var cards = document.querySelectorAll(CARD_SEL);
    for (var i = 0; i < cards.length; i++) {
      initCard(cards[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

}());
