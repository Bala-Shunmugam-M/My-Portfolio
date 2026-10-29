/* Hallmark · Foundry — homepage behaviour
 * reveals · nav theme switch · sticky rail active-state · in-view count-up
 * transform/opacity only · reduced-motion safe
 */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* Accessible disclosure navigation, shared by home and archive. */
  var toggle = document.getElementById("menuToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    var mobile = window.matchMedia("(max-width: 1100px)");
    function setMenu(open, restoreFocus) {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".navbar")) setMenu(false);
    });
    document.addEventListener("focusin", function (event) {
      if (!event.target.closest(".navbar")) setMenu(false);
    });
    function onBreakpoint() { setMenu(false); }
    if (mobile.addEventListener) mobile.addEventListener("change", onBreakpoint);

    /* Native anchors retain URL/history and keyboard focus. */
    var sectionLinks = Array.from(links.querySelectorAll('a[href^="#"]'));
    var sections = sectionLinks.map(function (link) { return document.getElementById(link.hash.slice(1)); }).filter(Boolean);
    if (sections.length && "IntersectionObserver" in window) {
      var activeObserver = new IntersectionObserver(function () {
        var active = null;
        sections.forEach(function (section) {
          if (section.getBoundingClientRect().top <= window.innerHeight * .4) active = section.id;
        });
        sectionLinks.forEach(function (link) {
          if (link.hash === "#" + active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }, { rootMargin: "0px 0px -60% 0px", threshold: 0 });
      sections.forEach(function (section) { activeObserver.observe(section); });
    }
  }

  /* nav theme: dark over band sections, light over paper sections */
  var nav = document.querySelector(".nav");
  var bands = document.querySelectorAll("[data-band]");
  if (nav && bands.length && "IntersectionObserver" in window) {
    // when the top of the viewport (just under nav) is over a dark band, nav stays dark
    var bandObserver = new IntersectionObserver(function (entries) {
      var overBand = false;
      entries.forEach(function (en) {
        if (en.isIntersecting) overBand = true;
      });
      // recompute against all bands each tick for reliability
      var navBottom = nav.offsetHeight + 1;
      var dark = false;
      bands.forEach(function (b) {
        var r = b.getBoundingClientRect();
        if (r.top <= navBottom && r.bottom >= navBottom) dark = true;
      });
      nav.classList.toggle("is-light", !dark);
    }, { rootMargin: "-68px 0px 0px 0px", threshold: [0, 0.01, 0.5, 1] });
    bands.forEach(function (b) { bandObserver.observe(b); });

    // also handle on scroll for precise hand-off
    var raf = false;
    window.addEventListener("scroll", function () {
      if (raf) return; raf = true;
      requestAnimationFrame(function () {
        raf = false;
        var navBottom = nav.offsetHeight + 1, dark = false;
        bands.forEach(function (b) {
          var r = b.getBoundingClientRect();
          if (r.top <= navBottom && r.bottom >= navBottom) dark = true;
        });
        nav.classList.toggle("is-light", !dark);
      });
    }, { passive: true });
  }

  /* reveal once */
  var revs = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.remove("reveal-pending"); en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revs.forEach(function (el) { el.classList.add("reveal-pending"); revObs.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* sticky rail active-state */
  var railItems = document.querySelectorAll(".work-rail li");
  var panels = document.querySelectorAll(".proj[id]");
  if (railItems.length && panels.length && "IntersectionObserver" in window) {
    var railObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          railItems.forEach(function (li) {
            li.classList.toggle("is-active", li.getAttribute("data-target") === id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    panels.forEach(function (p) { railObs.observe(p); });
  }

  /* in-view count-up — real metrics only */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-dec") || "0") | 0;
    var dur = 1100, start = null;
    function step(ts) {
      if(document.documentElement.dataset.motion==='off'){el.textContent=target.toFixed(dec);return;}
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = parseFloat(el.getAttribute("data-count")).toFixed((el.getAttribute("data-dec") || "0") | 0); });
  }
})();
