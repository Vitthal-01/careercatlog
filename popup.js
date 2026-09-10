/* ============================================================
   Career Catalog — "Book a Call" popup + floating CTA
   ------------------------------------------------------------
   WHAT THIS FILE DOES
   1. Shows a booking popup, but only when it's actually useful:
      - Desktop: when the visitor's mouse moves toward closing the
        tab (exit-intent), OR after 25s of active reading.
      - Mobile (no mouse to read intent from): after the visitor
        scrolls past ~55% of the page, OR after 25s.
      - At most once every 24 hours per visitor (localStorage),
        never twice in the same page view.
      - Not at all for 30 days after someone actually books.
   2. Adds an always-there floating "Book a call" button once the
      visitor has scrolled past the hero, so the offer is never
      more than one tap away even if the popup was dismissed.
   3. Lets any element on the page open the same popup on demand:
        window.CareerCatalog.openBookingPopup()
      Manual opens (chips, the floating button, footer links) ALWAYS
      work, regardless of the 24h/30-day auto-show cooldown.

   HOW TO USE
   Add this one line near the end of <body> on any page:
     <script src="popup.js"></script>

   To turn OFF the automatic pop-up on a specific page (e.g. a page
   where you don't want it interrupting deep reading/exploration)
   but keep every manual "Book a call" trigger fully working:
     <script src="popup.js" data-autoshow="false"></script>

   WHERE TO CHANGE THINGS
   - WHATSAPP_NUMBER below: put your real WhatsApp Business number
   - Headline / pricing copy: edit the HTML string in the markup
     block below (search for cc-popup-headline)
   ============================================================ */

