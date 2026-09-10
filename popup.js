/* ============================================================
   Career Catalog — Premium "Book a Call" Conversion Engine
   ============================================================
   Zero-dependency, high-converting popup script. 
   Injects its own styles and handles WhatsApp redirection flawlessly.
============================================================ */

(function () {
  // ---- CONFIGURATION -----------------------------------------
  // Replace with your actual WhatsApp Business number (Country Code + Number, no spaces or '+')
  const WHATSAPP_NUMBER = "919145723608"; 
  const SHOW_DELAY_MS = 3500; // Auto-shows after 3.5 seconds
  const SESSION_KEY = "cc_premium_popup_v2";

  // ---- INJECT PREMIUM STYLES ---------------------------------
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
    
    .cc-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(11, 17, 32, 0.65);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; visibility: hidden; pointer-events: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Inter', sans-serif;
    }
    .cc-overlay.cc-open { 
      opacity: 1; visibility: visible; pointer-events: auto; 
    }

    .cc-card {
      position: relative; width: 100%; max-width: 440px;
      background: #FFFFFF; border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      transform: translateY(20px) scale(0.95);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
    }
    .cc-overlay.cc-open .cc-card { 
      transform: translateY(0) scale(1); 
    }

    .cc-head {
      background: linear-gradient(135deg, #4338CA 0%, #06B6D4 100%);
      color: #fff; padding: 32px 32px 24px;
      position: relative; overflow: hidden;
    }
    .cc-head::after {
      content: ""; position: absolute; top: -50px; right: -50px;
      width: 150px; height: 150px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    }
    
    .cc-close {
      position: absolute; top: 16px; right: 16px;
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.15); color: #fff;
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease; z-index: 10;
    }
    .cc-close:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }
    .cc-close svg { width: 18px; height: 18px; }

    .cc-badge {
      display: inline-block; font-family: 'Space Grotesk', sans-serif;
      font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
      background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 999px;
      margin-bottom: 12px; position: relative; z-index: 2;
    }
    
    .cc-title {
      font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; 
      line-height: 1.25; margin: 0 0 10px; position: relative; z-index: 2;
    }
    .cc-subtitle {
      font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.9);
      margin: 0; position: relative; z-index: 2; font-weight: 500;
    }

    .cc-body { padding: 28px 32px 32px; }

    .cc-price-box {
      display: flex; align-items: center; justify-content: space-between;
      background: #FAFAFA; border: 1px solid #E2E8F0;
      border-radius: 1rem; padding: 16px 20px; margin-bottom: 24px;
    }
    .cc-price-text { font-size: 13px; color: #64748B; font-weight: 500; }
    .cc-price-text strong { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 16px; color: #0F172A; margin-top: 2px; }
    .cc-price-amount { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; color: #4338CA; }
    .cc-price-amount span { font-size: 12px; font-weight: 600; color: #64748B; }

    .cc-form { display: flex; flex-direction: column; gap: 14px; }
    
    .cc-input-group { position: relative; }
    .cc-input {
      width: 100%; box-sizing: border-box; padding: 14px 16px;
      border-radius: 0.75rem; border: 1.5px solid #E2E8F0;
      font-size: 15px; font-family: 'Inter', sans-serif; font-weight: 500;
      color: #0F172A; background: #fff; transition: all 0.2s ease;
    }
    .cc-input::placeholder { color: #94A3B8; }
    .cc-input:focus { outline: none; border-color: #4338CA; box-shadow: 0 0 0 4px rgba(67,56,202,0.1); }
    .cc-input.cc-error { border-color: #EF4444; background: #FEF2F2; }

    .cc-btn {
      margin-top: 6px; width: 100%; border: none; cursor: pointer;
      padding: 16px; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 8px;
      font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700; color: #fff;
      background: linear-gradient(90deg, #4338CA 0%, #06B6D4 100%);
      box-shadow: 0 4px 14px rgba(67,56,202,0.25);
      transition: all 0.2s ease;
    }
    .cc-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(67,56,202,0.35); }
    .cc-btn svg { transition: transform 0.2s ease; }
    .cc-btn:hover svg { transform: translateX(4px); }

    .cc-guarantee {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      margin-top: 16px; font-size: 12px; font-weight: 600; color: #64748B; text-align: center;
    }

    .cc-success { display: none; text-align: center; padding: 10px 0; animation: fadeIn 0.4s ease; }
    .cc-success.cc-show { display: block; }
    .cc-success-icon { 
      width: 60px; height: 60px; background: #10B981; color: #fff; 
      border-radius: 50%; display: flex; align-items: center; justify-content: center; 
      margin: 0 auto 16px; box-shadow: 0 10px 25px rgba(16,185,129,0.3);
    }
    .cc-success h3 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; color: #0F172A; margin: 0 0 8px; font-weight: 700; }
    .cc-success p { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 20px; font-weight: 500; }
    
    .cc-hide { display: none !important; }

    /* Shake Animation for Invalid Input */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
    }
    .cc-shake { animation: shake 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);

  // ---- INJECT HTML STRUCTURE ---------------------------------
  const overlay = document.createElement("div");
  overlay.className = "cc-overlay";
  overlay.innerHTML = `
    <div class="cc-card" role="dialog" aria-modal="true" aria-labelledby="cc-title">
      <div class="cc-head">
        <button class="cc-close" aria-label="Close popup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <span class="cc-badge">Fast-Track Your Career</span>
        <h2 class="cc-title" id="cc-title">Stop guessing. Get a proven roadmap.</h2>
        <p class="cc-subtitle">In just 10 minutes, we'll audit your resume and map out exactly what you need to do next to get hired.</p>
      </div>

      <div class="cc-body">
        <div class="cc-form-wrapper">
          <div class="cc-price-box">
            <div class="cc-price-text">1:1 Strategy Call <strong>10 Minutes</strong></div>
            <div class="cc-price-amount">₹99<span> only</span></div>
          </div>

          <form class="cc-form" id="cc-form" novalidate>
            <div class="cc-input-group">
              <input type="text" id="cc-name" class="cc-input" placeholder="Your Full Name" required autocomplete="name" />
            </div>
            <div class="cc-input-group">
              <input type="tel" id="cc-phone" class="cc-input" placeholder="WhatsApp Number (10 digits)" required pattern="[0-9]{10}" maxlength="10" autocomplete="tel" />
            </div>
            <button type="submit" class="cc-btn">
              Proceed to WhatsApp 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>

          <div class="cc-guarantee">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            100% Value Guarantee. Zero spam.
          </div>
        </div>

        <div class="cc-success" id="cc-success">
          <div class="cc-success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>You're all set! 🎉</h3>
          <p>We've opened WhatsApp securely. <strong>Just hit send</strong> with the pre-filled message, and we'll confirm your slot immediately.</p>
          <button class="cc-btn" onclick="window.CareerCatalog.closeBookingPopup()" style="background: #0F172A; box-shadow: none;">Close window</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ---- LOGIC & BEHAVIOR --------------------------------------
  const formWrapper = overlay.querySelector(".cc-form-wrapper");
  const form = overlay.querySelector("#cc-form");
  const successDiv = overlay.querySelector("#cc-success");
  const nameInput = overlay.querySelector("#cc-name");
  const phoneInput = overlay.querySelector("#cc-phone");

  function resetPopup() {
    formWrapper.classList.remove("cc-hide");
    successDiv.classList.remove("cc-show");
    nameInput.classList.remove("cc-error");
    phoneInput.classList.remove("cc-error");
    form.reset();
  }

  function openPopup() {
    resetPopup();
    overlay.classList.add("cc-open");
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  function closePopup() {
    overlay.classList.remove("cc-open");
  }

  // Auto-trigger for first-time session visitors
  if (!sessionStorage.getItem(SESSION_KEY)) {
    setTimeout(openPopup, SHOW_DELAY_MS);
  }

  // Event Listeners for closing
  overlay.querySelector(".cc-close").addEventListener("click", closePopup);
  overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) closePopup(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("cc-open")) closePopup(); });

  // Input sanitization (only allow numbers in phone field)
  phoneInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    this.classList.remove("cc-error");
  });
  nameInput.addEventListener('input', function () {
    this.classList.remove("cc-error");
  });

  // Form Submission & Validation
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let hasError = false;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validate Name
    if (!name || name.length < 2) {
      nameInput.classList.add("cc-error", "cc-shake");
      setTimeout(() => nameInput.classList.remove("cc-shake"), 400);
      hasError = true;
    }

    // Validate Phone (Exactly 10 digits)
    if (!phone || phone.length !== 10) {
      phoneInput.classList.add("cc-error", "cc-shake");
      setTimeout(() => phoneInput.classList.remove("cc-shake"), 400);
      hasError = true;
    }

    if (hasError) return;

    // Proceed to WhatsApp
    const message = encodeURIComponent(`Hi team, I'm ${name}. I'd like to book the 10-minute strategy call (₹99) to discuss my career roadmap. My number is ${phone}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

    // Transition to Success State
    formWrapper.classList.add("cc-hide");
    successDiv.classList.add("cc-show");
  });

  // ---- PUBLIC API (Globally accessible) ----------------------
  window.CareerCatalog = window.CareerCatalog || {};
  window.CareerCatalog.openBookingPopup = openPopup;
  window.CareerCatalog.closeBookingPopup = closePopup;

})();
