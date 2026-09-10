/* ============================================================
   Career Catalog — Growth Engine & Conversion Popup v3.0
   ============================================================ */

(function () {
  const WHATSAPP_NUMBER = "919145723608"; 
  const SESSION_KEY = "cc_growth_popup_engaged";

  // INJECT STYLES
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
    
    .cc-overlay {
      position: fixed; inset: 0; z-index: 99999; background: rgba(11, 17, 32, 0.7);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; padding: 20px;
      opacity: 0; visibility: hidden; pointer-events: none; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Inter', sans-serif;
    }
    .cc-overlay.cc-open { opacity: 1; visibility: visible; pointer-events: auto; }

    .cc-card {
      position: relative; width: 100%; max-width: 480px; background: #FFFFFF; border-radius: 2rem;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.4); transform: translateY(20px) scale(0.95);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: hidden;
    }
    .cc-overlay.cc-open .cc-card { transform: translateY(0) scale(1); }

    .cc-head {
      background: linear-gradient(135deg, #4338CA 0%, #06B6D4 100%);
      color: #fff; padding: 36px 32px 28px; position: relative;
    }
    .cc-close {
      position: absolute; top: 18px; right: 18px; width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.2); color: #fff; border: none; cursor: pointer; 
      display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; z-index: 10;
    }
    .cc-close:hover { background: rgba(255,255,255,0.4); transform: rotate(90deg); }

    .cc-badge {
      display: inline-block; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; 
      letter-spacing: 0.15em; text-transform: uppercase; background: rgba(255,255,255,0.2); 
      padding: 5px 12px; border-radius: 999px; margin-bottom: 14px;
    }
    .cc-title { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; line-height: 1.25; margin: 0 0 10px; }
    .cc-subtitle { font-size: 14.5px; line-height: 1.6; color: rgba(255,255,255,0.9); margin: 0; font-weight: 500; }

    .cc-body { padding: 32px; }

    .cc-value-prop {
      display: flex; gap: 12px; align-items: flex-start; background: #F8FAFC; 
      border: 1px solid #E2E8F0; border-radius: 1rem; padding: 16px; margin-bottom: 20px;
    }
    .cc-value-prop svg { flex-shrink: 0; color: #4338CA; margin-top: 2px; }
    .cc-value-prop p { font-size: 13.5px; color: #475569; margin: 0; font-weight: 500; line-height: 1.5; }
    .cc-value-prop strong { color: #0F172A; }

    .cc-form { display: flex; flex-direction: column; gap: 12px; }
    .cc-input {
      width: 100%; box-sizing: border-box; padding: 15px 18px; border-radius: 0.85rem;
      border: 1.5px solid #CBD5E1; font-size: 15px; font-family: 'Inter', sans-serif; font-weight: 500;
      color: #0F172A; background: #fff; transition: all 0.2s ease;
    }
    .cc-input:focus { outline: none; border-color: #4338CA; box-shadow: 0 0 0 4px rgba(67,56,202,0.12); }
    .cc-input.cc-error { border-color: #EF4444; background: #FEF2F2; }

    .cc-btn {
      margin-top: 6px; width: 100%; border: none; cursor: pointer; padding: 16px; border-radius: 0.85rem;
      display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Inter', sans-serif;
      font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(90deg, #4338CA 0%, #06B6D4 100%);
      box-shadow: 0 4px 15px rgba(67,56,202,0.3); transition: all 0.2s ease;
    }
    .cc-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(67,56,202,0.4); }

    .cc-privacy { font-size: 12px; color: #64748B; text-align: center; margin: 16px 0 0; font-weight: 500; }

    .cc-success { display: none; text-align: center; padding: 10px 0; }
    .cc-success.cc-show { display: block; animation: fadeIn 0.4s ease; }
    .cc-success-icon { 
      width: 64px; height: 64px; background: #10B981; color: #fff; border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; 
      box-shadow: 0 10px 25px rgba(16,185,129,0.3);
    }
    .cc-success h3 { font-family: 'Space Grotesk', sans-serif; font-size: 24px; color: #0F172A; margin: 0 0 8px; font-weight: 700; }
    .cc-success p { font-size: 14.5px; color: #475569; line-height: 1.6; margin: 0 0 20px; font-weight: 500; }
    
    .cc-hide { display: none !important; }

    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }
    .cc-shake { animation: shake 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);

  // INJECT HTML STRUCTURE
  const overlay = document.createElement("div");
  overlay.className = "cc-overlay";
  overlay.innerHTML = `
    <div class="cc-card">
      <div class="cc-head">
        <button class="cc-close" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <span class="cc-badge">1:1 Career Audit</span>
        <h2 class="cc-title">Get a Custom Roadmap Session</h2>
        <p class="cc-subtitle">Stop second-guessing your career moves. Speak directly with an expert mentor for 10 minutes.</p>
      </div>

      <div class="cc-body">
        <div class="cc-form-wrapper">
          <div class="cc-value-prop">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <p>Includes a <strong>1-on-1 resume review</strong>, skill gap analysis, and direct WhatsApp scheduling for just <strong>₹99</strong>.</p>
          </div>

          <form class="cc-form" id="cc-form" novalidate>
            <input type="text" id="cc-name" class="cc-input" placeholder="Your Full Name" required autocomplete="name" />
            <input type="tel" id="cc-phone" class="cc-input" placeholder="WhatsApp Number (10 digits)" required pattern="[0-9]{10}" maxlength="10" autocomplete="tel" />
            <button type="submit" class="cc-btn">
              Connect on WhatsApp
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>

          <p class="cc-privacy">🔒 Zero spam. Your details are strictly confidential.</p>
        </div>

        <div class="cc-success" id="cc-success">
          <div class="cc-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>You're all set! 🎉</h3>
          <p>We've opened WhatsApp securely with your details. <strong>Hit send</strong>, and our expert will assign your slot within minutes.</p>
          <button class="cc-btn" onclick="window.CareerCatalog.closeBookingPopup()" style="background: #0F172A; box-shadow: none;">Close Window</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // LOGIC & BEHAVIOR
  const formWrapper = overlay.querySelector(".cc-form-wrapper");
  const form = overlay.querySelector("#cc-form");
  const successDiv = overlay.querySelector("#cc-success");
  const nameInput = overlay.querySelector("#cc-name");
  const phoneInput = overlay.querySelector("#cc-phone");

  function openPopup() {
    formWrapper.classList.remove("cc-hide");
    successDiv.classList.remove("cc-show");
    nameInput.classList.remove("cc-error");
    phoneInput.classList.remove("cc-error");
    form.reset();
    overlay.classList.add("cc-open");
  }

  function closePopup() {
    overlay.classList.remove("cc-open");
  }

  // Remove aggressive auto-timer. Let the user browse freely and click CTAs organically.

  overlay.querySelector(".cc-close").addEventListener("click", closePopup);
  overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) closePopup(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePopup(); });

  phoneInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    this.classList.remove("cc-error");
  });
  nameInput.addEventListener('input', function() { this.classList.remove("cc-error"); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let hasError = false;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || name.length < 2) {
      nameInput.classList.add("cc-error", "cc-shake");
      setTimeout(() => nameInput.classList.remove("cc-shake"), 400);
      hasError = true;
    }
    if (!phone || phone.length !== 10) {
      phoneInput.classList.add("cc-error", "cc-shake");
      setTimeout(() => phoneInput.classList.remove("cc-shake"), 400);
      hasError = true;
    }
    if (hasError) return;

    // Secure WhatsApp redirection
    const message = encodeURIComponent(`Hi Career Catalog team, I'm ${name}. I'd like to book my 1-on-1 career audit & strategy session (₹99). My WhatsApp number is ${phone}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

    formWrapper.classList.add("cc-hide");
    successDiv.classList.add("cc-show");
  });

  window.CareerCatalog = window.CareerCatalog || {};
  window.CareerCatalog.openBookingPopup = openPopup;
  window.CareerCatalog.closeBookingPopup = closePopup;
})();