(function () {
  "use strict";

  // ---- CONFIG ---------------------------------------------------
  var WHATSAPP_NUMBER = "919145723608"; // <-- replace with your real WhatsApp Business number (country code + number, no + or spaces)
  var ENGAGEMENT_DELAY_MS = 25000;       // fallback timer trigger
  var SCROLL_TRIGGER_PCT = 0.55;         // mobile scroll-depth trigger
  var REAUTOSHOW_HOURS = 24;             // don't auto-show again within this window
  var BOOKED_COOLDOWN_DAYS = 30;         // don't auto-show for this long after a booking
  var LS_LAST_SHOWN = "cc_popup_last_shown_v2";
  var LS_BOOKED_AT = "cc_popup_booked_at_v2";

  var currentScript = document.currentScript;
  var autoShowAttr = currentScript && currentScript.getAttribute("data-autoshow");
  var AUTO_SHOW_ENABLED = autoShowAttr !== "false";

  // ---- STYLES -----------------------------------------------------
  var style = document.createElement("style");
  style.textContent = `
    .cc-popup-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(11,17,32,0.55);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
      font-family: 'Inter', sans-serif;
    }
    .cc-popup-overlay.cc-open { opacity: 1; pointer-events: auto; }

    .cc-popup-card {
      position: relative;
      width: 100%; max-width: 460px;
      max-height: 90vh; overflow-y: auto;
      background: #FAFAFA;
      border-radius: 1.5rem;
      box-shadow: 0 24px 64px rgba(11,17,32,0.35);
      transform: translateY(16px) scale(0.98);
      transition: transform 0.3s ease;
    }
    .cc-popup-overlay.cc-open .cc-popup-card { transform: translateY(0) scale(1); }

    .cc-popup-head {
      background: linear-gradient(135deg, #4338CA 0%, #06B6D4 100%);
      color: #fff;
      padding: 28px 28px 24px;
      border-radius: 1.5rem 1.5rem 0 0;
      position: relative;
      overflow: hidden;
    }
    .cc-popup-head::before {
      content: ""; position: absolute; top: -40px; right: -40px;
      width: 140px; height: 140px; border-radius: 50%;
      background: rgba(255,255,255,0.12);
    }
    .cc-popup-close {
      position: absolute; top: 14px; right: 14px;
      width: 30px; height: 30px; border-radius: 50%;
      background: rgba(255,255,255,0.18); color: #fff;
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; line-height: 1;
      transition: background 0.2s ease;
    }
    .cc-popup-close:hover { background: rgba(255,255,255,0.32); }

    .cc-popup-eyebrow {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
      color: rgba(255,255,255,0.75);
      margin: 0 0 10px; position: relative;
    }
    .cc-popup-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 21px; font-weight: 600; line-height: 1.35;
      margin: 0 0 10px; position: relative;
    }
    .cc-popup-sub {
      font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.88);
      margin: 0; position: relative;
    }

    .cc-popup-body { padding: 24px 28px 28px; }

    .cc-price-row {
      display: flex; align-items: center; justify-content: space-between;
      background: #fff; border: 1px solid rgba(71,85,105,0.15);
      border-radius: 0.9rem; padding: 14px 18px; margin-bottom: 18px;
    }
    .cc-price-label { font-size: 13px; color: #475569; }
    .cc-price-label strong { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 15px; color: #0B1120; margin-top: 2px; }
    .cc-price-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px; font-weight: 700; color: #4338CA;
      white-space: nowrap;
    }
    .cc-price-value span { font-size: 12px; font-weight: 500; color: #475569; }

    .cc-popup-form { display: flex; flex-direction: column; gap: 4px; }
    .cc-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
    .cc-popup-form input {
      width: 100%; box-sizing: border-box;
      padding: 12px 14px; border-radius: 0.65rem;
      border: 1px solid rgba(71,85,105,0.25);
      font-size: 14px; font-family: 'Inter', sans-serif;
      background: #fff; color: #0B1120;
    }
    .cc-popup-form input:focus {
      outline: none; border-color: #4338CA;
      box-shadow: 0 0 0 3px rgba(67,56,202,0.12);
    }
    .cc-popup-form input[aria-invalid="true"] {
      border-color: #DC2626;
      box-shadow: 0 0 0 3px rgba(220,38,38,0.10);
    }
    .cc-field-error {
      display: none; font-size: 12px; color: #B91C1C; margin: 0 2px;
    }
    .cc-field-error.cc-show { display: block; }

    .cc-popup-submit {
      margin-top: 6px;
      width: 100%; border: none; cursor: pointer;
      padding: 13px 18px; border-radius: 0.65rem;
      font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
      color: #fff;
      background: linear-gradient(90deg, #4338CA 0%, #06B6D4 100%);
      transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
    }
    .cc-popup-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(67,56,202,0.3); }
    .cc-popup-submit:disabled { opacity: 0.7; cursor: default; transform: none; box-shadow: none; }

    .cc-popup-note {
      font-size: 11.5px; color: #475569; text-align: center;
      margin: 12px 0 0;
    }

    .cc-popup-success {
      display: none; text-align: center; padding: 8px 4px 4px;
    }
    .cc-popup-success.cc-show { display: block; }
    .cc-popup-success h3 {
      font-family: 'Space Grotesk', sans-serif; font-size: 18px;
      color: #0B1120; margin: 10px 0 6px;
    }
    .cc-popup-success p { font-size: 13.5px; color: #475569; line-height: 1.5; margin: 0; }
    .cc-popup-form.cc-hide { display: none; }

    body.cc-lock-scroll { overflow: hidden; }

    /* Floating "Book a call" button */
    .cc-float-btn {
      position: fixed; z-index: 9998;
      right: 18px; bottom: 18px;
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 18px 13px 16px;
      border-radius: 9999px; border: none; cursor: pointer;
      color: #fff; font-family: 'Inter', sans-serif;
      font-size: 13.5px; font-weight: 600;
      background: linear-gradient(90deg, #4338CA 0%, #06B6D4 100%);
      box-shadow: 0 10px 28px rgba(67,56,202,0.35);
      opacity: 0; transform: translateY(12px) scale(0.96);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.2s ease;
    }
    .cc-float-btn.cc-visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    .cc-float-btn:hover { box-shadow: 0 14px 34px rgba(67,56,202,0.42); }
    .cc-float-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    .cc-float-btn .cc-float-price {
      background: rgba(255,255,255,0.22);
      padding: 2px 8px; border-radius: 9999px; font-size: 11.5px;
    }
    @media (max-width: 480px) {
      .cc-float-btn { right: 12px; bottom: 12px; padding: 12px 16px; font-size: 13px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .cc-popup-overlay, .cc-popup-card, .cc-popup-submit, .cc-float-btn { transition: none; }
    }
  `;
  document.head.appendChild(style);

  // ---- MARKUP: modal -----------------------------------------------
  var overlay = document.createElement("div");
  overlay.className = "cc-popup-overlay";
  overlay.innerHTML = `
    <div class="cc-popup-card" role="dialog" aria-modal="true" aria-labelledby="cc-popup-title">
      <div class="cc-popup-head">
        <button type="button" class="cc-popup-close" aria-label="Close dialog">&times;</button>
        <p class="cc-popup-eyebrow">1:1 career call</p>
        <h2 class="cc-popup-headline" id="cc-popup-title">
          Get 10 minutes of honest, specific advice on your career
        </h2>
        <p class="cc-popup-sub">
          A resume check, clear next steps for your stage, and answers to whatever's actually on your mind — no jargon, no sales pitch.
        </p>
      </div>

      <div class="cc-popup-body">
        <div class="cc-price-row">
          <div class="cc-price-label">
            1:1 career call
            <strong>10 minutes, on WhatsApp or call</strong>
          </div>
          <div class="cc-price-value">₹99<span> only</span></div>
        </div>

        <form class="cc-popup-form" id="cc-popup-form" novalidate>
          <div class="cc-field">
            <label for="cc-name" class="sr-only">Your name</label>
            <input type="text" id="cc-name" name="name" placeholder="Your name" autocomplete="name" required aria-describedby="cc-name-error" />
            <p class="cc-field-error" id="cc-name-error">Please enter your name.</p>
          </div>
          <div class="cc-field">
            <label for="cc-phone" class="sr-only">WhatsApp number</label>
            <input type="tel" id="cc-phone" name="phone" placeholder="WhatsApp number (10 digits)" autocomplete="tel" inputmode="numeric" maxlength="10" required aria-describedby="cc-phone-error" />
            <p class="cc-field-error" id="cc-phone-error">Enter a valid 10-digit Indian mobile number.</p>
          </div>
          <button type="submit" class="cc-popup-submit">Book my call</button>
        </form>

        <div class="cc-popup-success" id="cc-popup-success" role="status" aria-live="polite">
          <h3>You're set 🎉</h3>
          <p>We've opened WhatsApp with your details filled in — just hit send, and we'll confirm your call slot shortly.</p>
        </div>

        <p class="cc-popup-note">No spam. Your number is only used to confirm your call.</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  var srOnlyStyle = document.createElement("style");
  srOnlyStyle.textContent = `.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}`;
  document.head.appendChild(srOnlyStyle);

  var card = overlay.querySelector(".cc-popup-card");
  var form = overlay.querySelector("#cc-popup-form");
  var success = overlay.querySelector("#cc-popup-success");
  var nameInput = overlay.querySelector("#cc-name");
  var phoneInput = overlay.querySelector("#cc-phone");
  var nameError = overlay.querySelector("#cc-name-error");
  var phoneError = overlay.querySelector("#cc-phone-error");
  var closeBtn = overlay.querySelector(".cc-popup-close");
  var submitBtn = overlay.querySelector(".cc-popup-submit");
  var lastFocusedEl = null;

  function resetForm() {
    form.classList.remove("cc-hide");
    success.classList.remove("cc-show");
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = "Book my call";
    [nameInput, phoneInput].forEach(function (el) { el.setAttribute("aria-invalid", "false"); });
    [nameError, phoneError].forEach(function (el) { el.classList.remove("cc-show"); });
  }

  // ---- Focus trap ----------------------------------------------
  function getFocusable() {
    return Array.prototype.slice.call(
      card.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }
  function trapFocus(e) {
    if (e.key !== "Tab") return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // ---- Open / close --------------------------------------------
  function openPopup(triggerEl) {
    lastFocusedEl = triggerEl || document.activeElement;
    resetForm();
    overlay.classList.add("cc-open");
    document.body.classList.add("cc-lock-scroll");
    try { localStorage.setItem(LS_LAST_SHOWN, String(Date.now())); } catch (e) {}
    setTimeout(function () { nameInput.focus(); }, 50);
    document.addEventListener("keydown", trapFocus);
  }
  function closePopup() {
    overlay.classList.remove("cc-open");
    document.body.classList.remove("cc-lock-scroll");
    document.removeEventListener("keydown", trapFocus);
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
  }

  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closePopup(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("cc-open")) closePopup();
  });

  // ---- Validation -------------------------------------------------
  function validateName() {
    var val = nameInput.value.trim();
    var ok = val.length >= 2;
    nameInput.setAttribute("aria-invalid", ok ? "false" : "true");
    nameError.classList.toggle("cc-show", !ok);
    return ok;
  }
  function validatePhone() {
    var val = phoneInput.value.trim();
    var ok = /^[6-9]\d{9}$/.test(val);
    phoneInput.setAttribute("aria-invalid", ok ? "false" : "true");
    phoneError.classList.toggle("cc-show", !ok);
    return ok;
  }
  phoneInput.addEventListener("input", function () {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    if (phoneInput.getAttribute("aria-invalid") === "true") validatePhone();
  });
  nameInput.addEventListener("input", function () {
    if (nameInput.getAttribute("aria-invalid") === "true") validateName();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameOk = validateName();
    var phoneOk = validatePhone();
    if (!nameOk || !phoneOk) {
      (nameOk ? phoneInput : nameInput).focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Opening WhatsApp…";

    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var pageContext = document.title || window.location.pathname;
    var message = encodeURIComponent(
      "Hi, I'm " + name + ". I'd like to book the 10-minute career call (\u20b999). My number: " + phone +
      ". I came from: " + pageContext
    );

    try { localStorage.setItem(LS_BOOKED_AT, String(Date.now())); } catch (err) {}
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event: "cc_booking_submitted", cc_source: pageContext });
    }

    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + message, "_blank");

    form.classList.add("cc-hide");
    success.classList.add("cc-show");
    submitBtn.disabled = false;
    submitBtn.textContent = "Book my call";
  });

  // ---- Floating "Book a call" button --------------------------------
  var floatBtn = document.createElement("button");
  floatBtn.type = "button";
  floatBtn.className = "cc-float-btn";
  floatBtn.setAttribute("aria-label", "Book a 10-minute career call for ₹99");
  floatBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0122 16.92z"/>
    </svg>
    Book a call <span class="cc-float-price">₹99</span>
  `;
  floatBtn.addEventListener("click", function () { openPopup(floatBtn); });
  document.body.appendChild(floatBtn);

  var floatBtnShown = false;
  function updateFloatBtnVisibility() {
    var pastHero = window.scrollY > window.innerHeight * 0.6;
    if (pastHero && !floatBtnShown) {
      floatBtn.classList.add("cc-visible");
      floatBtnShown = true;
    } else if (!pastHero && floatBtnShown) {
      floatBtn.classList.remove("cc-visible");
      floatBtnShown = false;
    }
  }
  window.addEventListener("scroll", updateFloatBtnVisibility, { passive: true });
  updateFloatBtnVisibility();

  // ---- Auto-show logic ----------------------------------------------
  function withinCooldown(key, hours) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return false;
      var elapsedMs = Date.now() - parseInt(raw, 10);
      return elapsedMs < hours * 60 * 60 * 1000;
    } catch (e) { return false; }
  }

  function canAutoShow() {
    if (!AUTO_SHOW_ENABLED) return false;
    if (overlay.classList.contains("cc-open")) return false;
    if (withinCooldown(LS_BOOKED_AT, BOOKED_COOLDOWN_DAYS * 24)) return false;
    if (withinCooldown(LS_LAST_SHOWN, REAUTOSHOW_HOURS)) return false;
    return true;
  }

  var autoShowFired = false;
  function maybeAutoShow(source) {
    if (autoShowFired || !canAutoShow()) return;
    autoShowFired = true;
    openPopup(null);
  }

  if (AUTO_SHOW_ENABLED) {
    // Exit-intent (desktop): mouse leaves through the top of the viewport.
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY <= 0) maybeAutoShow("exit-intent");
    });

    // Scroll-depth trigger (mobile + desktop fallback).
    window.addEventListener("scroll", function () {
      var scrolled = window.scrollY + window.innerHeight;
      var docHeight = document.documentElement.scrollHeight;
      if (docHeight > 0 && scrolled / docHeight >= SCROLL_TRIGGER_PCT) {
        maybeAutoShow("scroll-depth");
      }
    }, { passive: true });

    // Time-on-page fallback, so an engaged reader who doesn't scroll
    // far or trigger exit-intent still sees the offer once.
    setTimeout(function () { maybeAutoShow("dwell-time"); }, ENGAGEMENT_DELAY_MS);
  }

  // ---- PUBLIC API ---------------------------------------------------
  // Lets any element (a "Book a call" chip, nav link, footer link, etc.)
  // open the same popup on demand — always works, auto-show cooldowns
  // do not apply to manual opens.
  window.CareerCatalog = window.CareerCatalog || {};
  window.CareerCatalog.openBookingPopup = function (triggerEl) { openPopup(triggerEl); };
  window.CareerCatalog.closeBookingPopup = closePopup;
})();
