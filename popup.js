/* ============================================================
   CareerCatalog — Floating "Book a Call" popup
   Appears 3 seconds after the page loads, once per browser session,
   AND can be triggered manually at any time (e.g. from a "Book a
   call" hover chip on the career guidance page) via:

     window.CareerCatalog.openBookingPopup()

   Self-contained: injects its own CSS + HTML, no dependencies.

   HOW TO USE:
   Add this one line right before the closing </body> tag
   on any page where you want the popup available:

     <script src="popup.js"></script>

   WHERE TO CHANGE THINGS:
   - WHATSAPP_NUMBER below: put your real WhatsApp business number
   - Headline / pricing copy: edit the HTML string in POPUP_HTML
   ============================================================ */

(function () {
  // ---- CONFIG -------------------------------------------------
  var WHATSAPP_NUMBER = "919145723608"; // <-- replace with your number, country code + number, no + or spaces
  var SHOW_DELAY_MS = 3000;
  var SESSION_KEY = "cc_popup_shown_v1";

  // ---- STYLES ---------------------------------------------------
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
      font-size: 11px; font-weight: 600; letter-spacing: 0.15em;
      text-transform: uppercase; color: rgba(255,255,255,0.75);
      margin: 0 0 10px; position: relative;
    }
    .cc-popup-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px; font-weight: 600; line-height: 1.3;
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

    .cc-popup-form { display: flex; flex-direction: column; gap: 10px; }
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
    .cc-popup-submit {
      margin-top: 4px;
      width: 100%; border: none; cursor: pointer;
      padding: 13px 18px; border-radius: 0.65rem;
      font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
      color: #fff;
      background: linear-gradient(90deg, #4338CA 0%, #06B6D4 100%);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .cc-popup-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(67,56,202,0.3); }

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
  `;
  document.head.appendChild(style);

  // ---- MARKUP -----------------------------------------------------
  var overlay = document.createElement("div");
  overlay.className = "cc-popup-overlay";
  overlay.innerHTML = `
    <div class="cc-popup-card" role="dialog" aria-modal="true" aria-labelledby="cc-popup-title">
      <div class="cc-popup-head">
        <button class="cc-popup-close" aria-label="Close">&times;</button>
        <p class="cc-popup-eyebrow">Real results</p>
        <h2 class="cc-popup-headline" id="cc-popup-title">
          Students using our guidance have gone on to get multiple interview calls within days
        </h2>
        <p class="cc-popup-sub">
          A focused 10-minute call can help you get there too — a resume check, honest next steps, no fluff.
        </p>
      </div>

      <div class="cc-popup-body">
        <div class="cc-price-row">
          <div class="cc-price-label">
            1:1 career call
            <strong>10 minutes</strong>
          </div>
          <div class="cc-price-value">₹99<span> only</span></div>
        </div>

        <form class="cc-popup-form" id="cc-popup-form">
          <input type="text" id="cc-name" placeholder="Your name" required />
          <input type="tel" id="cc-phone" placeholder="WhatsApp number" required pattern="[0-9]{10}" maxlength="10" />
          <button type="submit" class="cc-popup-submit">Book my call</button>
        </form>

        <div class="cc-popup-success" id="cc-popup-success">
          <h3>You're set 🎉</h3>
          <p>We've opened WhatsApp with your details filled in — just hit send, and we'll confirm your call slot shortly.</p>
        </div>

        <p class="cc-popup-note">No spam. Your number is only used to confirm your call.</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Reset to the form view every time the popup opens, so a stale
  // "success" state from a previous open isn't shown again.
  var form = overlay.querySelector("#cc-popup-form");
  var success = overlay.querySelector("#cc-popup-success");
  function resetForm() {
    form.classList.remove("cc-hide");
    success.classList.remove("cc-show");
    form.reset();
  }

  // ---- BEHAVIOUR --------------------------------------------------
  function openPopup() {
    resetForm();
    overlay.classList.add("cc-open");
    sessionStorage.setItem(SESSION_KEY, "1");
  }
  function closePopup() {
    overlay.classList.remove("cc-open");
  }

  // Auto-show once per browser session, after a short delay.
  // (Manual opens via CareerCatalog.openBookingPopup() are unaffected
  // by this check — they should always work, e.g. from a "Book a
  // call" hover prompt on the career guidance page.)
  if (!sessionStorage.getItem(SESSION_KEY)) {
    setTimeout(openPopup, SHOW_DELAY_MS);
  }

  overlay.querySelector(".cc-popup-close").addEventListener("click", closePopup);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePopup();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = overlay.querySelector("#cc-name").value.trim();
    var phone = overlay.querySelector("#cc-phone").value.trim();
    if (!name || !phone) return;

    var message = encodeURIComponent(
      "Hi, I'm " + name + ". I'd like to book the 10-minute career call (₹99). My number: " + phone
    );
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + message, "_blank");

    form.classList.add("cc-hide");
    success.classList.add("cc-show");
  });

  // ---- PUBLIC API ---------------------------------------------------
  // Lets any page/element (e.g. a "Book a call" chip on a career-guidance
  // subsection) open the same popup on demand.
  window.CareerCatalog = window.CareerCatalog || {};
  window.CareerCatalog.openBookingPopup = openPopup;
  window.CareerCatalog.closeBookingPopup = closePopup;
})();
