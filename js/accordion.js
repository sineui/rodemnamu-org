/* ============================================
   RODEMNAMU.ORG — Accordion Component
   ============================================ */

(function () {
  'use strict';

  function initAccordions() {
    var triggers = document.querySelectorAll('.accordion__trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion__item');
        var content = item.querySelector('.accordion__content');
        var isOpen = item.classList.contains('open');

        // Close all items in this accordion
        var accordion = item.closest('.accordion');
        accordion.querySelectorAll('.accordion__item').forEach(function (other) {
          other.classList.remove('open');
          other.querySelector('.accordion__content').style.maxHeight = null;
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAccordions);
})();
