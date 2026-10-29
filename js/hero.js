/* hero.js — Phase B: Three.js reactive graph-paper field
 * Daybook v3 · "Daybook in motion" (Amendment 2026-06-19)
 *
 * Adds a low-contrast, full-bleed WebGL canvas behind the hero text.
 * Concept: faint graph-paper dot-field (using --color-ink / --color-rule at
 * low opacity) with ONE ultramarine (--color-accent) data-wave threading
 * across it. Motion is cursor- and scroll-driven only — no autonomous
 * pulsing or autoplay (design.md bans pulsing dots).
 *
 * Capability gates (all must pass or the hero is left exactly as-is):
 *   1. prefers-reduced-motion: reduce  → DO NOTHING
 *   2. touch device (hover:none / pointer:coarse) → DO NOTHING
 *   3. WebGL unavailable               → DO NOTHING
 *   4. Three.js CDN import fails       → DO NOTHING (fail silent)
 *
 * Architecture:
 *   - Dynamic import of Three.js (only when capabilities pass + hero in view)
 *   - IntersectionObserver: lazy-init & pause/resume rAF when hero exits view
 *   - visibilitychange: pause/resume when tab hidden
 *   - Scroll-settle: GSAP ScrollTrigger if available, else rAF fallback
 *   - Pointer input throttled — consumed in rAF loop, not in mousemove
 *
 * Hard rules obeyed:
 *   - Only transform / opacity animated (canvas as a whole for scroll-settle)
 *   - All color from CSS custom properties via getPropertyValue
 *   - Accent ≤ 5% of viewport (one thin line + subtle cursor bend)
 *   - defer on the script tag — never blocks first paint
 *   - Three.js lazy-loaded only after idle + hero near view
 */
