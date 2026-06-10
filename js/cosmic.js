/* ════════════════════════════════════════════════════════════
   PORTFOLIO COSMIC — animated starfield + nebula drift
   Additive only. Respects prefers-reduced-motion.
   ════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var canvas = document.getElementById("cosmic-stars");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stars = [];
  var shooting = [];
  var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    var count = Math.round((w * h) / 7000); // density scales with viewport
    count = Math.max(60, Math.min(260, count));
    stars = [];
    var palette = ["#ffffff", "#bcd4ff", "#9fe9f2", "#9affd6"];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.3,
        tw: Math.random() * 0.02 + 0.004,
        phase: Math.random() * Math.PI * 2,
        color: palette[(Math.random() * palette.length) | 0],
        drift: Math.random() * 0.04 + 0.01
      });
    }
  }

  function spawnShooting() {
    if (reduced) return;
    var startX = Math.random() * w * 0.8;
    shooting.push({
      x: startX,
      y: Math.random() * h * 0.4,
      len: Math.random() * 120 + 80,
      vx: Math.random() * 6 + 6,
      vy: Math.random() * 3 + 2,
      life: 0,
      max: Math.random() * 40 + 30
    });
  }

  var t = 0;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    t += 1;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.phase += s.tw;
      var a = s.base + Math.sin(s.phase) * 0.3;
      if (a < 0) a = 0;
      s.y += s.drift;
      if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      ctx.globalAlpha = a;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (var j = shooting.length - 1; j >= 0; j--) {
      var m = shooting[j];
      m.x += m.vx;
      m.y += m.vy;
      m.life += 1;
      var grad = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len * (m.vy / m.vx));
      grad.addColorStop(0, "rgba(180, 215, 255, 0.9)");
      grad.addColorStop(1, "rgba(180, 215, 255, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.len, m.y - m.len * (m.vy / m.vx));
      ctx.stroke();
      if (m.life > m.max || m.x > w + 200) shooting.splice(j, 1);
    }

    if (!reduced && Math.random() < 0.004) spawnShooting();
    requestAnimationFrame(frame);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  if (reduced) {
    // draw a single static frame
    ctx.clearRect(0, 0, w, h);
    for (var k = 0; k < stars.length; k++) {
      var st = stars[k];
      ctx.globalAlpha = st.base;
      ctx.fillStyle = st.color;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else {
    requestAnimationFrame(frame);
  }
})();
