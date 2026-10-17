/* ABOUT — the clinic-tour band: footage loads only when it nears the viewport. */
(function () {
  "use strict";
  var reduced = DPX.reduced, saveData = DPX.saveData;
  /* =====================================================================
     5. CLINIC VIDEO — real footage from the clinic's own account.
        Loaded only when the band is near the viewport.
     ===================================================================== */
  var vid = document.getElementById("clinicvid"), vposter = document.getElementById("vposter");
  if (vid && !saveData && !reduced && "IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { if (!vid.paused) vid.pause(); return; }
        if (!vid.src) {
          vid.src = "media/clinic-tour.mp4";
          vid.addEventListener("playing", function () { vposter.style.opacity = "0"; }, { once: true });
        }
        var pr = vid.play();
        if (pr && pr.catch) pr.catch(function () { /* autoplay refused — poster stays */ });
      });
    }, { rootMargin: "300px 0px" });
    vio.observe(vid.parentNode);
  }
})();
