/* =====================================================================
   BOOK page — the 3-step WhatsApp booking request (department, preferred
   day + period, name) and the warm ripple shader behind it.
   ===================================================================== */
(function () {
  "use strict";
  var WA = DPX.WA, reduced = DPX.reduced, saveData = DPX.saveData, lang = DPX.lang;

  /* Opening hours (contact page): Saturday to Thursday 10:00–22:00, Friday closed.
     The visitor picks a preferred day + period; the request goes to reception on
     WhatsApp. No calendar, no network calls — reception confirms the real time. */
  var PERIODS = [
    { key: "morning",   from: 10, to: 13 },
    { key: "afternoon", from: 13, to: 17 },
    { key: "evening",   from: 17, to: 22 }
  ];
  var DAYS_AHEAD = 14;

  var STR = {
    ar: {
      dept: { dental:"قسم الأسنان", derm:"قسم الجلدية والتجميل", laser:"قسم الليزر" },
      days: ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
      daysShort: ["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"],
      months: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
      period: { morning:"صباحاً", afternoon:"ظهراً", evening:"مساءً" },
      periodHours: { morning:"10 ص – 1 م", afternoon:"1 م – 5 م", evening:"5 م – 10 م" },
      errPick: "اختر اليوم والفترة أولاً.",
      errName: "الرجاء كتابة الاسم.",
      noSlots: "انتهت فترات هذا اليوم — اختر يوماً آخر."
    },
    en: {
      dept: { dental:"Dentistry", derm:"Dermatology & aesthetics", laser:"Laser" },
      days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      daysShort: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      period: { morning:"Morning", afternoon:"Afternoon", evening:"Evening" },
      periodHours: { morning:"10:00 – 13:00", afternoon:"13:00 – 17:00", evening:"17:00 – 22:00" },
      errPick: "Pick a day and a time of day first.",
      errName: "Please add your name.",
      noSlots: "No periods left on this day — pick another day."
    }
  };

  /*  =====================================================================
     BOOKING REQUEST FLOW
        Step 1 department, step 2 preferred day + period, step 3 name + note.
        Submitting opens WhatsApp to the clinic's number with the request
        written out. Nothing is auto-sent; reception confirms on WhatsApp.
     ===================================================================== */
  var sel = { dept: null, date: null, period: null };
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

  /* ---- day picker: the next 14 days, Friday closed ---- */
  var weekOffset = 0;
  var daygrid = document.getElementById("daygrid");
  var wlabel  = document.getElementById("wlabel");

  function today0() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function fmtISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function periodOpen(dateISO, p) {
    if (dateISO !== fmtISO(new Date())) return true;
    return new Date().getHours() < p.to - 1;   /* at least an hour of the period left */
  }
  function periodByKey(k) { return PERIODS.filter(function (p) { return p.key === k; })[0]; }

  function renderDays() {
    if (!daygrid) return;
    var L = STR[lang()], base = today0();
    base.setDate(base.getDate() + weekOffset * 7);
    var out = "";
    for (var i = 0; i < 7; i++) {
      var d = new Date(base); d.setDate(base.getDate() + i);
      var iso = fmtISO(d), friday = d.getDay() === 5;
      var spent = !PERIODS.some(function (p) { return periodOpen(iso, p); });
      var off = friday || spent;
      out += '<button type="button" class="daybtn" data-date="' + iso + '"' +
             (off ? " disabled" : "") + ' aria-pressed="' + (sel.date === iso ? "true" : "false") + '">' +
             '<span class="block text-[.68rem] opacity-55">' + L.daysShort[d.getDay()] + '</span>' +
             '<span class="block num text-[1.02rem] mt-0.5">' + d.getDate() + '</span></button>';
    }
    daygrid.innerHTML = out;
    var end = new Date(base); end.setDate(base.getDate() + 6);
    wlabel.textContent = L.months[base.getMonth()] + " " + base.getDate() + " – " +
                         (base.getMonth() !== end.getMonth() ? L.months[end.getMonth()] + " " : "") + end.getDate();
    document.getElementById("wprev").disabled = weekOffset === 0;
    document.getElementById("wnext").disabled = (weekOffset + 1) * 7 >= DAYS_AHEAD;
    daygrid.querySelectorAll(".daybtn").forEach(function (b) {
      b.addEventListener("click", function () {
        sel.date = b.getAttribute("data-date");
        daygrid.querySelectorAll(".daybtn").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        if (sel.period && !periodOpen(sel.date, periodByKey(sel.period))) sel.period = null;
        renderSlots(); updateSummary();
      });
    });
  }
  document.getElementById("wprev").addEventListener("click", function () { if (weekOffset > 0) { weekOffset--; renderDays(); } });
  document.getElementById("wnext").addEventListener("click", function () { if ((weekOffset + 1) * 7 < DAYS_AHEAD) { weekOffset++; renderDays(); } });

  /* ---- preferred period: morning / afternoon / evening ---- */
  var slotgrid = document.getElementById("slotgrid");
  function renderSlots() {
    if (!slotgrid) return;
    var L = STR[lang()], out = "";
    PERIODS.forEach(function (p) {
      var off = sel.date && !periodOpen(sel.date, p);
      out += '<button type="button" class="slot" data-period="' + p.key + '"' + (off ? " disabled" : "") +
             ' aria-pressed="' + (sel.period === p.key ? "true" : "false") + '">' +
             '<span class="block text-[.95rem]">' + L.period[p.key] + '</span>' +
             '<span class="block text-[.72rem] opacity-60 mt-0.5">' + L.periodHours[p.key] + '</span></button>';
    });
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
      msg.textContent = L.noSlots;
    } else if (msg) { msg.remove(); }
    slotgrid.querySelectorAll(".slot").forEach(function (b) {
      b.addEventListener("click", function () {
        sel.period = b.getAttribute("data-period");
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
    return L.days[d.getDay()] + " " + d.getDate() + " " + L.months[d.getMonth()];
  }
  function updateSummary() {
    var el = document.getElementById("bsummary");
    if (!el) return;
    var L = STR[lang()], parts = [];
    if (sel.dept) parts.push(L.dept[sel.dept]);
    if (sel.date) parts.push(prettyDate());
    if (sel.period) parts.push(L.period[sel.period] + " (" + L.periodHours[sel.period] + ")");
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

  function buildWaBody(L, name, msg) {
    var dept = L.dept[sel.dept], when = prettyDate();
    return (lang() === "ar")
      ? ("السلام عليكم، أبغى أحجز موعد في " + dept + "، يوم " + when + " " + L.period[sel.period] + ".\n" +
         "الاسم: " + name + (msg ? "\nملاحظة: " + msg : ""))
      : ("Hello, I'd like to book an appointment in " + dept + " on " + when + ", in the " +
         L.period[sel.period].toLowerCase() + ".\n" +
         "Name: " + name + (msg ? "\nNote: " + msg : ""));
  }
  function waLink(body) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(body); }

  document.getElementById("to3").addEventListener("click", function () {
    var L = STR[lang()];
    if (!sel.date || !sel.period) {
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
    var name = document.getElementById("f-name").value.trim();
    var msg  = document.getElementById("f-note").value.trim();
    if (!name) {
      setNote(L.errName, true);
      document.getElementById("f-name").focus();
      return;
    }
    resetNote();
    var body = buildWaBody(L, name, msg);
    window.open(waLink(body), "_blank", "noopener");
    document.getElementById("step4WaBtn").setAttribute("href", waLink(body));
    showStep(4);
  });

  document.getElementById("bookagain").addEventListener("click", function () {
    sel = { dept: null, date: null, period: null };
    history = [];
    weekOffset = 0;
    document.querySelectorAll("#book [data-dept]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
    document.getElementById("bookform").reset();
    resetNote();
    renderDays(); renderSlots(); updateSummary();
    showStep(1);
  });

  renderDays(); renderSlots();
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
