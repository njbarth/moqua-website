/* ============================================================
   MOQUA FOUNDATION — MAIN.JS
   Navigation, filter interactions, carousel, and utilities
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

  // ---- Hero Carousel ----
  var carouselEl = document.getElementById('carousel-slides');
  if (carouselEl) {
    var dots    = Array.from(document.querySelectorAll('.carousel-dot'));
    var caption = document.getElementById('carousel-caption');
    var captions = [];
    // Read captions from data-caption on each slide
    Array.from(carouselEl.querySelectorAll('.carousel-slide')).forEach(function (sl) {
      captions.push(sl.dataset.caption || '');
    });
    var totalSlides = captions.length;
    var currentSlide = 0;
    var carouselTimer = null;

    function goTo(i) {
      currentSlide = (i + totalSlides) % totalSlides;
      carouselEl.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      dots.forEach(function (d, j) {
        d.classList.toggle('active', j === currentSlide);
      });
      if (caption) caption.textContent = captions[currentSlide] || '';
    }

    function next() { goTo(currentSlide + 1); }
    function prev() { goTo(currentSlide - 1); }

    function startAuto() {
      stopAuto();
      carouselTimer = setInterval(next, 5000);
    }
    function stopAuto() {
      if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
    }

    // Expose for inline onclick
    window.carouselNext = function () { next(); startAuto(); };
    window.carouselPrev = function () { prev(); startAuto(); };
    window.carouselGo   = function (i) { goTo(i); startAuto(); };

    // Pause on hover
    carouselEl.addEventListener('mouseenter', stopAuto);
    carouselEl.addEventListener('mouseleave', startAuto);

    goTo(0);
    startAuto();
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
