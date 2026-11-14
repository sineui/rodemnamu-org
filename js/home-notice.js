(function () {
  'use strict';

  var notice = document.getElementById('home-notice');
  if (!notice || typeof notice.showModal !== 'function') return;

  var now = Date.now();
  // This event notice expires after November 15 in Korea.
  if (now >= Date.parse('2026-11-16T00:00:00+09:00')) return;
  var today = new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  var storageKey = 'rodemnamu-thanksgiving-2026-hidden-date';
  try {
    if (localStorage.getItem(storageKey) === today) return;
  } catch (e) { /* The notice also works when storage is unavailable. */ }

  var previousFocus = document.activeElement;
  notice.querySelector('[data-notice-close]').addEventListener('click', function () {
    notice.close();
  });
  notice.querySelector('[data-notice-today]').addEventListener('click', function () {
    try { localStorage.setItem(storageKey, today); } catch (e) { /* Storage is optional. */ }
    notice.close();
  });
  notice.addEventListener('click', function (event) {
    var bounds = notice.getBoundingClientRect();
    if (event.target === notice && (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom)) notice.close();
  });
  notice.addEventListener('close', function () {
    document.documentElement.classList.remove('has-home-notice');
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  });
  notice.showModal();
  document.documentElement.classList.add('has-home-notice');
})();
