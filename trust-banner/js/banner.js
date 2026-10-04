/* =====================================================================
   WWE Travel CY · Trust banner · slider
   Autoplay every 6 s with a progress bar, pause on hover / focus,
   arrows + dots, swipe on touch, keyboard arrows. No dependencies.
   ===================================================================== */
(function () {
  'use strict';

  var DURATION = 6000;      // ms per slide

  var root = document.documentElement;
  var card = document.getElementById('card');
  var tb = document.getElementById('tb');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.sl'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.dot'));
  var bar = document.getElementById('progress');
  var prev = document.querySelector('.arrow--prev');
  var next = document.querySelector('.arrow--next');
  if (!card || !slides.length) return;

  var reducedMQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = !!(reducedMQ && reducedMQ.matches);

  var current = 0;
  var elapsed = 0;
  var last = 0;
  var paused = { hover: false, focus: false, hidden: document.hidden, offscreen: false };

  /* ------------------------------------------------------------------
     Show a slide
     ------------------------------------------------------------------ */
  function go(i) {
    var n = slides.length;
    i = ((i % n) + n) % n;
    if (i === current && slides[i].classList.contains('is-active')) { elapsed = 0; return; }
    slides.forEach(function (s, k) {
      var on = k === i;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      if ('inert' in s) s.inert = !on;
      else Array.prototype.forEach.call(s.querySelectorAll('a, button'), function (a) { a.tabIndex = on ? 0 : -1; });
    });
    dots.forEach(function (d, k) {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
    current = i;
    elapsed = 0;
    if (bar) bar.style.transform = 'scaleX(0)';
  }

  /* ------------------------------------------------------------------
     Autoplay loop (pauses on hover, focus, hidden tab, off screen)
     ------------------------------------------------------------------ */
  function isPaused() {
    return reduced || paused.hover || paused.focus || paused.hidden || paused.offscreen;
  }
  function tick(now) {
    if (!last) last = now;
    var dt = Math.min(100, now - last);
    last = now;
    if (!isPaused()) {
      elapsed += dt;
      if (elapsed >= DURATION) go(current + 1);
      else if (bar) bar.style.transform = 'scaleX(' + (elapsed / DURATION).toFixed(4) + ')';
    }
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------
     Controls
     ------------------------------------------------------------------ */
  prev.addEventListener('click', function () { go(current - 1); });
  next.addEventListener('click', function () { go(current + 1); });
  dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });

  tb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
  });

  /* pause on hover (mouse) and while keyboard focus is inside */
  card.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') paused.hover = true; });
  card.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') paused.hover = false; });
  tb.addEventListener('focusin', function () { paused.focus = true; });
  tb.addEventListener('focusout', function (e) { if (!tb.contains(e.relatedTarget)) paused.focus = false; });
  document.addEventListener('visibilitychange', function () { paused.hidden = document.hidden; last = 0; });

  /* swipe on touch / pen */
  var sx = 0, sy = 0, swiping = false, swiped = false;
  card.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    swiping = true; swiped = false; sx = e.clientX; sy = e.clientY;
  });
  card.addEventListener('pointerup', function (e) {
    if (!swiping) return;
    swiping = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      swiped = true;
      go(current + (dx < 0 ? 1 : -1));
    }
  });
  card.addEventListener('pointercancel', function () { swiping = false; });
  /* a swipe that ends on a button must not also follow its link */
  card.addEventListener('click', function (e) {
    if (swiped) { e.preventDefault(); swiped = false; }
  }, true);

  /* pause while the banner is off screen (IntersectionObserver works inside the iframe) */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      paused.offscreen = !entries[0].isIntersecting;
    }, { threshold: 0.25 }).observe(card);
  }

  if (reducedMQ && reducedMQ.addEventListener) {
    reducedMQ.addEventListener('change', function (e) {
      reduced = e.matches;
      root.classList.toggle('reduced-motion', reduced);
    });
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  current = -1;
  go(0);
  requestAnimationFrame(tick);
})();
