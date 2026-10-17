/* DEPARTMENTS overview — index column highlights the department in view. */
  /* =====================================================================
     5d. DEPARTMENT INDEX — the pinned "Services:" column Aventura keeps beside
         its rail, with the entry currently in view carrying the highlight.
     ===================================================================== */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll(".dept-index a[data-di]"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("data-di")] = a; });
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = byId[en.target.id];
        if (a && en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("on"); });
          a.classList.add("on");
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id); if (el) dio.observe(el);
    });
  })();

