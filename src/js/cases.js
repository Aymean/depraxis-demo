/* =====================================================================
   CASES page — every entry is a real case published by the clinic on its
   own account, credited to the doctor the clinic itself credited.
   ===================================================================== */
(function () {
  "use strict";
  var CASES = [
    {s:"case-emax-tharaa-1",     d:"dental", ar:"تركيبات الإيماكس",              en:"E-max restorations",         dar:"د. ثراء أحمد بعث",   den:"Dr. Tharaa Ahmed Baath"},
    {s:"case-emax-tharaa-2",     d:"dental", ar:"تركيبات الإيماكس",              en:"E-max restorations",         dar:"د. ثراء أحمد بعث",   den:"Dr. Tharaa Ahmed Baath"},
    {s:"case-emax-tharaa-3",     d:"dental", ar:"عدسات الإيماكس",                en:"E-max veneers",              dar:"د. ثراء أحمد بعث",   den:"Dr. Tharaa Ahmed Baath"},
    {s:"case-invisalign-muaz-1", d:"dental", ar:"تقويم الإنفيزالاين الشفاف",     en:"Invisalign clear aligners",  dar:"د. معاذ لبابيدي",    den:"Dr. Muaz Lababidi"},
    {s:"case-invisalign-muaz-2", d:"dental", ar:"إنفيزالاين — عضة معكوسة",       en:"Invisalign — crossbite",     dar:"د. معاذ لبابيدي",    den:"Dr. Muaz Lababidi"},
    {s:"case-ortho-muaz-3",      d:"dental", ar:"تقويم الأسنان",                 en:"Orthodontic treatment",      dar:"د. معاذ لبابيدي",    den:"Dr. Muaz Lababidi"},
    {s:"case-ortho-ameer-1",     d:"dental", ar:"تقويم وإغلاق الفراغات",         en:"Ortho &amp; gap closure",    dar:"د. أمير الزهراوي",   den:"Dr. Ameer Al-Zahrawi"},
    {s:"case-ortho-ameer-2",     d:"dental", ar:"تعديل وتجميل الأسنان",          en:"Alignment &amp; aesthetics", dar:"د. أمير الزهراوي",   den:"Dr. Ameer Al-Zahrawi"},
    {s:"case-emax-baraa-1",      d:"dental", ar:"تركيبات الإيماكس التجميلية",    en:"Cosmetic E-max work",        dar:"د. براء لبابيدي",    den:"Dr. Baraa Lababidi"},
    {s:"case-emax-baraa-2",      d:"dental", ar:"تجميل وتركيبات الأسنان",        en:"Cosmetic restorations",      dar:"د. براء لبابيدي",    den:"Dr. Baraa Lababidi"},
    {s:"case-smile-kazim-1",     d:"dental", ar:"تصميم ابتسامة",                 en:"Smile design",               dar:"د. أحمد كاظم",       den:"Dr. Ahmed Kazim"},
    {s:"case-smile-kazim-2",     d:"dental", ar:"تصميم ابتسامة بعدسات الإيماكس", en:"Smile design, E-max veneers",dar:"د. أحمد كاظم",       den:"Dr. Ahmed Kazim"},
    {s:"case-composite-abir-1",  d:"dental", ar:"حشوات كومبوزيت وتنسيق لثة",     en:"Composite &amp; gum contouring",dar:"د. عبير زنداقي",  den:"Dr. Abir Zandaki"},
    {s:"case-emax-abir-2",       d:"dental", ar:"عدسات الإيماكس",                en:"E-max veneers",              dar:"د. عبير زنداقي",     den:"Dr. Abir Zandaki"},
    {s:"case-whitespots-abir-3", d:"dental", ar:"علاج البقع البيضاء",            en:"White-spot treatment",       dar:"د. عبير زنداقي",     den:"Dr. Abir Zandaki"},
    {s:"case-composite-alaa-1",  d:"dental", ar:"حشوات تجميلية مباشرة",          en:"Direct composite bonding",   dar:"د. علاء لطفي",       den:"Dr. Alaa Lutfi"},
    {s:"case-whitening-alaa-2",  d:"dental", ar:"تبييض وترميم الأسنان",          en:"Whitening &amp; restoration",dar:"د. علاء لطفي",       den:"Dr. Alaa Lutfi"},
    {s:"case-undereye-eman-1",   d:"derm",   ar:"إبرة الكونسيلر للهالات",        en:"Under-eye concealer",        dar:"د. إيمان عصام",      den:"Dr. Eman Esam"},
    {s:"case-lips-eman-2",       d:"derm",   ar:"فيلر الشفاه",                   en:"Lip filler",                 dar:"د. إيمان عصام",      den:"Dr. Eman Esam"},
    {s:"case-lips-eman-3",       d:"derm",   ar:"رسم وتحديد الشفاه",             en:"Lip definition",             dar:"د. إيمان عصام",      den:"Dr. Eman Esam"},
    {s:"case-radiesse-fatma-2",  d:"derm",   ar:"شدّ الوجه والرقبة",             en:"Face &amp; neck tightening", dar:"د. فاطمة أحمد يوسف", den:"Dr. Fatma Ahmed Youssef"},
    {s:"case-chin-sally-1",      d:"derm",   ar:"تحديد الذقن والفك",             en:"Chin &amp; jawline",         dar:"د. سالي محمود حمدي", den:"Dr. Sally Mahmoud Hamdy"},
    {s:"case-contour-sally-3",   d:"derm",   ar:"تحديد الملامح",                 en:"Facial contouring",          dar:"د. سالي محمود حمدي", den:"Dr. Sally Mahmoud Hamdy"},
    {s:"case-picoway-eman-4",    d:"laser",  ar:"تفتيح الكوع بالبيكو واي",       en:"Elbow lightening, PicoWay",  dar:"د. إيمان عصام",      den:"Dr. Eman Esam"},
    {s:"case-hands-fatma-4",     d:"laser",  ar:"توحيد لون اليدين",              en:"Hand tone evening",          dar:"د. فاطمة أحمد يوسف", den:"Dr. Fatma Ahmed Youssef"}
  ];

  var grid = document.getElementById("casegrid");
  var html = "";
  for (var i = 0; i < CASES.length; i++) {
    var c = CASES[i];
    html +=
      '<figure class="case" data-dept="' + c.d + '">' +
        '<div class="ba aspect-[758/436]" tabindex="0" aria-label="' + c.ar + ' — مرّر أو المس لرؤية النتيجة بالألوان">' +
          '<img src="images/' + c.s + '-after.webp" alt="نتيجة العلاج — ' + c.ar + '" width="758" height="436" loading="lazy" decoding="async">' +
          '<span class="ba-veil"></span>' +
        '</div>' +
        '<figcaption class="mt-3.5">' +
          '<p class="text-[.98rem] text-ink"><span lang-ar>' + c.ar + '</span><span lang-en>' + c.en + '</span></p>' +
          '<p class="mt-1 text-[.84rem] text-faint"><span lang-ar>' + c.dar + '</span><span lang-en>' + c.den + '</span></p>' +
        '</figcaption>' +
      '</figure>';
  }
  grid.innerHTML = html;

  /* ---- before/after: grayscale -> colour on hover (desktop) or
     scroll-into-view (mobile, no hover available). A tap is also covered by
     the CSS :active fallback above for devices that never fire IntersectionObserver. ---- */
  if ("IntersectionObserver" in window) {
    var baIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add("ba-seen");
      });
    }, { threshold: 0.55 });
    [].slice.call(grid.querySelectorAll(".ba")).forEach(function (el) {
      // only auto-reveal-on-scroll for touch/coarse pointers — fine-pointer
      // devices keep the deliberate hover-to-reveal interaction.
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) baIO.observe(el);
    });
  }

  /* ---------------------------------------------------------- filtering */
  var chips = [].slice.call(document.querySelectorAll(".cf"));
  var figs  = [].slice.call(document.querySelectorAll(".case"));
  function setFilter(key) {
    chips.forEach(function (b) {
      var on = b.getAttribute("data-cf") === key;
      b.classList.toggle("bg-ink", on);
      b.classList.toggle("text-cream", on);
      b.classList.toggle("border-ink", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    figs.forEach(function (f) {
      f.hidden = !(key === "all" || f.getAttribute("data-dept") === key);
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  chips.forEach(function (b) { b.addEventListener("click", function () { setFilter(b.getAttribute("data-cf")); }); });
  document.querySelectorAll("[data-filter]").forEach(function (a) {
    a.addEventListener("click", function () { setFilter(a.getAttribute("data-filter")); });
  });
  /* department pages link here as cases.html?filter=dental|derm|laser —
     the page opens at the top with that filter already applied */
  var q = (location.search.match(/[?&]filter=(dental|derm|laser)/) || [])[1];
  setFilter(q || "all");
})();
