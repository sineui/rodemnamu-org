/* ============================================
   RODEMNAMU.ORG — Component Loader & Navigation
   ============================================ */

(function () {
  'use strict';

  // Detect language from URL path
  var isEnglish = window.location.pathname.startsWith('/en/');
  var langPrefix = isEnglish ? '/en/' : '/';
  var partialSuffix = isEnglish ? '-en' : '';

  // Load header and footer partials
  // Note: innerHTML is used intentionally here to inject our own trusted
  // static HTML partials served from the same origin. No user input involved.
  async function loadPartials() {
    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');

    if (headerEl) {
      try {
        var res = await fetch('/partials/header' + partialSuffix + '.html');
        if (res.ok) {
          headerEl.innerHTML = await res.text(); // trusted same-origin partial
          initMobileNav();
          highlightActiveNav();
          initLangToggle();
        }
      } catch (e) {
        console.error('Failed to load header:', e);
      }
    }

    if (footerEl) {
      try {
        var res2 = await fetch('/partials/footer' + partialSuffix + '.html');
        if (res2.ok) {
          footerEl.innerHTML = await res2.text(); // trusted same-origin partial
        }
      } catch (e) {
        console.error('Failed to load footer:', e);
      }
    }
  }

  // Mobile hamburger menu
  function initMobileNav() {
    var hamburger = document.querySelector('.hamburger');
    var nav = document.querySelector('.nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Highlight current page in nav
  function highlightActiveNav() {
    var path = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      if (path === href || (href !== langPrefix && path.startsWith(href))) {
        link.classList.add('active');
      }
    });
  }

  // In-page tabs: highlight active section on scroll
  function initPageTabs() {
    var tabs = document.querySelectorAll('.page-tabs__link');
    if (tabs.length === 0) return;

    var sections = [];
    tabs.forEach(function (tab) {
      var href = tab.getAttribute('href');
      if (href && href.startsWith('#')) {
        var section = document.querySelector(href);
        if (section) {
          sections.push({ tab: tab, section: section });
        }
      }
    });

    if (sections.length === 0) return;

    function updateActiveTab() {
      var scrollPos = window.scrollY + 200;

      var activeIndex = 0;
      sections.forEach(function (item, i) {
        if (item.section.offsetTop <= scrollPos) {
          activeIndex = i;
        }
      });

      tabs.forEach(function (t) { t.classList.remove('active'); });
      sections[activeIndex].tab.classList.add('active');
    }

    window.addEventListener('scroll', updateActiveTab, { passive: true });
    updateActiveTab();
  }

  // Language toggle: keep current page when switching language
  function initLangToggle() {
    var path = window.location.pathname;
    var hash = window.location.hash;
    var links = document.querySelectorAll('.lang-toggle a[data-lang]');

    links.forEach(function (link) {
      var lang = link.getAttribute('data-lang');
      var targetPath;

      if (lang === 'en') {
        // KO → EN: prepend /en/ to current path
        targetPath = path.startsWith('/en/') ? path : '/en' + path;
      } else {
        // EN → KO: strip /en/ prefix
        targetPath = path.startsWith('/en/') ? path.replace(/^\/en/, '') : path;
      }

      link.setAttribute('href', targetPath + hash);
    });
  }

  // Dynamic church age (founded 2003)
  function initChurchAge() {
    var age = new Date().getFullYear() - 2003;
    document.querySelectorAll('.church-age').forEach(function (el) {
      el.textContent = age;
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    loadPartials().then(function () {
      initPageTabs();
    });
    initChurchAge();
  });
})();
