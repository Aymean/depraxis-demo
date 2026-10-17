/* HOME — hero background footage (from the single-page build, unchanged). */
(function () {
  "use strict";
  var reduced = DPX.reduced, saveData = DPX.saveData;
  /* =====================================================================
     5b. HERO — background footage.
         The <video> ships with its own src + autoplay in the markup, so it
         starts on the first frame without waiting for JS or for a scroll.
         All this does is (a) fade the poster out once the footage is really
         playing, (b) retry play() once on the first interaction, since iOS
         can still refuse a cold autoplay, and (c) drop the footage entirely
         on Save-Data or reduced-motion, leaving the poster as the field.
     ===================================================================== */
  var heroVid = document.getElementById("heroVid");
  if (heroVid) {
    if (saveData || reduced) {
      heroVid.removeAttribute("autoplay");
      heroVid.pause();
      heroVid.removeAttribute("src");
      heroVid.load();
      heroVid.hidden = true;        /* the still underneath carries the hero */
    } else {
      var kick = function () {
        var pr = heroVid.play();
        if (pr && pr.catch) pr.catch(function () { /* refused — poster stays */ });
      };
      kick();
      document.addEventListener("touchstart", kick, { once: true, passive: true });
      document.addEventListener("click", kick, { once: true });
      /* nothing to render while the hero is off screen */
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) {
          if (en[0].isIntersecting) kick(); else heroVid.pause();
        }, { rootMargin: "200px 0px" }).observe(heroVid);
      }
    }
  }

})();
