/* ============================================================
   MOQUA FOUNDATION — MAIN.JS
   Navigation, filter interactions, and utilities
   ============================================================ */

(function () {
  'use strict';

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- Bio / Centurion grid filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bioCards   = document.querySelectorAll('.bio-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      bioCards.forEach(function (card) {
        if (!filter || filter === 'all') {
          card.style.display = '';
          return;
        }
        if (filter === 'vigil') {
          card.style.display = card.dataset.vigil === 'true' ? '' : 'none';
        } else if (filter === 'recent') {
          const yr = parseInt(card.dataset.year, 10);
          card.style.display = yr >= 2015 ? '' : 'none';
        } else if (filter === 'early') {
          const yr = parseInt(card.dataset.year, 10);
          card.style.display = yr < 2015 ? '' : 'none';
        } else {
          card.style.display = '';
        }
      });
    });
  });

  // ---- Image error fallback ----
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.background = '#E9E9E4';
      img.removeAttribute('src');
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
