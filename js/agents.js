/* agents.js — Bala Shunmugam. M portfolio
 * Owns: preloader · #agents manager hover-preview · agents section count-up
 * IIFE, no globals leaked, no libraries required.
 * All animations: transform + opacity only (per CLAUDE.md).
 * Reduced-motion: respected throughout.
 */
(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────
     § 1. PRELOADER
     Injected by JS so it never blocks content if JS is off.
     Counts 0 → 100 over ~900ms, then fades out and is removed.
  ────────────────────────────────────────────────────────*/
  function initPreloader() {
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Under reduced-motion: never show the preloader at all */
    if (prefersReduced || document.body.classList.contains("portfolio-enhanced")) return;

    /* Show once per browser session — internal navigation between pages
       must not re-fire the count-up. */
    try {
      if (sessionStorage.getItem("plShown")) return;
      sessionStorage.setItem("plShown", "1");
    } catch (e) {
      /* sessionStorage blocked (private mode) — fall through and show once */
    }

    /* Build markup */
    var el = document.createElement("div");
    el.id = "preloader";
    el.setAttribute("aria-hidden", "true"); /* decorative — content is behind */
    el.innerHTML =
      '<div class="pl-count" id="plCount">0</div>' +
      '<div class="pl-wordmark">Bala Shunmugam. M</div>';
    document.body.insertBefore(el, document.body.firstChild);

    var countEl = el.querySelector("#plCount");
    var start = null;
    var duration = 900; /* ms */
    var raf;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      /* ease-out curve: 1 - (1 - t)^3 */
      var eased = 1 - Math.pow(1 - progress, 3);
      countEl.textContent = Math.round(eased * 100);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    function dismiss() {
      cancelAnimationFrame(raf);
      el.classList.add("pl-exit");
      el.addEventListener(
        "transitionend",
        function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        },
        { once: true }
      );
      /* ponytail: safety net — remove even if transitionend misfires */
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 800);
    }

    /* Start animation */
    raf = requestAnimationFrame(step);

    /* Always remove on load, even if animation is still running */
    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
      /* Hard fallback: remove after 3 s no matter what */
      setTimeout(dismiss, 3000);
    }
  }

  /* ──────────────────────────────────────────────────────
     § 2. AGENTS MANAGER HOVER-PREVIEW
     Reads data off [data-manager-id] buttons, toggles the
     matching .agent-preview-pane in the right panel.
     Works on hover (desktop), click/tap (mobile), focus (keyboard).
  ────────────────────────────────────────────────────────*/
  function initManagerPreview() {
    var list = document.querySelector(".agents-list");
    var panel = document.querySelector(".agents-preview");
    if (!list || !panel) return;

    var rows = list.querySelectorAll(".agent-row[data-manager-id]");
    var panes = panel.querySelectorAll(".agent-preview-pane[data-for]");
    var defaultMsg = panel.querySelector(".agents-preview-default");

    var isTouchDevice =
      window.matchMedia("(hover: none), (pointer: coarse)").matches;
    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    var activeId = null;

    function activate(id) {
      if (id === activeId) return;
      activeId = id;

      /* Update rows */
      rows.forEach(function (r) {
        r.classList.toggle("is-active", r.dataset.managerId === id);
      });
      list.classList.toggle("has-active", !!id);

      /* Update side panel panes */
      if (defaultMsg) {
        defaultMsg.style.display = id ? "none" : "";
      }
      panes.forEach(function (p) {
        var showing = p.dataset.for === id;
        if (showing) {
          p.style.display = "flex"; /* trigger display before transition */
          /* force reflow so transition fires */
          void p.offsetWidth; /* eslint-disable-line no-void */
          p.classList.add("is-shown");
        } else {
          p.classList.remove("is-shown");
          /* hide after transition; instant under reduced-motion */
          if (prefersReduced) {
            p.style.display = "none";
          } else {
            var delay = 260;
            setTimeout(function () {
              if (!p.classList.contains("is-shown")) p.style.display = "none";
            }, delay);
          }
        }
      });

      /* Update inline previews (mobile stacked layout) */
      var inlines = list.querySelectorAll(".agent-inline-preview");
      inlines.forEach(function (ip) {
        ip.style.display = ip.dataset.inlineFor === id ? "" : "none";
      });
    }

    function deactivate() {
      activate(null);
    }

    rows.forEach(function (row) {
      var id = row.dataset.managerId;

      /* Desktop: hover */
      if (!isTouchDevice) {
        row.addEventListener("mouseenter", function () {
          activate(id);
        });
      }

      /* Focus (keyboard navigation) */
      row.addEventListener("focus", function () {
        activate(id);
      });

      /* Click / tap: toggle */
      row.addEventListener("click", function () {
        if (activeId === id) {
          deactivate();
        } else {
          activate(id);
        }
      });
    });

    /* Desktop: deactivate when mouse leaves the whole layout */
    if (!isTouchDevice) {
      var layout = document.querySelector(".agents-layout");
      if (layout) {
        layout.addEventListener("mouseleave", deactivate);
      }
    }

    /* Keyboard: deactivate on Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && activeId) deactivate();
    });
  }

  /* ──────────────────────────────────────────────────────
     § 3. AGENTS SECTION COUNT-UP
     Hooks into the same IntersectionObserver pattern as
     redesign.js uses for [data-count] elements, but scoped
     to .agent-chip-val elements so there's no conflict.
  ────────────────────────────────────────────────────────*/
  function initAgentChipCountUp() {
    var chips = document.querySelectorAll(".agent-chip-val[data-count]");
    if (!chips.length) return;

    var prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      /* Show final values immediately */
      chips.forEach(function (el) {
        el.textContent = el.dataset.count;
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          var el = entry.target;
          var target = parseInt(el.dataset.count, 10);
          var start = null;
          var dur = 700;

          function tick(ts) {
            if(document.documentElement.dataset.motion==='off'){el.textContent=target;return;}
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            /* ease-out */
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );

    chips.forEach(function (el) {
      el.textContent = "0";
      obs.observe(el);
    });
  }

  /* ── Bootstrap ── */
  /* Preloader runs immediately (no DOM ready needed) */
  initPreloader();

  /* DOM-dependent inits wait for DOMContentLoaded */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initManagerPreview();
      initAgentChipCountUp();
    });
  } else {
    initManagerPreview();
    initAgentChipCountUp();
  }
})();
