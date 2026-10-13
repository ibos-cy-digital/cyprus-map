/* =====================================================================
   WWE Travel CY · Home page services slider
   The active card sits in the middle; the neighbours step back on
   both sides. Autoplay with a progress fill in the active dot, pause
   on hover / focus / hidden tab / off screen, arrows, dots, a click on
   a side card, swipe on touch, keyboard arrows. No dependencies.
   ===================================================================== */
(function () {
  'use strict';

  var DURATION = 5500;                                    // ms per card
  var RATIO = 1.5;                                        // desktop card width : height
  var MAX_W = 480;                                        // desktop card width, px
  var root = document.documentElement;
  var ss = document.getElementById('ss');
  var stage = document.getElementById('stage');
  var dotsBox = document.getElementById('dots');
  var cards = Array.prototype.slice.call(stage.querySelectorAll('.card'));
  var prev = ss.querySelector('.arrow--prev');
  var next = ss.querySelector('.arrow--next');
  var n = cards.length;
  if (!n) return;

  var reducedMQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = !!(reducedMQ && reducedMQ.matches);

  var current = 0;
  var elapsed = 0;
  var last = 0;
  var paused = { hover: false, focus: false, hidden: document.hidden, offscreen: false };

  /* ------------------------------------------------------------------
     Dots (one per card, with a progress fill in the active one)
     ------------------------------------------------------------------ */
  var dots = cards.map(function (c, k) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Service ' + (k + 1) + ': ' + c.querySelector('.card__title').textContent);
    b.innerHTML = '<i></i>';
    b.addEventListener('click', function () { go(k); });
    dotsBox.appendChild(b);
    return b;
  });

  /* ------------------------------------------------------------------
     Geometry: card size and where each neighbour sits
     ------------------------------------------------------------------ */
  var geo = null;
  function measure() {
    var W = stage.clientWidth, H = stage.clientHeight;
    var mobile = getComputedStyle(root).getPropertyValue('--layout').trim() === 'mobile';
    var cw, ch, s1, s2, x1, x2;
    if (mobile) {
      cw = Math.min(W * 0.84, 360);
      ch = Math.min(H, cw * 1.45);
      s1 = 0.9; s2 = 0.8;
      x1 = cw / 2 + s1 * cw / 2 + 12;
      x2 = x1 + s1 * cw / 2 + s2 * cw / 2 + 12;
    } else {
      /* a landscape card (3 : 2) that never stretches with the frame height */
      cw = Math.min(W * (W < 980 ? 0.48 : 0.4), MAX_W, H * RATIO);
      ch = cw / RATIO;
      s1 = 0.8; s2 = 0.64;
      x2 = W / 2 - s2 * cw / 2;                         // the outer cards end at the stage edge
      x1 = cw / 2 + (x2 - cw / 2) * 0.42;
    }
    geo = { cw: cw, ch: ch, s: [1, s1, s2, s2 * 0.85], x: [0, x1, x2, x2 + cw * 0.3] };
  }

  function offset(k) {                                    // signed distance from the active card
    var d = ((k - current) % n + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  function place() {
    if (!geo) measure();
    cards.forEach(function (c, k) {
      var d = offset(k), a = Math.min(Math.abs(d), 3), sign = d < 0 ? -1 : 1;
      c.style.width = geo.cw + 'px';
      c.style.height = geo.ch + 'px';
      c.style.transform = 'translate(-50%, -50%) translateX(' + (sign * geo.x[a]).toFixed(1) + 'px) scale(' + geo.s[a] + ')';
      c.style.zIndex = String(10 - a);
      c.classList.toggle('is-active', a === 0);
      c.classList.toggle('is-near', a === 1);
      c.classList.toggle('is-far', a === 2);
      c.classList.toggle('is-out', a === 3);
    });
  }

  /* ------------------------------------------------------------------
     Show a card
     ------------------------------------------------------------------ */
  function go(i) {
    i = ((i % n) + n) % n;
    current = i;
    elapsed = 0;
    place();
    cards.forEach(function (c, k) {
      var on = k === i;
      c.setAttribute('aria-hidden', on ? 'false' : 'true');
      Array.prototype.forEach.call(c.querySelectorAll('a'), function (a) { a.tabIndex = on ? 0 : -1; });
    });
    dots.forEach(function (d, k) {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-selected', k === i ? 'true' : 'false');
      d.firstChild.style.transform = 'scaleX(0)';
    });
  }

  /* ------------------------------------------------------------------
     Autoplay (pauses on hover, focus, hidden tab, off screen)
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
      else dots[current].firstChild.style.transform = 'scaleX(' + (elapsed / DURATION).toFixed(4) + ')';
    }
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------
     Controls
     ------------------------------------------------------------------ */
  prev.addEventListener('click', function () { go(current - 1); });
  next.addEventListener('click', function () { go(current + 1); });

  /* a click on a side card brings it to the middle */
  cards.forEach(function (c, k) {
    c.addEventListener('click', function (e) {
      if (k === current) return;
      e.preventDefault();
      go(k);
    });
  });

  ss.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
  });

  stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') paused.hover = true; });
  stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') paused.hover = false; });
  ss.addEventListener('focusin', function () { paused.focus = true; });
  ss.addEventListener('focusout', function (e) { if (!ss.contains(e.relatedTarget)) paused.focus = false; });
  document.addEventListener('visibilitychange', function () { paused.hidden = document.hidden; last = 0; });

  /* swipe on touch / pen */
  var sx = 0, sy = 0, swiping = false, swiped = false;
  stage.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    swiping = true; swiped = false; sx = e.clientX; sy = e.clientY;
  });
  stage.addEventListener('pointerup', function (e) {
    if (!swiping) return;
    swiping = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      swiped = true;
      go(current + (dx < 0 ? 1 : -1));
    }
  });
  stage.addEventListener('pointercancel', function () { swiping = false; });
  stage.addEventListener('click', function (e) {          // a swipe must not also follow a link
    if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; }
  }, true);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      paused.offscreen = !entries[0].isIntersecting;
    }, { threshold: 0.25 }).observe(stage);
  }

  if (reducedMQ && reducedMQ.addEventListener) {
    reducedMQ.addEventListener('change', function (e) {
      reduced = e.matches;
      root.classList.toggle('reduced-motion', reduced);
    });
  }

  /* keep the geometry right when the frame is resized */
  function relayout() { measure(); place(); }
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(stage);
  else window.addEventListener('resize', relayout);

  /* ------------------------------------------------------------------
     Init (no transition on the first layout)
     ------------------------------------------------------------------ */
  root.classList.add('is-placing');
  measure();
  go(0);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.remove('is-placing'); });
  });
  requestAnimationFrame(tick);
})();
