/* Splendor homepage avatar — local clips only. No chat, mic, or API. */
(function () {
  "use strict";
  var stage = document.getElementById("splendorStage");
  if (!stage) return;
  var video = document.getElementById("splendorVideo");
  var label = document.getElementById("splendorGestureLabel");
  var buttons = stage.querySelectorAll("[data-gesture]");
  var base = "assets/splendor/";
  var idle = "idle";
  var playing = null;

  function srcFor(name) { return base + name + ".webm"; }

  function pretty(name) {
    if (name === "crossarms") return "Cross arms";
    if (name === "shakehead") return "Shake head";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function playClip(name, loop) {
    if (!video) return;
    playing = name;
    if (label) label.textContent = pretty(name);
    var next = srcFor(name);
    if (!video.getAttribute("src") || !video.getAttribute("src").endsWith(name + ".webm")) {
      video.setAttribute("src", next);
      video.load();
    }
    video.loop = !!loop;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    buttons.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-gesture") === name);
    });
  }

  function returnToIdle() { playClip(idle, true); }

  video.addEventListener("ended", function () {
    if (playing && playing !== idle) returnToIdle();
  });

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var g = btn.getAttribute("data-gesture");
      if (!g) return;
      playClip(g, false);
    });
  });

  function startIdle() {
    if (video.getAttribute("data-started")) return;
    video.setAttribute("data-started", "1");
    playClip(idle, true);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { startIdle(); io.disconnect(); }
      });
    }, { threshold: 0.2 });
    io.observe(stage);
  } else {
    startIdle();
  }

  /* Talking-video: set data-youtube="VIDEO_ID" or data-src="assets/splendor/talking.mp4" on #talkingMount */
  var mount = document.getElementById("talkingMount");
  if (mount) {
    var yt = (mount.getAttribute("data-youtube") || "").trim();
    var file = (mount.getAttribute("data-src") || "").trim();
    var slot = mount.querySelector(".talking-slot");
    if (!slot) return;
    if (yt) {
      var id = yt.replace(/[^a-zA-Z0-9_-]/g, "");
      slot.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '" title="Splendor talking" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      mount.classList.add("has-video");
    } else if (file) {
      var safe = file.replace(/"/g, "");
      slot.innerHTML = '<video controls playsinline preload="metadata" src="' + safe + '"></video>';
      mount.classList.add("has-video");
    }
  }
})();
