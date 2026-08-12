/* The Good Neighbor Guard — shared site behaviors.
 * Mobile nav, service worker, ROZTORD live badge, centralized email wiring,
 * footer year. Loaded on every page. No third-party analytics. */
(function () {
  "use strict";

  /* ── Mobile nav drawer ─────────────────────────────────────── */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("navDrawer");
  var scrim = document.getElementById("navScrim");
  function closeNav() {
    if (drawer) drawer.classList.remove("open");
    if (scrim) scrim.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openNav() {
    if (drawer) drawer.classList.add("open");
    if (scrim) scrim.classList.add("open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      drawer.classList.contains("open") ? closeNav() : openNav();
    });
    if (scrim) scrim.addEventListener("click", closeNav);
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  /* ── Centralized email wiring ──────────────────────────────── */
  /* Any element with data-mailto="<key>" (optional data-subject) becomes a
     mailto link resolved through GNG.mailto(), so no page hard-codes an address. */
  if (window.GNG) {
    document.querySelectorAll("[data-mailto]").forEach(function (el) {
      var m = window.GNG.mailto(el.getAttribute("data-mailto"), el.getAttribute("data-subject") || "");
      el.setAttribute("href", m.href);
      if (el.hasAttribute("data-show-address")) {
        var slot = el.querySelector("[data-address]") || el;
        slot.textContent = m.address;
      }
    });
    // Footer year
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ── Service worker (offline + installable) ────────────────── */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js").catch(function (e) {
        console.warn("SW registration failed:", e);
      });
    });
  }

  /* ── ROZTORD live badge ────────────────────────────────────── */
  (function () {
    var b = document.getElementById("rozBadge"),
        t = document.getElementById("rozText"),
        sub = document.getElementById("rozSub");
    if (!b || !t || !sub) return;
    var LIVE = "https://roztord.thegoodneighborguard.com/api/room/live";
    var JOIN = "https://roztord.thegoodneighborguard.com/join";
    var HOME = "https://roztord.thegoodneighborguard.com/";
    var isLive = false;
    function liveLabel() { return (window.innerWidth || 1280) >= 620 ? "ROZTORD LIVE NOW" : "LIVE NOW"; }
    window.addEventListener("resize", function () { if (isLive) t.textContent = liveLabel(); });
    function set(live) {
      isLive = !!live;
      if (live) { b.className = "roz-badge live"; t.textContent = liveLabel(); sub.textContent = "JOIN NOW"; b.href = JOIN; b.title = "ROZTORD is live — tap to join"; }
      else { b.className = "roz-badge off"; t.textContent = "ROZTORD"; sub.textContent = "OFFLINE"; b.href = HOME; b.title = "ROZTORD — offline right now"; }
    }
    function check() {
      fetch(LIVE, { cache: "no-store" }).then(function (r) { return r.json(); })
        .then(function (d) { set(!!(d && d.live)); }).catch(function () { set(false); });
    }
    check(); setInterval(check, 15000);
  })();
})();
