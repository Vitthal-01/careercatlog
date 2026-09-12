/**
 * Career Catalog India — Root Modal & WhatsApp Dispatch Script (`popup.js`)
 */

(function () {
  'use strict';

  const WHATSAPP_PHONE = "919145723608";

  window.CareerCatalog = window.CareerCatalog || {};

  function openPopup(topic = 'General Strategy Consultation') {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      const topicSelect = modal.querySelector('#client-topic');
      const nameInput = modal.querySelector('#client-name');
      const phoneInput = modal.querySelector('#client-phone');
      const formWrapper = modal.querySelector('.modal-form-wrapper');
      const successView = modal.querySelector('.modal-success-view');

      if (topicSelect && topic) topicSelect.value = topic;
      if (formWrapper) formWrapper.style.display = 'block';
      if (successView) successView.style.display = 'none';
      if (nameInput) nameInput.classList.remove('error');
      if (phoneInput) phoneInput.classList.remove('error');

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      if (nameInput) nameInput.focus();
      document.body.style.overflow = 'hidden';
      return;
    }

    const message = encodeURIComponent(`Hi Career Catalog team, I'd like to book a 1-on-1 strategy session (₹99) regarding: ${topic}.`);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
  }

  function closePopup() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle handler
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        mobileMenu.classList.toggle('is-active');
      });
    }

    // Modal triggers
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const topic = trigger.getAttribute('data-topic') || 'General Strategy Consultation';
        openPopup(topic);
      });
    });

    // Close buttons and overlay click
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.addEventListener('click', closePopup);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closePopup();
      });
    }

    // Form submission
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
      consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('client-name');
        const phoneInput = document.getElementById('client-phone');
        const topicSelect = document.getElementById('client-topic');

        let isValid = true;
        if (!nameInput.value.trim()) {
          nameInput.classList.add('error');
          isValid = false;
        } else {
          nameInput.classList.remove('error');
        }

        const phoneVal = phoneInput.value.trim();
        if (!/^\d{10}$/.test(phoneVal)) {
          phoneInput.classList.add('error');
          isValid = false;
        } else {
          phoneInput.classList.remove('error');
        }

        if (!isValid) return;

        const name = encodeURIComponent(nameInput.value.trim());
        const phone = encodeURIComponent(phoneVal);
        const topic = encodeURIComponent(topicSelect.value);

        const formWrapper = modal.querySelector('.modal-form-wrapper');
        const successView = modal.querySelector('.modal-success-view');
        if (formWrapper) formWrapper.style.display = 'none';
        if (successView) successView.style.display = 'block';

        const waMessage = encodeURIComponent(`Hi Career Catalog team, my name is ${decodeURIComponent(name)} (Phone: ${decodeURIComponent(phone)}). I'd like to book my 1-on-1 strategy session (₹99) for: ${decodeURIComponent(topic)}.`);
        
        setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${waMessage}`, '_blank');
        }, 800);
      });
    }
  });

  window.CareerCatalog.openBookingPopup = openPopup;
  window.CareerCatalog.closeBookingPopup = closePopup;
})();
