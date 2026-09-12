/**
 * Career Catalog India — Unified Master Controller
 */

(function () {
  'use strict';

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
    }
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
    // 1. Mobile Hamburger Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        mobileMenu.classList.toggle('is-active');
      });
    }

    // 2. Global Modal Trigger Listeners
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const topic = trigger.getAttribute('data-topic') || 'General Strategy Consultation';
        openPopup(topic);
      });
    });

    // 3. Modal Close Actions
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.addEventListener('click', closePopup);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closePopup();
      });
    }

    // 4. Secure Form Submission Handler (Clean Success State)
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
      consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('client-name');
        const phoneInput = document.getElementById('client-phone');

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

        const formWrapper = modal.querySelector('.modal-form-wrapper');
        const successView = modal.querySelector('.modal-success-view');
        if (formWrapper) formWrapper.style.display = 'none';
        if (successView) successView.style.display = 'block';
      });
    }
  });

  window.CareerCatalog.openBookingPopup = openPopup;
  window.CareerCatalog.closeBookingPopup = closePopup;
})();
