/**
 * Career Catalog India — Growth Engine & Strategy Consultation Popup v4.0
 * Fully integrated with the v4.0 Design System, Accessible Modal, and WhatsApp Dispatch.
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
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Modal Trigger Delegations
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-trigger]');
      if (trigger) {
        e.preventDefault();
        const topic = trigger.getAttribute('data-topic') || 'General Strategy Consultation';
        openPopup(topic);
        if (mobileMenu) mobileMenu.classList.remove('is-open');
      }

      const closeTrigger = e.target.closest('.modal-close, .modal-overlay');
      if (closeTrigger && e.target === closeTrigger) {
        closePopup();
      }
    });

    // Escape Key Handler for Modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    });

    // Consultation Form Validation & WhatsApp Dispatch
    const form = document.getElementById('consultation-form');
    if (form) {
      form.addEventListener('submit', (e) => {
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
        const topic = encodeURIComponent(topicSelect ? topicSelect.value : 'General Strategy Consultation');

        const text = encodeURIComponent(`Hi Career Catalog team,\n\nI want to book my 1-on-1 Strategy Session (₹99).\n\n• Name: ${decodeURIComponent(name)}\n• WhatsApp: ${decodeURIComponent(phone)}\n• Focus: ${decodeURIComponent(topic)}`);

        // Show success view inside modal
        const formWrapper = document.querySelector('.modal-form-wrapper');
        const successView = document.querySelector('.modal-success-view');
        if (formWrapper) formWrapper.style.display = 'none';
        if (successView) successView.style.display = 'block';

        // Open WhatsApp in new tab
        setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank');
        }, 300);
      });
    }
  });

  window.CareerCatalog.openBookingPopup = openPopup;
  window.CareerCatalog.closeBookingPopup = closePopup;
})();
