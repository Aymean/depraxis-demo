/* =====================================================================
   BOOK page — the 3-step booking flow (Apps Script calendar bridge with
   the honest WhatsApp fallback) and the warm ripple shader behind it.
   Logic is the single-page build's, unchanged apart from the cut
   department option and the shared core (language, nav).
   ===================================================================== */
(function () {
  "use strict";
  var WA = DPX.WA, reduced = DPX.reduced, saveData = DPX.saveData, lang = DPX.lang;
  /* Direct-to-calendar booking (Google Apps Script Web App URL).
     Empty = not wired up yet, so the form falls back to WhatsApp-only,
     exactly like before. Paste the deployed /exec URL here to switch on
     the default direct-booking path. See HANDOFF.md. */
  var BOOKING_API_URL = "https://script.google.com/macros/s/AKfycbxcVqQyUIyKWy8nctMzf6vK4GCgXdJJgT44h9AWfqjKqkMaTb0JbZqBOVruowIGO0Q/exec";

  var STR = {
    ar: {
      title: "مجمع دي براكسس الطبي | Dpraxis Beauty Clinic — جدة",
      dept: { dental:"قسم الأسنان", derm:"قسم الجلدية والتجميل", laser:"قسم الليزر" },
      days: ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
      daysShort: ["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"],
      months: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
      errPick: "اختر اليوم والوقت أولاً.",
      errName: "الرجاء كتابة الاسم ورقم الجوال.",
      closed: "الجمعة مغلق",
      noSlots: "لم يتبقَّ وقت في هذا اليوم — اختر يوماً آخر.",
      sumFmt: function (d, day, time) { return d + " — " + day + "، الساعة " + time; },
      calTitle: "موعد في مجمع دي براكسس الطبي",
      calDetails: "تذكير شخصي بموعدك المطلوب في مجمع دي براكسس الطبي. لم يؤكّد المجمع الموعد تلقائياً — التأكيد يصلك عبر واتساب.",
      calDetailsConfirmed: "موعدك في مجمع دي براكسس الطبي — محجوز فعلياً.",
      booking: "يتم الحجز في تقويم المجمع…",
      slotTaken: "للأسف حُجز هذا الوقت للتو. اختر وقتاً آخر.",
      waAlt: "تفضّل واتساب بدل ذلك؟",
      directTitle: "تم حجز موعدك",
      directBody: "وُضع طلبك مباشرة في تقويم المجمع — الموعد محجوز فعلياً، لا داعي لانتظار ردّ.",
      waTitle: "فُتح واتساب بطلبك",
      waBody: "راجع الرسالة ثم أرسلها. لم يُحجز الموعد بعد — يُؤكَّد فقط بعد ردّ المجمع.",
      bookHeadingLive: "ثلاث خطوات،<br>وحجز فوري.",
      bookIntroLive: "اختر القسم، ثم اليوم والوقت الذي يناسبك، ثم اكتب اسمك. الموعد يُحجز مباشرة في تقويم المجمع — لا حاجة لانتظار ردّ. تفضّل التواصل أولاً؟ واتساب متاح دائماً.",
      step2noteLive: "الأوقات المعروضة هنا محدَّثة فعلياً من تقويم المجمع — ما هو محجوز لا يظهر لك. الجمعة مغلق.",
      submitLabelLive: "احجز الموعد",
      formnoteLive: "يُحجز الموعد مباشرة في تقويم المجمع فور الإرسال."
    },
    en: {
      title: "Dpraxis Beauty Clinic | مجمع دي براكسس الطبي — Jeddah",
      dept: { dental:"Dentistry", derm:"Dermatology & aesthetics", laser:"Laser" },
      days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      daysShort: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      errPick: "Pick a day and a time first.",
      errName: "Please add your name and mobile number.",
      closed: "Closed Friday",
      noSlots: "No times left on this day — pick another day.",
      sumFmt: function (d, day, time) { return d + " — " + day + " at " + time; },
      calTitle: "Appointment at De Praxes Medical Complex",
      calDetails: "A personal reminder for the time you requested at De Praxes Medical Complex. The clinic has not confirmed automatically — confirmation comes to you on WhatsApp.",
      calDetailsConfirmed: "Your appointment at De Praxes Medical Complex — actually booked.",
      booking: "Booking it into the clinic's calendar…",
      slotTaken: "That time was just taken. Please pick another.",
      waAlt: "Prefer WhatsApp instead?",
      directTitle: "Your appointment is booked",
      directBody: "Your request was written straight onto the clinic's calendar — the appointment is actually booked, no waiting on a reply needed.",
      waTitle: "WhatsApp is open with your request",
      waBody: "Review the message, then send it. The appointment is not booked yet — it's only confirmed once the clinic replies.",
      bookHeadingLive: "Three steps,<br>booked instantly.",
      bookIntroLive: "Pick the department, then the day and time that suits you, then add your name. The appointment is booked straight onto the clinic's calendar — no waiting on a reply needed. Want to talk first instead? WhatsApp is always there too.",
      step2noteLive: "The times shown here are checked live against the clinic's calendar — anything already booked won't show up. Closed Fridays.",
      submitLabelLive: "Book the appointment",
      formnoteLive: "The appointment is booked straight onto the clinic's calendar the moment you send it."
    }
  };

  /*  =====================================================================
     4. BOOKING FLOW
        Step 1 department, step 2 day + preferred time, step 3 details.
        Submitting opens a real WhatsApp chat to the clinic's real number
        with the request written out. Nothing is auto-sent and nothing on
        screen claims the appointment is confirmed.
     ===================================================================== */
  var sel = { dept: null, date: null, time: null };
  var busyRanges = [];       /* real busy times on the clinic's calendar, for sel.date */
  var busyForDate = null;    /* which date busyRanges belongs to */
  var steps = [].slice.call(document.querySelectorAll(".step"));
  var stepDots = [].slice.call(document.querySelectorAll("#bsteps [data-s]"));
  var history = [];

  function showStep(n, push) {
    steps.forEach(function (s) { s.classList.toggle("on", +s.getAttribute("data-step") === n); });
    stepDots.forEach(function (d) {
      var i = +d.getAttribute("data-s");
      var dot = d.querySelector(".bstep");
      var done = i < n, cur = i === n;
      dot.classList.toggle("bg-cream", cur);
      dot.classList.toggle("text-ink", cur);
      dot.classList.toggle("border-cream", cur || done);
      d.classList.toggle("text-cream", cur);
      d.classList.toggle("text-cream/40", !cur);
    });
    if (push !== false) history.push(n);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  document.querySelectorAll("#book [data-dept]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#book [data-dept]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      sel.dept = b.getAttribute("data-dept");
      showStep(2);
    });
  });
  document.querySelectorAll(".bnav-back").forEach(function (b) {
    b.addEventListener("click", function () {
      history.pop();
      showStep(history.length ? history[history.length - 1] : 1, false);
    });
  });

  /* ---- day picker: real opening days only (Friday closed) ---- */
  var weekOffset = 0;
  var daygrid = document.getElementById("daygrid");
  var wlabel  = document.getElementById("wlabel");

  function startOfWeek(offset) {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset * 7);
    return d;
  }
  function fmtISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function renderDays() {
    if (!daygrid) return;
    var L = STR[lang()], base = startOfWeek(weekOffset), today = new Date(); today.setHours(0, 0, 0, 0);
    var out = "";
    for (var i = 0; i < 7; i++) {
      var d = new Date(base); d.setDate(base.getDate() + i);
      var iso = fmtISO(d), friday = d.getDay() === 5, past = d < today;
      var spent = (+d === +today) && (new Date()).getHours() >= 21;   /* last slot already gone */
      var off = friday || past || spent;
      out += '<button type="button" class="daybtn" data-date="' + iso + '"' +
             (off ? " disabled" : "") + ' aria-pressed="' + (sel.date === iso ? "true" : "false") + '">' +
             '<span class="block text-[.68rem] opacity-55">' + L.daysShort[d.getDay()] + '</span>' +
             '<span class="block num text-[1.02rem] mt-0.5">' + d.getDate() + '</span></button>';
    }
    daygrid.innerHTML = out;
    var end = new Date(base); end.setDate(base.getDate() + 6);
    wlabel.textContent = L.months[base.getMonth()] + " " + base.getDate() + " – " +
                         (base.getMonth() !== end.getMonth() ? L.months[end.getMonth()] + " " : "") + end.getDate();
    daygrid.querySelectorAll(".daybtn").forEach(function (b) {
      b.addEventListener("click", function () {
        sel.date = b.getAttribute("data-date");
        daygrid.querySelectorAll(".daybtn").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        fetchBusyTimes(sel.date);
        renderSlots(); updateSummary();
      });
    });
  }
  document.getElementById("wprev").addEventListener("click", function () { if (weekOffset > 0) { weekOffset--; renderDays(); } });
  document.getElementById("wnext").addEventListener("click", function () { if (weekOffset < 6) { weekOffset++; renderDays(); } });

  /* ---- real availability from the clinic's calendar (only once BOOKING_API_URL is set) ---- */
  function fetchBusyTimes(dateISO) {
    if (!BOOKING_API_URL) { busyRanges = []; busyForDate = dateISO; return; }
    busyForDate = null; /* mark stale until this resolves, so renderSlots doesn't trust an old day's ranges */
    fetch(BOOKING_API_URL + "?date=" + encodeURIComponent(dateISO))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        busyRanges = (data.busy || []).map(function (b) { return { start: new Date(b.start), end: new Date(b.end) }; });
        busyForDate = dateISO;
        if (sel.date === dateISO) renderSlots();
      })
      .catch(function () {
        /* fail open — a broken availability check must never block booking */
        busyRanges = []; busyForDate = dateISO;
        if (sel.date === dateISO) renderSlots();
      });
  }
  function slotIsBusy(dateISO, h) {
    if (busyForDate !== dateISO || !busyRanges.length) return false;
    var start = new Date(dateISO + "T" + String(h).padStart(2, "0") + ":00:00");
    var end = new Date(dateISO + "T" + String(h + 1).padStart(2, "0") + ":00:00");
    return busyRanges.some(function (b) { return start < b.end && end > b.start; });
  }

  /* ---- time slots: the clinic's real opening window, 10:00 to 22:00 ---- */
  var slotgrid = document.getElementById("slotgrid");
  function renderSlots() {
    if (!slotgrid) return;
    var out = "", now = new Date(), isToday = sel.date === fmtISO(now);
    for (var h = 10; h <= 21; h++) {
      var label = (lang() === "ar")
        ? (h > 12 ? (h - 12) + ":00 م" : h + ":00 " + (h === 12 ? "م" : "ص"))
        : String(h).padStart(2, "0") + ":00";
      var past = isToday && h <= now.getHours();
      var taken = slotIsBusy(sel.date, h);
      out += '<button type="button" class="slot" data-time="' + String(h).padStart(2, "0") + ':00"' +
             (past || taken ? " disabled" : "") + (taken ? ' data-taken="1"' : "") +
             ' aria-pressed="' + (sel.time === String(h).padStart(2, "0") + ":00" ? "true" : "false") +
             '"><span class="ltr">' + label + '</span></button>';
    }
    slotgrid.innerHTML = out;
    var none = slotgrid.querySelectorAll(".slot:not([disabled])").length === 0;
    var msg = document.getElementById("noslots");
    if (none && sel.date) {
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "noslots";
        msg.className = "mt-3 text-[.84rem] text-sand";
        slotgrid.parentNode.insertBefore(msg, slotgrid.nextSibling);
      }
      msg.textContent = STR[lang()].noSlots;
    } else if (msg) { msg.remove(); }
    slotgrid.querySelectorAll(".slot").forEach(function (b) {
      b.addEventListener("click", function () {
        sel.time = b.getAttribute("data-time");
        slotgrid.querySelectorAll(".slot").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        updateSummary();
      });
    });
  }

  function prettyDate() {
    if (!sel.date) return "";
    var L = STR[lang()], p = sel.date.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return L.days[d.getDay()] + "، " + d.getDate() + " " + L.months[d.getMonth()] + " " + d.getFullYear();
  }
  function prettyTime() {
    if (!sel.time) return "";
    var h = +sel.time.split(":")[0];
    return (lang() === "ar")
      ? (h > 12 ? (h - 12) + ":00 مساءً" : h + ":00 " + (h === 12 ? "ظهراً" : "صباحاً"))
      : String(h).padStart(2, "0") + ":00";
  }
  function updateSummary() {
    var el = document.getElementById("bsummary");
    if (!el) return;
    var L = STR[lang()];
    var parts = [];
    if (sel.dept) parts.push(L.dept[sel.dept]);
    if (sel.date) parts.push(prettyDate());
    if (sel.time) parts.push(prettyTime());
    el.textContent = parts.join(" · ");
  }

  var note = document.getElementById("formnote");
  var defaultNoteHTML = note.innerHTML;
  function setNote(text, warn) {
    note.textContent = text;
    note.className = "sm:col-span-2 text-[.85rem] " + (warn ? "text-sand" : "text-cream/55");
  }
  function resetNote() {
    note.innerHTML = defaultNoteHTML;
    note.className = "sm:col-span-2 text-[.85rem] text-cream/55";
  }

  /* ---- switches the booking section's copy from "WhatsApp" to "live calendar"
     the moment BOOKING_API_URL is actually configured. Until then, every default
     stays exactly as it shipped (WhatsApp-only). See HANDOFF.md. ---- */
  function applyBookingMode() {
    if (!BOOKING_API_URL) return;
    function pair(key) { return "<span lang-ar>" + STR.ar[key] + "</span><span lang-en>" + STR.en[key] + "</span>"; }
    document.getElementById("bookHeading").innerHTML   = pair("bookHeadingLive");
    document.getElementById("bookIntroText").innerHTML = pair("bookIntroLive");
    document.getElementById("step2note").innerHTML     = pair("step2noteLive");
    document.getElementById("submitLabelRest").innerHTML =
      '<svg class="icon text-[1.15rem]"><use href="#i-calendar"></use></svg>' + pair("submitLabelLive");
    document.getElementById("submitLabelGo").innerHTML =
      pair("submitLabelLive") + '<svg class="icon text-[1rem] flip"><use href="#i-arrow"></use></svg>';
    defaultNoteHTML = pair("formnoteLive");
    resetNote();
    document.getElementById("waAltBtn").hidden = false;
  }

  function buildWaBody(L, name, phone, msg) {
    return (lang() === "ar")
      ? ("السلام عليكم، أرغب بحجز موعد في مجمع دي براكسس الطبي.\n\n" +
         "القسم: " + L.dept[sel.dept] + "\n" +
         "اليوم المفضّل: " + prettyDate() + "\n" +
         "الوقت المفضّل: " + prettyTime() + "\n" +
         "الاسم: " + name + "\n" +
         "رقم الجوال: " + phone +
         (msg ? "\nالاستفسار: " + msg : "") +
         "\n\n(أرسِلت من الموقع — بانتظار تأكيدكم للموعد)")
      : ("Hello, I would like to request an appointment at De Praxes Medical Complex.\n\n" +
         "Department: " + L.dept[sel.dept] + "\n" +
         "Preferred day: " + prettyDate() + "\n" +
         "Preferred time: " + prettyTime() + "\n" +
         "Name: " + name + "\n" +
         "Mobile: " + phone +
         (msg ? "\nEnquiry: " + msg : "") +
         "\n\n(Sent from the website — awaiting your confirmation)");
  }

  function goWhatsApp(body) {
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(body), "_blank", "noopener");
  }

  /* Personal calendar reminder — the visitor's own calendar, never the clinic's,
     whichever path booked the appointment. */
  function buildAddToCalLink(L, detailsText) {
    var p = sel.date.split("-"), h = sel.time.split(":")[0];
    var stamp = p[0] + p[1] + p[2] + "T" + h + "0000";
    var endH  = String(Math.min(23, +h + 1)).padStart(2, "0");
    var stampEnd = p[0] + p[1] + p[2] + "T" + endH + "0000";
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text="     + encodeURIComponent(L.calTitle + " — " + L.dept[sel.dept]) +
      "&dates="    + stamp + "/" + stampEnd +
      "&details="  + encodeURIComponent(detailsText) +
      "&location=" + encodeURIComponent("مجمع دي براكسس، الحميضي بلازا، طريق الأمير سلطان، حي الخالدية، جدة 23423") +
      "&ctz=Asia/Riyadh";
  }

  function finishStep4(direct, L, body) {
    document.getElementById("gcalbtn").setAttribute("href", buildAddToCalLink(L, direct ? L.calDetailsConfirmed : L.calDetails));
    document.getElementById("step4Icon").querySelector("use").setAttribute("href", direct ? "#i-calendar" : "#i-wa");
    var tKey = direct ? "directTitle" : "waTitle", bKey = direct ? "directBody" : "waBody";
    document.getElementById("step4Title").innerHTML = "<span lang-ar>" + STR.ar[tKey] + "</span><span lang-en>" + STR.en[tKey] + "</span>";
    document.getElementById("step4Body").innerHTML  = "<span lang-ar>" + STR.ar[bKey] + "</span><span lang-en>" + STR.en[bKey] + "</span>";
    document.getElementById("step4WaBtn").setAttribute("href",
      direct ? ("https://wa.me/" + WA) : ("https://wa.me/" + WA + "?text=" + encodeURIComponent(body || "")));
    showStep(4);
  }

  function submitDirect(name, phone, msg, body, L) {
    var btn = document.getElementById("bookSubmitBtn");
    btn.disabled = true;
    setNote(L.booking, false);
    fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, /* keeps this a "simple request" — no CORS preflight against Apps Script */
      body: JSON.stringify({
        department: L.dept[sel.dept], date: sel.date, time: sel.time,
        name: name, phone: phone, note: msg
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        btn.disabled = false;
        if (res && res.ok) {
          finishStep4(true, L, body);
        } else {
          /* someone else took the slot between the availability check and this submit */
          setNote(L.slotTaken, true);
          fetchBusyTimes(sel.date);
          showStep(2);
        }
      })
      .catch(function () {
        /* booking API unreachable — never lose the request, fall back to the honest WhatsApp path */
        btn.disabled = false;
        goWhatsApp(body);
        finishStep4(false, L, body);
      });
  }

  document.getElementById("to3").addEventListener("click", function () {
    var L = STR[lang()];
    if (!sel.date || !sel.time) {
      wlabel.insertAdjacentHTML("afterend", "");
      var warn = document.getElementById("pickwarn");
      if (!warn) {
        warn = document.createElement("p");
        warn.id = "pickwarn";
        warn.className = "mt-4 text-[.85rem] text-sand";
        slotgrid.parentNode.insertBefore(warn, slotgrid.nextSibling);
      }
      warn.textContent = L.errPick;
      return;
    }
    var w = document.getElementById("pickwarn"); if (w) w.remove();
    updateSummary();
    showStep(3);
  });

  document.getElementById("bookform").addEventListener("submit", function (e) {
    e.preventDefault();
    var L = STR[lang()];
    var name  = document.getElementById("f-name").value.trim();
    var phone = document.getElementById("f-phone").value.trim();
    var msg   = document.getElementById("f-note").value.trim();
    if (!name || !phone) {
      setNote(L.errName, true);
      (name ? document.getElementById("f-phone") : document.getElementById("f-name")).focus();
      return;
    }
    var body = buildWaBody(L, name, phone, msg);
    if (BOOKING_API_URL) {
      submitDirect(name, phone, msg, body, L);
    } else {
      goWhatsApp(body);
      finishStep4(false, L, body);
    }
  });

  document.getElementById("waAltBtn").addEventListener("click", function () {
    var L = STR[lang()];
    var name  = document.getElementById("f-name").value.trim();
    var phone = document.getElementById("f-phone").value.trim();
    var msg   = document.getElementById("f-note").value.trim();
    if (!name || !phone) {
      setNote(L.errName, true);
      (name ? document.getElementById("f-phone") : document.getElementById("f-name")).focus();
      return;
    }
    var body = buildWaBody(L, name, phone, msg);
    goWhatsApp(body);
    finishStep4(false, L, body);
  });

  document.getElementById("bookagain").addEventListener("click", function () {
    sel = { dept: null, date: null, time: null };
    history = [];
    document.querySelectorAll("#book [data-dept]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
    document.getElementById("bookform").reset();
    resetNote();
    renderDays(); renderSlots(); updateSummary();
    showStep(1);
  });


  applyBookingMode();
  DPX.onLang(function () { renderDays(); renderSlots(); updateSummary(); });
  showStep(1, false);
  history = [1];

  /* =====================================================================
     7. GPU CAPABILITY GATE — used by the book-section shader. The static
        fallback underneath is always painted first and only fades out once
        the shader is actually rendering.
     ===================================================================== */
  function gpuCapable() {
    if (reduced || saveData) return false;
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 3) return false;
    /* don't pull WebGL work down a slow connection */
    var et = navigator.connection && navigator.connection.effectiveType;
    if (et && (et === "slow-2g" || et === "2g" || et === "3g")) return false;
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }

  /* =====================================================================
     8. BOOK-SECTION SHADER — real WebGL plasma/ripple background, ported
        from 21st.dev's Warmth Ripple (raw GLSL, zero-dependency) and
        retinted from its demo red/amber to this site's own char/bronze/sand.
        Same gate as the hero, plus an IntersectionObserver so the raf loop
        only runs while the section is actually on screen.
     ===================================================================== */
  function initBookShader() {
    if (!gpuCapable()) return;
    var canvas = document.getElementById("bookshader");
    if (!canvas) return;
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    var vsSrc = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

    /* Real Warp/plasma fragment shader, ported from paper-design/shaders
       (packages/shaders/src/shaders/warp.ts, Apache-2.0) — the open-source
       library behind the 21st.dev Shader Builder that generated "Warmth
       Ripple". 21st.dev's own Component.tsx tab is behind an account wall, so
       the technique was taken from its upstream instead of guessed at, and
       the mechanism is reproduced step for step:
         t        = 0.0625 * (time + 118)      (their firstFrameOffset)
         n1,n2    = valueNoise(uv + t), valueNoise(uv*2 - t)
         angle    = n1 * TWO_PI, then uv += 4*distortion*n2*(cos,sin)(angle)
         swirl    = iterative uv.x += swirl/i*cos(t + i*1.5*uv.y), and the
                    mirrored line for uv.y
         shape    = their "stripes" base pattern
         gradient = their per-stop softness/step colour mixing
       Two documented adaptations, both forced by the target: their randomiser
       samples a shipped noise texture (u_noiseTexture) — replaced with a hash
       value-noise so nothing extra has to ship — and their fwidth()-based
       antialias term needs OES_standard_derivatives on WebGL1, so it is a
       small constant here. Palette is our locked char/bronze/sand/cream in
       place of their #160B0B/#C2402A/#F49D37/#FFE8C2 — same warm-dark family,
       tuned to LAVA Dental and Dr Grigoriak's warm-brown-on-black register
       rather than their terracotta red. */
    var fsSrc = [
      "precision highp float;",
      "uniform vec2 uRes; uniform float uTime;",
      "#define TWO_PI 6.28318530718",
      /* locked palette: char #221F1B, bronze #8C6A3F, sand #C8B08A, cream #F5F1E8 */
      "const vec3 C0 = vec3(0.1333,0.1216,0.1059);",
      "const vec3 C1 = vec3(0.5490,0.4157,0.2471);",
      "const vec3 C2 = vec3(0.7843,0.6902,0.5412);",
      "const vec3 C3 = vec3(0.9608,0.9451,0.9098);",
      "float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031);",
      "  q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }",
      "float valueNoise(vec2 st){",
      "  vec2 i = floor(st), f = fract(st);",
      "  float a = hash(i), b = hash(i + vec2(1.0,0.0));",
      "  float c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));",
      "  vec2 u = f * f * (3.0 - 2.0 * f);",
      "  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y); }",
      /* their per-stop mix: step toward the boundary, then lerp that back
         toward the raw mixer by the softness amount */
      "float stopMix(float mixer, float idx, float softness){",
      "  float m = clamp(mixer - idx, 0.0, 1.0);",
      "  float start = floor(m);",
      "  float soft = 0.5 * softness + 0.01;",
      "  float sm = smoothstep(max(0.0, 0.5 - soft - 0.01), min(1.0, 0.5 + soft + 0.01), m - start);",
      "  return mix(start + sm, m, softness); }",
      "void main(){",
      "  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / max(uRes.y, 1.0);",
      "  uv *= 1.45;",
      "  uv *= 0.5;",
      "  float t = 0.0625 * (uTime + 118.0);",
      "  float n1 = valueNoise(uv * 1.0 + t);",
      "  float n2 = valueNoise(uv * 2.0 - t);",
      "  float angle = n1 * TWO_PI;",
      "  const float distortion = 0.30;",
      "  const float swirl = 0.55;",
      "  uv.x += 4.0 * distortion * n2 * cos(angle);",
      "  uv.y += 4.0 * distortion * n2 * sin(angle);",
      "  for (int i = 1; i < 8; i++) {",
      "    float fi = float(i);",
      "    uv.x += swirl / fi * cos(t + fi * 1.5 * uv.y);",
      "    uv.y += swirl / fi * cos(t + fi * 1.0 * uv.x); }",
      "  const float proportion = 0.40;",
      "  const float softness = 0.9;",
      "  const float shapeScale = 0.55;",
      "  vec2 sUv = uv * (2.0 * shapeScale);",
      "  float fy = fract(sUv.y);",
      "  float shape = smoothstep(0.0, 0.55, fy) * (1.0 - smoothstep(0.45, 1.0, fy));",
      "  shape += 0.48 * sign(proportion - 0.5) * pow(abs(proportion - 0.5), 0.5);",
      "  float mixer = shape * 3.0;",
      "  vec3 grad = C0;",
      "  grad = mix(grad, C1, stopMix(mixer, 0.0, softness));",
      "  grad = mix(grad, C2, stopMix(mixer, 1.0, softness));",
      "  grad = mix(grad, C3, stopMix(mixer, 2.0, softness));",
      "  gl_FragColor = vec4(grad, 1.0); }"
    ].join("\n");

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var vs = compile(gl.VERTEX_SHADER, vsSrc);
    var fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var pLoc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, "uRes");
    var uTime = gl.getUniformLocation(prog, "uTime");

    function resize() {
      var host = canvas.parentNode;
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      /* a full-viewport fragment shader is pure fill-rate cost; on phones the
         section is tall and narrow, so cap the backing store harder there —
         the effect is a soft gradient field and does not need the pixels. */
      var dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 0.85 : 1.15);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    var running = false, started = false, t0 = performance.now();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { running = en[0].isIntersecting; }, { threshold: 0.02 })
        .observe(canvas.parentNode);
    } else { running = true; }

    function frame(now) {
      requestAnimationFrame(frame);
      if (!running) return;
      var t = (now - t0) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!started) { started = true; canvas.classList.add("on"); }
    }
    requestAnimationFrame(frame);
  }
  if ("requestIdleCallback" in window) requestIdleCallback(initBookShader, { timeout: 3000 });
  else window.addEventListener("load", function () { setTimeout(initBookShader, 600); });
})();
