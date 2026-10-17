/* =====================================================================
   CORE — runs on every page: language, WhatsApp prefill, nav, mobile
   menu, sticky mobile bar, scroll reveals. Page modules register a
   language hook with DPX.onLang(fn) so their own strings re-render.
   ===================================================================== */
var DPX = window.DPX = window.DPX || {};
(function () {
  "use strict";

  var WA   = DPX.WA = "966543333657";
  var HTML = document.documentElement;
  var reduced = DPX.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  DPX.saveData = (navigator.connection && navigator.connection.saveData) === true;

  /* ---------------------------------------------------------- LANGUAGE */
  var hooks = [];
  DPX.onLang = function (fn) { hooks.push(fn); };
  DPX.lang = function () { return HTML.getAttribute("dir") === "rtl" ? "ar" : "en"; };

  var WA_PREFILL = {
    ar: "السلام عليكم، تواصلت معكم عبر موقع مجمع دي براكسس الطبي. أرغب بالاستفسار عن المواعيد المتاحة.",
    en: "Hello, I'm contacting you through the De Praxes Medical Complex website. I'd like to ask about available appointments."
  };
  function applyWaPrefill(l) {
    document.querySelectorAll("[data-wa-prefill]").forEach(function (a) {
      a.setAttribute("href", "https://wa.me/" + WA + "?text=" + encodeURIComponent(WA_PREFILL[l]));
    });
  }

  function applyLang(l) {
    HTML.setAttribute("lang", l === "ar" ? "ar" : "en");
    HTML.setAttribute("dir",  l === "ar" ? "rtl" : "ltr");
    var t = HTML.getAttribute("data-title-" + l);
    if (t) document.title = t;
    document.querySelectorAll("[data-ph-ar]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-ph-" + l));
    });
    try { localStorage.setItem("dpx-lang", l); } catch (e) {}
    applyWaPrefill(l);
    hooks.forEach(function (fn) { fn(l); });
  }
  DPX.applyLang = applyLang;
  document.getElementById("langbtn").addEventListener("click", function () {
    applyLang(DPX.lang() === "ar" ? "en" : "ar");
  });

  /* --------------------------------------------------------------- NAV */
  var nav = document.getElementById("nav"), navrule = document.getElementById("navrule");
  var mbar = document.getElementById("mbar");
  /* on the home page the hero carries its own CTAs, so the bar waits until
     the visitor scrolls past it; every inner page shows it straight away */
  var mbarAt = +(document.body.getAttribute("data-mbar") || 0);
  function onScroll() {
    var y = window.scrollY;
    if (y > 40) navrule.classList.add("border-transparent");
    else        navrule.classList.remove("border-transparent");
    if (mbar) mbar.classList.toggle("up", y >= mbarAt);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menubtn = document.getElementById("menubtn"), mobilenav = document.getElementById("mobilenav");
  menubtn.addEventListener("click", function () {
    var open = mobilenav.classList.toggle("hidden") === false;
    menubtn.setAttribute("aria-expanded", open ? "true" : "false");
    menubtn.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    if (open) nav.classList.add("bg-cream");
  });

  /* ------------------------------------------------- SCROLL MOTION (GSAP) */
  function initMotion() {
    if (reduced || !window.gsap || !window.ScrollTrigger) {
      document.body.classList.add("motion-off");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: .85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* parallax on the clinic footage (about page) */
    var vw = document.querySelector("#inside .vidwrap");
    if (vw && window.innerWidth >= 1024) {
      gsap.fromTo(vw.querySelectorAll("video, .vposter"), { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: vw, start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    /* counters — the real value is already in the HTML; JS only animates up to it */
    gsap.utils.toArray("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = (el.getAttribute("data-count").indexOf(".") > -1) ? 1 : 0;
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.4, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () { el.textContent = obj.v.toFixed(dec); },
        onComplete: function () { el.textContent = target.toFixed(dec); }
      });
    });

    /* headline settles in on load */
    if (document.querySelector("#top h1")) {
      gsap.from("#top h1, #top .kicker", { opacity: 0, y: 26, duration: 1, ease: "power3.out", stagger: .08, delay: .15 });
    }
  }
  var motionStarted = false;
  function initMotionOnce() { if (!motionStarted) { motionStarted = true; initMotion(); } }
  DPX.refresh = function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); };
  DPX.start = function () {
    var saved = "ar";
    try { saved = localStorage.getItem("dpx-lang") || "ar"; } catch (e) {}
    applyLang(saved === "en" ? "en" : "ar");
    if (document.readyState === "complete") initMotionOnce();
    else {
      window.addEventListener("load", initMotionOnce);
      /* video/images can hold `load` open on a slow line — copy never waits on it */
      setTimeout(initMotionOnce, 1200);
    }
    /* if GSAP has not come up by now, show everything rather than a blank page */
    setTimeout(function () {
      if (!window.gsap || !window.ScrollTrigger) { motionStarted = true; document.body.classList.add("motion-off"); }
    }, 2500);
  };
})();
