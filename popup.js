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
      const nameInput = modal.) {
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

  window.CareerCatalog.openBookingPopup = openPopup;
  window.CareerCatalog.closeBookingPopup = closePopup;
})();
