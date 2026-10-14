/* =====================================================================
   WWE Travel CY · Early booking 2027
   Countdown to the deadline (Cyprus time) with flip digits; entrance
   when the section scrolls into view; 3D tilt with light reflection on
   the cards (desktop); a swipe deck with focus and dots (mobile).
   After the deadline the countdown and discounts are removed.
   No dependencies.
   ===================================================================== */
(function () {
  'use strict';

  /* Early booking ends at this moment, Cyprus time (EET, UTC+2 in November). */
  var DEADLINE = Date.parse('2026-11-30T23:59:59+02:00');
  var TILT = 7;                                           // max card tilt, degrees

  var root = document.documentElement;
  var eb = document.getElementById('eb');
  var deck = document.getElementById('deck');
  var dotsBox = document.getElementById('dots');
  var offers = Array.prototype.slice.call(deck.querySelectorAll('.offer'));
  var reduced = root.classList.contains('reduced-motion');
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------
     Photo height: the photo ends a little below the top of the cards
     ------------------------------------------------------------------ */
  function sizePhoto() {
    var top = deck.getBoundingClientRect().top - eb.getBoundingClientRect().top;
    eb.style.setProperty('--photo-h', Math.round(top + Math.min(180, deck.offsetHeight * 0.45)) + 'px');
  }

  /* ------------------------------------------------------------------
     Countdown
     ------------------------------------------------------------------ */
  var nums = {};
  Array.prototype.forEach.call(document.querySelectorAll('.cd__num'), function (el) { nums[el.getAttribute('data-unit')] = el; });
  var cd = document.getElementById('cd');
  var timer = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function set(unit, value) {
    var el = nums[unit], text = unit === 'days' ? String(value).padStart(2, '0') : pad(value);
    if (el.textContent === text) return;
    el.textContent = text;
    if (!reduced) {
      el.classList.remove('is-flip');
      void el.offsetWidth;                                // restart the animation
      el.classList.add('is-flip');
    }
  }
  function tick() {
    var left = DEADLINE - Date.now();
    if (left <= 0) {
      eb.classList.add('is-ended');
      var eyebrow = eb.querySelector('.eb__eyebrow-text');
      if (eyebrow) eyebrow.textContent = 'Cyprus 2027 season';
      if (timer) clearInterval(timer);
      return;
    }
    var s = Math.floor(left / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    set('days', d); set('hours', h); set('minutes', m); set('seconds', s);
    cd.setAttribute('aria-label', d + ' days, ' + h + ' hours and ' + m + ' minutes left for early booking');
  }
  tick();
  if (!eb.classList.contains('is-ended')) timer = setInterval(tick, 1000);

  /* ------------------------------------------------------------------
     Entrance when the section scrolls into view
     ------------------------------------------------------------------ */
  function enter() { eb.classList.add('is-in'); }
  if (reduced || !('IntersectionObserver' in window)) enter();
  else {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { enter(); io.disconnect(); }
    }, { threshold: 0.18 });
    io.observe(eb);
  }

  /* ------------------------------------------------------------------
     Desktop: 3D tilt, light reflection, photo parallax
     ------------------------------------------------------------------ */
  if (finePointer && !reduced) {
    offers.forEach(function (offer) {
      var card = offer.querySelector('.offer__card');
      var frame = 0;
      offer.addEventListener('pointerenter', function () {
        offer.classList.add('is-hot');
        deck.classList.add('has-hot');
      });
      offer.addEventListener('pointermove', function (e) {
        if (frame) return;
        frame = requestAnimationFrame(function () {
          frame = 0;
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          card.style.setProperty('--ry', ((x - 0.5) * 2 * TILT).toFixed(2) + 'deg');
          card.style.setProperty('--rx', ((0.5 - y) * 2 * TILT).toFixed(2) + 'deg');
          card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
          card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
          card.style.setProperty('--ix', ((0.5 - x) * 14).toFixed(1) + 'px');
          card.style.setProperty('--iy', ((0.5 - y) * 10).toFixed(1) + 'px');
        });
      });
      offer.addEventListener('pointerleave', function () {
        offer.classList.remove('is-hot');
        deck.classList.remove('has-hot');
        ['--rx', '--ry', '--ix', '--iy'].forEach(function (p) { card.style.removeProperty(p); });
      });
    });

    /* the background photo drifts gently with the pointer */
    var bgFrame = 0;
    eb.addEventListener('pointermove', function (e) {
      if (bgFrame) return;
      bgFrame = requestAnimationFrame(function () {
        bgFrame = 0;
        var r = eb.getBoundingClientRect();
        eb.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * -18).toFixed(1) + 'px');
        eb.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(1) + 'px');
      });
    });
  }

  /* ------------------------------------------------------------------
     Mobile: focus on the card in the middle, dots
     ------------------------------------------------------------------ */
  var dots = offers.map(function () { var i = document.createElement('i'); dotsBox.appendChild(i); return i; });
  var scrollFrame = 0;
  function focusDeck() {
    scrollFrame = 0;
    var start = getComputedStyle(offers[0]).scrollSnapAlign.indexOf('start') !== -1;   // tablet: cards line up from the left
    var pad = parseFloat(getComputedStyle(deck).paddingLeft) || 0;
    var mid = start ? deck.scrollLeft + pad : deck.scrollLeft + deck.clientWidth / 2, best = 0, bestD = Infinity;
    offers.forEach(function (o, k) {
      var c = start ? o.offsetLeft : o.offsetLeft + o.offsetWidth / 2, d = Math.abs(c - mid);
      o.style.setProperty('--far', Math.min(1, d / o.offsetWidth).toFixed(3));
      if (d < bestD) { bestD = d; best = k; }
    });
    if (deck.scrollLeft >= deck.scrollWidth - deck.clientWidth - 2 && deck.scrollWidth > deck.clientWidth + 2) best = offers.length - 1;   // scrolled to the end
    dots.forEach(function (dot, k) { dot.classList.toggle('is-active', k === best); });
  }
  deck.addEventListener('scroll', function () { if (!scrollFrame) scrollFrame = requestAnimationFrame(focusDeck); }, { passive: true });

  /* ------------------------------------------------------------------
     Layout
     ------------------------------------------------------------------ */
  function layout() { sizePhoto(); focusDeck(); }
  layout();
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
})();
