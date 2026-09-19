/* ============================================================
   site.js — רכיבים משותפים לכל דפי האתר:
   1. באנר הסכמה לעוגיות (מפעיל את פיקסל מטא רק אחרי אישור)
   2. כפתור + תפריט נגישות (שומר העדפות בדפדפן)
   ============================================================ */
(function () {
  "use strict";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- סגנונות ---------- */
  var css = [
    /* cookie banner */
    "#ckBar{position:fixed;bottom:0;inset-inline:0;z-index:70;background:#fff;border-top:1px solid #e7e0d5;box-shadow:0 -8px 30px rgba(23,19,16,.12);padding:14px 18px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;font-size:.92rem;line-height:1.5}",
    "#ckBar p{margin:0;max-width:640px}",
    "#ckBar a{color:#5d3c23;font-weight:500}",
    "#ckBar .ck-btns{display:flex;gap:10px;flex-shrink:0}",
    "#ckBar button{font-family:inherit;font-size:.95rem;font-weight:700;border-radius:999px;padding:10px 26px;cursor:pointer}",
    "#ckAccept{background:#171310;color:#fff;border:none}",
    "#ckDecline{background:none;color:#171310;border:1px solid #c9c2b6}",
    /* a11y button */
    "#a11yBtn{position:fixed;bottom:18px;left:18px;z-index:71;width:52px;height:52px;border-radius:50%;background:#5d3c23;border:2px solid #f6f2ea;box-shadow:0 6px 18px rgba(0,0,0,.3);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}",
    "#a11yBtn svg{width:28px;height:28px;fill:#fff}",
    /* a11y panel */
    "#a11yPanel{position:fixed;bottom:80px;left:18px;z-index:72;width:min(320px,calc(100vw - 36px));background:#fff;border:1px solid #e7e0d5;border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.25);padding:20px;direction:rtl;display:none}",
    "#a11yPanel.open{display:block}",
    "#a11yPanel h2{font-size:1.1rem;font-weight:700;margin:0 0 14px;color:#171310}",
    "#a11yPanel .row{display:flex;align-items:center;justify-content:space-between;background:#f8f5f0;border-radius:12px;padding:10px 14px;margin-bottom:10px;font-size:.95rem;color:#171310}",
    "#a11yPanel .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}",
    "#a11yPanel .tgl{font-family:inherit;background:#f8f5f0;border:2px solid transparent;border-radius:12px;padding:12px 8px;font-size:.88rem;font-weight:500;color:#171310;cursor:pointer;text-align:center}",
    "#a11yPanel .tgl.on{border-color:#5d3c23;background:rgba(93,60,35,.08);font-weight:700}",
    "#a11yPanel .fsbtn{width:34px;height:34px;border-radius:9px;border:none;background:#5d3c23;color:#fff;font-size:1.1rem;font-weight:700;cursor:pointer}",
    "#a11yReset{font-family:inherit;width:100%;background:none;border:1px solid #c9c2b6;border-radius:12px;padding:11px;font-size:.92rem;font-weight:500;cursor:pointer;color:#171310;margin-bottom:10px}",
    "#a11yPanel .stmt{display:block;text-align:center;font-size:.88rem;color:#5d3c23}",
    /* a11y effect classes */
    "html.a11y-fs1 body{zoom:1.1}html.a11y-fs2 body{zoom:1.22}html.a11y-fs3 body{zoom:1.35}",
    /* filters are applied to the page content only — never to the
       floating widget/banner, whose fixed positioning a filtered
       ancestor would break */
    "html.a11y-contrast body{background:#000}",
    "html.a11y-contrast body>*:not(#a11yBtn):not(#a11yPanel):not(#ckBar){filter:invert(1) hue-rotate(180deg)}",
    "html.a11y-contrast body img,html.a11y-contrast body video,html.a11y-contrast body iframe{filter:invert(1) hue-rotate(180deg)}",
    "html.a11y-gray body>*:not(#a11yBtn):not(#a11yPanel):not(#ckBar){filter:grayscale(1)}",
    "html.a11y-contrast.a11y-gray body>*:not(#a11yBtn):not(#a11yPanel):not(#ckBar){filter:invert(1) hue-rotate(180deg) grayscale(1)}",
    "html.a11y-contrast.a11y-gray body img,html.a11y-contrast.a11y-gray body video{filter:invert(1) hue-rotate(180deg)}",
    "html.a11y-font body,html.a11y-font body *{font-family:Arial,Helvetica,sans-serif!important}",
    "html.a11y-links a{text-decoration:underline!important;text-underline-offset:3px;text-decoration-thickness:2px}",
    "html.a11y-noanim *{animation:none!important;transition:none!important}html.a11y-noanim{scroll-behavior:auto!important}",
    "@media(max-width:600px){#ckBar{padding-bottom:max(14px,env(safe-area-inset-bottom))}}"
  ].join("\n");
  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- 1. הסכמה לעוגיות ---------- */
  function showBanner() {
    if (document.getElementById("ckBar")) return;
    var bar = document.createElement("div");
    bar.id = "ckBar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "הסכמה לשימוש בעוגיות");
    bar.innerHTML =
      '<p>אנחנו משתמשים בעוגיות כדי לתפעל את האתר ולשפר את החוויה. בלחיצה על "אישור" תאשר גם עוגיות מדידה ופרסום. מידע נוסף ב<a href="legal.html#cookies">מדיניות העוגיות</a>.</p>' +
      '<div class="ck-btns"><button id="ckAccept">אישור</button><button id="ckDecline">דחייה</button></div>';
    document.body.appendChild(bar);
    document.getElementById("ckAccept").addEventListener("click", function () {
      lsSet("cookie_consent", "yes");
      bar.remove();
      if (window.__initMetaPixel) window.__initMetaPixel();
    });
    document.getElementById("ckDecline").addEventListener("click", function () {
      lsSet("cookie_consent", "no");
      bar.remove();
    });
  }

  var consent = lsGet("cookie_consent");
  if (consent === "yes") {
    if (window.__initMetaPixel) window.__initMetaPixel();
  } else if (consent !== "no") {
    showBanner();
  }
  /* קישור "הגדרות עוגיות" בפוטר פותח את הבאנר מחדש */
  window.__openCookieSettings = function () {
    lsDel("cookie_consent");
    showBanner();
  };

  /* ---------- 2. נגישות ---------- */
  var TOGGLES = [
    { cls: "a11y-contrast", label: "ניגודיות גבוהה" },
    { cls: "a11y-gray", label: "גווני אפור" },
    { cls: "a11y-font", label: "פונט קריא" },
    { cls: "a11y-links", label: "הדגשת קישורים" },
    { cls: "a11y-noanim", label: "עצירת אנימציות" }
  ];

  function loadPrefs() {
    try { return JSON.parse(lsGet("a11y_prefs") || "{}"); } catch (e) { return {}; }
  }
  function savePrefs(p) { lsSet("a11y_prefs", JSON.stringify(p)); }

  var prefs = loadPrefs();
  function applyPrefs() {
    var h = document.documentElement;
    h.classList.remove("a11y-fs1", "a11y-fs2", "a11y-fs3");
    if (prefs.fs >= 1) h.classList.add("a11y-fs" + Math.min(prefs.fs, 3));
    TOGGLES.forEach(function (t) {
      h.classList.toggle(t.cls, !!(prefs.on && prefs.on.indexOf(t.cls) > -1));
    });
  }
  applyPrefs();

  /* כפתור */
  var btn = document.createElement("button");
  btn.id = "a11yBtn";
  btn.setAttribute("aria-label", "תפריט נגישות");
  btn.setAttribute("aria-haspopup", "dialog");
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="2.2"/><path d="M21 7.2c-2.9.8-5.9 1.2-9 1.2s-6.1-.4-9-1.2l-.5 1.9c1.9.6 3.9 1 6 1.2v3.1l-2.2 8 1.9.6 2.3-7h2.9l2.3 7 1.9-.6-2.2-8v-3.1c2.1-.2 4.1-.6 6-1.2L21 7.2z"/></svg>';
  document.body.appendChild(btn);

  /* פאנל */
  var panel = document.createElement("div");
  panel.id = "a11yPanel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "הגדרות נגישות");
  var togglesHtml = "";
  TOGGLES.forEach(function (t, i) {
    togglesHtml += '<button class="tgl" data-cls="' + t.cls + '">' + t.label + "</button>";
  });
  panel.innerHTML =
    "<h2>תפריט נגישות</h2>" +
    '<div class="row"><span>גודל טקסט</span><span><button class="fsbtn" id="fsMinus" aria-label="הקטנת טקסט">-</button> <button class="fsbtn" id="fsPlus" aria-label="הגדלת טקסט">+</button></span></div>' +
    '<div class="grid">' + togglesHtml + "</div>" +
    '<button id="a11yReset">איפוס הגדרות</button>' +
    '<a class="stmt" href="legal.html#a11y">להצהרת הנגישות המלאה</a>';
  document.body.appendChild(panel);

  function refreshUI() {
    panel.querySelectorAll(".tgl").forEach(function (b) {
      b.classList.toggle("on", !!(prefs.on && prefs.on.indexOf(b.getAttribute("data-cls")) > -1));
    });
  }

  btn.addEventListener("click", function () {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) refreshUI();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") panel.classList.remove("open");
  });

  document.getElementById("fsPlus").addEventListener("click", function () {
    prefs.fs = Math.min((prefs.fs || 0) + 1, 3); savePrefs(prefs); applyPrefs();
  });
  document.getElementById("fsMinus").addEventListener("click", function () {
    prefs.fs = Math.max((prefs.fs || 0) - 1, 0); savePrefs(prefs); applyPrefs();
  });
  panel.querySelectorAll(".tgl").forEach(function (b) {
    b.addEventListener("click", function () {
      var cls = b.getAttribute("data-cls");
      prefs.on = prefs.on || [];
      var i = prefs.on.indexOf(cls);
      if (i > -1) prefs.on.splice(i, 1); else prefs.on.push(cls);
      savePrefs(prefs); applyPrefs(); refreshUI();
    });
  });
  document.getElementById("a11yReset").addEventListener("click", function () {
    prefs = {}; lsDel("a11y_prefs"); applyPrefs(); refreshUI();
  });
})();
