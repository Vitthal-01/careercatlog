/**
 * Career Catalog India — Core Application Runtime v4.0
 * Manages Navigation, Global Consultation Modal, Intent Passing, and Tabbed Systems.
 */

(function () {
  'use strict';

  const WHATSAPP_PHONE = '919145723608';

  window.CareerCatalog = window.CareerCatalog || {};

  function initMobileMenu() {
    const menuBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initModalSystem() {
    const modal = document.getElementById('consultation-modal');
    if (!modal) return;

    const modalCloseBtn = modal.querySelector('.modal-close');
    const formWrapper = modal.querySelector('.modal-form-wrapper');
    const successView = modal.querySelector('.modal-success-view');
    const form = modal.querySelector('#consultation-form');
    const nameInput = modal.querySelector('#client-name');
    const phoneInput = modal.querySelector('#client-phone');
    const topicSelect = modal.querySelector('#client-topic');

    function openModal(defaultTopic = '') {
      if (form) form.reset();
      if (formWrapper) formWrapper.style.display = 'block';
      if (successView) successView.style.display = 'none';
      if (nameInput) nameInput.classList.remove('error');
      if (phoneInput) phoneInput.classList.remove('error');

      if (topicSelect && defaultTopic) {
        topicSelect.value = defaultTopic;
      }

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      if (nameInput) nameInput.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-modal-trigger]');
      if (trigger) {
        e.preventDefault();
        const requestedTopic = trigger.getAttribute('data-topic') || '';
        openModal(requestedTopic);
      }
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
        this.classList.remove('error');
      });
    }

    if (nameInput) {
      nameInput.addEventListener('input', function () {
        this.classList.remove('error');
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        let hasError = false;

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const topic = topicSelect ? topicSelect.value : 'General Career Guidance';

        if (!name || name.length < 2) {
          if (nameInput) nameInput.classList.add('error');
          hasError = true;
        }

        if (!phone || phone.length !== 10) {
          if (phoneInput) phoneInput.classList.add('error');
          hasError = true;
        }

        if (hasError) return;

        const message = encodeURIComponent(
          `Hello Career Catalog Team,\n\n` +
          `I would like to book a 1-on-1 strategy consultation session (₹99).\n\n` +
          `• Full Name: ${name}\n` +
          `• WhatsApp: ${phone}\n` +
          `• Focus Area: ${topic}\n\n` +
          `Please confirm the available session slots.`
        );

        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');

        if (formWrapper) formWrapper.style.display = 'none';
        if (successView) successView.style.display = 'block';
      });
    }

    window.CareerCatalog.openBookingPopup = openModal;
    window.CareerCatalog.closeBookingPopup = closeModal;
  }

  function initTabSystem() {
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    const tabPanels = document.querySelectorAll('[data-tab-panel]');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-tab-target');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const targetPanel = document.querySelector(`[data-tab-panel="${targetId}"]`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initModalSystem();
    initTabSystem();
  });
})();