(function () {
  "use strict";

  /* ── 0. Capability gates ─────────────────────────────── */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch  = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (reduce || touch) return; // leave hero exactly as-is

  /* WebGL check — create a throwaway canvas, don't touch #home yet */
  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch (e) {
      return false;
    }
  }
  if (!hasWebGL()) return;

  /* ── 1. Read CSS token colours (resolved from :root) ──── */
  /* Called once, after the document is parsed (defer guarantees this). */
  function getToken(prop) {
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
  }

  /* ── 2. Shared state ─────────────────────────────────── */
  var heroEl     = document.getElementById("home");
  if (!heroEl) return;

  var canvas     = null;   // the THREE canvas element
  var renderer   = null;
  var scene      = null;
  var camera     = null;
  var rafId      = null;
  var threeLoaded = false;
  var threeLoading = false;
  var heroInView = false;
  var renderLoop = null;

  /* Pointer — updated on mousemove, consumed in rAF */
  var ptrNDC = { x: 0, y: 0 };          // normalised device coords (–1..1)
  var ptrTarget = { x: 0, y: 0 };       // smoothed cursor NDC for line bending

  /* Scroll-settle opacity/translateY driven by scroll position */
  var canvasOpacity = 1;
  var canvasTranslateY = 0;

  /* ── 3. Throttled pointer handler ───────────────────── */
  var ptrRafPending = false;
  var ptrRawX = 0, ptrRawY = 0;

  function onPointerMove(e) {
    ptrRawX = e.clientX;
    ptrRawY = e.clientY;
    if (ptrRafPending) return;
    ptrRafPending = true;
    requestAnimationFrame(function () {
      ptrRafPending = false;
      if (!canvas) return;
      var rect = heroEl.getBoundingClientRect();
      // Map pointer to NDC relative to hero bounds
      ptrNDC.x =  ((ptrRawX - rect.left)  / rect.width)  * 2 - 1;
      ptrNDC.y = -((ptrRawY - rect.top)   / rect.height) * 2 + 1;
    });
  }

  /* ── 4. Scroll-settle: cheap rAF fallback ──────────── */
  /* (GSAP path wired after Three.js loads, see section 9) */
  var scrollRafPending = false;
  function onScroll() {
    if (scrollRafPending) return;
    scrollRafPending = true;
    requestAnimationFrame(function () {
      scrollRafPending = false;
      updateScrollSettle();
    });
  }

  function updateScrollSettle() {
    if (!heroEl || !canvas) return;
    var rect    = heroEl.getBoundingClientRect();
    var heroH   = heroEl.offsetHeight;
    // progress: 0 = hero fully in view, 1 = hero scrolled entirely above viewport
    var progress = Math.max(0, Math.min(1, -rect.top / heroH));
    canvasOpacity    = 1 - progress * 0.85;  // fades to 0.15 as hero exits
    canvasTranslateY = progress * 40;         // subtle upward drift (px)
    applyCanvasSettle();
  }

  function applyCanvasSettle() {
    if (!canvas) return;
    canvas.style.opacity   = canvasOpacity;
    canvas.style.transform = "translateY(" + canvasTranslateY + "px)";
  }

  /* ── 5. Pause / resume rAF ──────────────────────────── */
  var isPaused = true;

  function pauseLoop() {
    isPaused = true;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function resumeLoop() {
    if (!isPaused || !threeLoaded || !heroInView || document.hidden) return;
    isPaused = false;
    rafId = requestAnimationFrame(renderLoop);
  }

  /* Pause when tab is hidden */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pauseLoop(); else resumeLoop();
  });

  /* ── 6. IntersectionObserver — lazy init + pause/resume ── */
  var heroObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      heroInView = entry.isIntersecting;
      if (entry.isIntersecting) {
        if (!threeLoaded) {
          initThree(); // first intersection → load + build scene
        } else {
          resumeLoop();
        }
      } else {
        pauseLoop();
      }
    });
  }, { threshold: 0.01 });

  heroObserver.observe(heroEl);

  /* ── 7. Lazy-load Three.js, then build the scene ──── */
  function initThree() {
    if (threeLoading || threeLoaded) return;
    threeLoading = true;
    /* Use requestIdleCallback when available so we don't compete with
       the critical rendering path; fall back to a short setTimeout. */
    var schedule = window.requestIdleCallback
      ? function (fn) { window.requestIdleCallback(fn, { timeout: 2000 }); }
      : function (fn) { setTimeout(fn, 200); };

    schedule(function () {
      import("https://unpkg.com/three@0.160.0/build/three.module.js")
        .then(function (THREE) {
          buildScene(THREE);
        })
        .catch(function () {
          threeLoading = false;
          /* CDN load failed — leave hero as-is, no error thrown */
        });
    });
  }

  /* ── 8. Build the Three.js scene ──────────────────── */
  function buildScene(THREE) {
    /* ─ Silence Three.js oklch warnings ─────────────────────
     * THREE.WebGLRenderer reads computed CSS background-color from the canvas
     * element (and parent) to determine clear color. In this project tokens use
     * oklch(), which THREE.Color.setStyle() can't parse (THREE v0.160).
     * Patch: wrap setStyle to catch the warning case and route through our
     * hex-fallback map so Three never calls console.warn for known tokens. */
    var _origSetStyle = THREE.Color.prototype.setStyle;
    var _HEX_MAP = {
      "--color-ink":    [0x29, 0x2c, 0x3e],
      "--color-rule":   [0xde, 0xda, 0xd1],
      "--color-accent": [0x1e, 0x3f, 0xa0],
    };
    /* sRGB hex table: oklch string → hex integer (precomputed) */
    var _OKLCH_TO_HEX = {
      "oklch(26% 0.02 264)":   0x292c3e,
      "oklch(0.26 0.02 264)":  0x292c3e,
      "oklch(88% 0.025 100)":  0xdedad1,
      "oklch(0.88 0.025 100)": 0xdedad1,
      "oklch(97% 0.02 100)":   0xf8f5ec,
      "oklch(0.97 0.02 100)":  0xf8f5ec,
      "oklch(46% 0.19 264)":   0x1e3fa0,
      "oklch(0.46 0.19 264)":  0x1e3fa0,
    };
    THREE.Color.prototype.setStyle = function(style) {
      if (typeof style === "string" && style.indexOf("oklch") !== -1) {
        var key = style.trim();
        var hex = _OKLCH_TO_HEX[key];
        if (hex !== undefined) {
          this.setHex(hex);
        } else {
          /* Unknown oklch — set a safe neutral, no warning */
          this.setHex(0x888888);
        }
        return this;
      }
      return _origSetStyle.call(this, style);
    };

    /* ─ Inject canvas ─ */
    canvas = document.createElement("canvas");
    canvas.className = "hero-canvas";
    canvas.setAttribute("aria-hidden", "true");
    /* Set background-color transparent BEFORE Three.js reads computed style.
       Three.js v0.160 reads the canvas's CSS background to set the clear color
       when alpha:true. Without this, it climbs to the parent body whose
       background is oklch(…), which it can't parse and logs a warning. */
    canvas.style.backgroundColor = "transparent";
    heroEl.appendChild(canvas);

    /* ─ Renderer ─ */
    renderer = new THREE.WebGLRenderer({
      canvas:    canvas,
      alpha:     true,    // transparent — butter page shows through
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); // cap GPU cost (perf)
    renderer.setClearColor(0x000000, 0);  // fully transparent clear

    /* ─ Scene + camera ─ */
    scene  = new THREE.Scene();

    /* Orthographic camera so grid-paper coordinates map 1:1 to UV space.
       We'll work in a normalised [-1, 1] space and let the camera project. */
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    /* ─ Read design tokens ─ */
    /* Convert a CSS token (may be oklch()) to a Three.js Color.
     *
     * THREE.Color.setStyle() only understands sRGB forms (rgb/hex/hsl/named).
     * We try two resolution paths in order:
     *
     * 1. Canvas-2D fillStyle round-trip: the browser resolves any CSS color to
     *    "rgb(...)" when the fillStyle is read back. Works in Chrome ≥ 111 in
     *    normal mode; may not work in some headless environments.
     *
     * 2. Hard-coded sRGB hex fallbacks for the three tokens used in this file.
     *    These were computed from the tokens.css oklch() values and are kept in
     *    sync manually if tokens change.
     *
     * If the canvas returns an oklch string (environment doesn't resolve it) the
     * function falls through to the known-good hex map.
     */
    var _resolveCanvas = document.createElement("canvas");
    _resolveCanvas.width = _resolveCanvas.height = 1;
    var _resolveCtx = _resolveCanvas.getContext("2d");

    /* Known-good sRGB hex equivalents for each token used here.
     * oklch → sRGB via: https://oklch.com
     *   --color-ink   oklch(26% 0.02 264)  → #292c3e  (graphite-blue dark)
     *   --color-rule  oklch(88% 0.025 100) → #dedad1  (buff hairline)
     *   --color-accent oklch(46% 0.19 264) → #1e3fa0  (ultramarine)
     */
    var _TOKEN_HEX = {
      "--color-ink":    "#292c3e",
      "--color-rule":   "#dedad1",
      "--color-accent": "#1e3fa0",
    };

    function cssToThreeColor(prop) {
      var raw = getToken(prop);
      var col = new THREE.Color();

      /* Path 1: canvas round-trip */
      try {
        _resolveCtx.fillStyle = "#000000";
        _resolveCtx.fillStyle = raw;
        var resolved = _resolveCtx.fillStyle;
        /* If the browser truly resolved it, fillStyle is "#rrggbb" or "rgb(…)";
           it will NOT contain "oklch". Bail to path 2 if it still has "oklch". */
        if (resolved && resolved.indexOf("oklch") === -1) {
          col.setStyle(resolved);
          return col;
        }
      } catch (e) { /* fall through */ }

      /* Path 2: hard-coded hex map */
      var hex = _TOKEN_HEX[prop];
      if (hex) {
        col.set(hex);
        return col;
      }

      /* Path 3: safe ultramarine default */
      col.set(0x1e3fa0);
      return col;
    }

    var colorInk    = cssToThreeColor("--color-ink");     // graphite-blue
    var colorRule   = cssToThreeColor("--color-rule");    // hairline buff
    var colorAccent = cssToThreeColor("--color-accent");  // ultramarine

    /* ─ Dot field (graph-paper) ─────────────────────────── */
    /* Grid of small dots, very low opacity — read as graph-paper texture.
       Design: dots MUST NOT pulse. They only shift gently when the cursor
       is within a tight radial falloff zone. */

    var COLS = 28;   // horizontal dots
    var ROWS = 18;   // vertical dots
    var DOT_COUNT = COLS * ROWS;

    /* Base positions in [-1,1] x [-1,1] normalised space */
    var basePositions = new Float32Array(DOT_COUNT * 3);
    var displacedPositions = new Float32Array(DOT_COUNT * 3);

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var idx = (r * COLS + c) * 3;
        /* Map col/row to [-0.95, 0.95] so dots don't clip at exact edges */
        basePositions[idx]     = (c / (COLS - 1)) * 1.9 - 0.95;
        basePositions[idx + 1] = (r / (ROWS - 1)) * 1.9 - 0.95;
        basePositions[idx + 2] = 0;
      }
    }

    /* Copy to displaced — updated per frame toward cursor */
    displacedPositions.set(basePositions);

    var dotGeo = new THREE.BufferGeometry();
    var dotPosAttr = new THREE.BufferAttribute(displacedPositions, 3);
    dotPosAttr.setUsage(THREE.DynamicDrawUsage);
    dotGeo.setAttribute("position", dotPosAttr);

    /* Dot material: tiny sprite-like points, very low opacity */
    var dotMat = new THREE.PointsMaterial({
      color:       colorInk,
      /* With sizeAttenuation:false, `size` is in PIXELS (not scene units).
       * 2.0px reads as a fine graph-paper dot — present but clearly
       * secondary to the copy. Tuned empirically against a screenshot. */
      size:        2.0,
      sizeAttenuation: false,  // uniform pixel size regardless of depth
      transparent: true,
      opacity:     0.20,       // faint — legibility of copy comes first
      depthWrite:  false,
    });

    var dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    /* ─ Data-line (the ultramarine wave) ─────────────────── */
    /* A horizontal wave spanning the full width, bends toward cursor.
       Vertices are updated per-frame via lerp; no autonomous oscillation. */

    var LINE_SEGS = 80;   // number of line segments
    var linePositions = new Float32Array((LINE_SEGS + 1) * 3);

    /* Rest-state: a very gentle s-curve at y ≈ 0 */
    function getRestY(t) {
      /* t in [0,1] → gentle sinusoidal rest at near-zero amplitude */
      return Math.sin(t * Math.PI * 1.5 - 0.5) * 0.04;
    }

    for (var i = 0; i <= LINE_SEGS; i++) {
      var t = i / LINE_SEGS;
      linePositions[i * 3]     = t * 2 - 1;       // x: -1 → 1
      linePositions[i * 3 + 1] = getRestY(t);      // y: gentle s-curve
      linePositions[i * 3 + 2] = 0.0;
    }

    /* Current (animated) y values — lerped toward target each frame */
    var lineCurrentY = new Float32Array(LINE_SEGS + 1);
    for (var i = 0; i <= LINE_SEGS; i++) {
      lineCurrentY[i] = linePositions[i * 3 + 1];
    }

    var lineGeo = new THREE.BufferGeometry();
    var linePosAttr = new THREE.BufferAttribute(linePositions, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("position", linePosAttr);

    var lineMat = new THREE.LineBasicMaterial({
      color:       colorAccent,
      linewidth:   1,          // WebGL limitation: always 1 on most GPUs
      transparent: true,
      opacity:     0.55,
      depthWrite:  false,
    });

    var dataLine = new THREE.Line(lineGeo, lineMat);
    scene.add(dataLine);

    /* Recolour on theme toggle. The field bakes CSS-token colours into its
       materials at init; a CSS `data-theme` flip can't reach them, so theme.js
       fires `themechange` and we re-resolve the two colours here. */
    window.addEventListener("themechange", function () {
      dotMat.color  = cssToThreeColor("--color-ink");
      lineMat.color = cssToThreeColor("--color-accent");
    });

    /* ─ Resize handler ─ */
    function onResize() {
      var w = heroEl.clientWidth;
      var h = heroEl.clientHeight;
      renderer.setSize(w, h, false); // false = don't set canvas CSS size
      /* Orthographic camera: keep aspect ratio so dots don't stretch */
      var aspect = w / h;
      camera.left   = -aspect;
      camera.right  =  aspect;
      camera.top    =  1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      /* Recalculate dot x positions for new aspect */
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var idx = (r * COLS + c) * 3;
          basePositions[idx] = ((c / (COLS - 1)) * 1.9 - 0.95) * aspect;
        }
      }
    }
    onResize();
    window.addEventListener("resize", onResize, { passive: true });

    /* ─ Wire pointer event ─ */
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    /* ─ Wire scroll-settle ─ */
    if (window.gsap && window.ScrollTrigger) {
      /* GSAP path: ScrollTrigger drives opacity/translateY on the canvas */
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.ScrollTrigger.create({
        trigger: heroEl,
        start:   "top top",
        end:     "bottom top",
        scrub:   true,
        onUpdate: function (self) {
          canvasOpacity    = 1 - self.progress * 0.85;
          canvasTranslateY = self.progress * 40;
          applyCanvasSettle();
        },
      });
    } else {
      /* Cheap rAF fallback */
      window.addEventListener("scroll", onScroll, { passive: true });
      updateScrollSettle(); // initial value
    }

    /* ─ Start render loop ─ */
    threeLoaded = true;

    /* ─ Per-frame render ─ */
    var LERP_PTR  = 0.06;    // cursor smoothing
    var LERP_LINE = 0.04;    // line vertex smoothing
    var LERP_DOT  = 0.05;    // dot displacement smoothing

    /* Dot displacement scratch — kept outside the loop to avoid GC */
    var dotDispX = new Float32Array(DOT_COUNT);
    var dotDispY = new Float32Array(DOT_COUNT);

    renderLoop = function () {
      rafId = requestAnimationFrame(renderLoop);

      /* ── Smooth pointer ── */
      ptrTarget.x += (ptrNDC.x - ptrTarget.x) * LERP_PTR;
      ptrTarget.y += (ptrNDC.y - ptrTarget.y) * LERP_PTR;

      /* Map ptrTarget to scene units (account for camera aspect) */
      var aspect  = camera.right; // = aspect ratio (since left = -right, top = 1)
      var cursorX = ptrTarget.x * aspect;
      var cursorY = ptrTarget.y;

      /* ── Update data-line vertices ── */
      for (var i = 0; i <= LINE_SEGS; i++) {
        var t   = i / LINE_SEGS;
        var vx  = t * 2 * aspect - aspect;   // x position in scene coords

        /* Rest y (static s-curve) */
        var restY = getRestY(t);

        /* Cursor bend: radial falloff around cursor position.
           The line bends toward cursor.y with a Gaussian-ish falloff in x. */
        var dx   = vx - cursorX;
        var bend = Math.exp(-dx * dx * 4.0) * cursorY * 0.22;

        var targetY = restY + bend;
        lineCurrentY[i] += (targetY - lineCurrentY[i]) * LERP_LINE;
        linePositions[i * 3 + 1] = lineCurrentY[i];
      }
      linePosAttr.needsUpdate = true;

      /* ── Update dot positions ── */
      var CURSOR_RADIUS_SQ = 0.18 * 0.18; // influence radius in scene units
      var CURSOR_STRENGTH  = 0.06;         // max displacement in scene units

      for (var j = 0; j < DOT_COUNT; j++) {
        var bx  = basePositions[j * 3];
        var by  = basePositions[j * 3 + 1];

        /* Cursor displacement: dots near cursor shift toward it */
        var ddx  = cursorX - bx;
        var ddy  = cursorY - by;
        var distSq = ddx * ddx + ddy * ddy;

        var tx = 0, ty = 0;
        if (distSq < CURSOR_RADIUS_SQ && distSq > 0.0001) {
          var factor = (1 - distSq / CURSOR_RADIUS_SQ) * CURSOR_STRENGTH;
          /* Normalise direction then scale */
          var dist = Math.sqrt(distSq);
          tx = (ddx / dist) * factor;
          ty = (ddy / dist) * factor;
        }

        /* Lerp toward target displacement */
        dotDispX[j] += (tx - dotDispX[j]) * LERP_DOT;
        dotDispY[j] += (ty - dotDispY[j]) * LERP_DOT;

        displacedPositions[j * 3]     = bx + dotDispX[j];
        displacedPositions[j * 3 + 1] = by + dotDispY[j];
      }
      dotPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    threeLoading = false;
    resumeLoop();
  }

}());
