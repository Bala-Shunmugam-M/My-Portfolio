/* theme.js — Dark / Light theme toggle (2026-06-20)
 * Daybook v3 · "Daybook in motion"
 *
 * The FOUC-prevention happens in a tiny INLINE <head> script on each page,
 * which sets <html data-theme="…"> synchronously before first paint:
 *   resolved = localStorage('theme')  ||  system (prefers-color-scheme)  ||  'light'
 *
 * This deferred file wires the navbar toggle button, persists the explicit
 * choice to localStorage, keeps following the OS until the user chooses, and
 * dispatches a `themechange` event so the WebGL hero field (hero.js) can
 * re-read its colours (CSS variables alone can't recolour a baked material).
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var KEY  = "theme";
  var mq   = window.matchMedia("(prefers-color-scheme: dark)");
  var btn  = document.getElementById("themeToggle");

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncButton(theme) {
    if (!btn) return;
    var dark = theme === "dark";
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  /* Apply a theme. persist=true writes the explicit choice to localStorage
     (which then overrides the OS preference on this and future visits). */
  function apply(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode */ }
    }
    syncButton(theme);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  /* data-theme was already set before paint by the inline head script —
     just sync the button to it. */
  syncButton(currentTheme());

  if (btn) {
    btn.addEventListener("click", function () {
      apply(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  /* While the user has NOT made an explicit choice, keep following the OS. */
  function onSystemChange(e) {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (_) { /* ignore */ }
    if (!saved) apply(e.matches ? "dark" : "light", false);
  }
  if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange); // older Safari
})();
