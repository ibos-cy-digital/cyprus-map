/* =====================================================================
   WWE Travel CY · Early booking 2027
   - Countdown to the deadline (Cyprus time) with flip digits.
   - A 3D orbit of four offer cards with a timed sequence:
       base (the section's own photo) → card 1 comes to the front →
       its details open and its photo fades into the background →
       card 2, 3, 4 → back to the base photo → repeat.
   - Arrows, swipe and a click on a side card; autoplay pauses while
     the visitor is interacting and resumes a little later.
   - After the deadline the countdown and discounts are removed.
   No dependencies.
   ===================================================================== */
(function () {
  'use strict';

  /* Early booking ends at this moment, Cyprus time (EET, UTC+2 in November). */
  var DEADLINE = Date.parse('2026-11-30T23:59:59+02:00');
  var BASE_HOLD = 2800;          // ms on the base photo before the first card
  var CARD_HOLD = 6500;          // ms each open card stays
  var TURN = 1100;               // ms for the orbit to turn
  var RESUME = 9000;             // ms after an interaction before autoplay resumes

  var root = document.documentElement;
  var eb = document.getElementById('eb');
  var stage = document.getElementById('stage');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.oc'));
  var photos = Array.prototype.slice.call(document.querySelectorAll('.eb__photo'));
  var bars = Array.prototype.slice.call(document.querySelectorAll('#bars i'));
  var n = cards.length;
  var reduced = root.classList.contains('reduced-motion');

  /* ------------------------------------------------------------------
     Countdown
     ------------------------------------------------------------------ */
  var nums = {};
  Array.prototype.forEach.call(document.querySelectorAll('.cd__num'), function (el) { nums[el.getAttribute('data-unit')] = el; });
  var cd = document.getElementById('cd');
  var clock = null;
  function pad(v) { return (v < 10 ? '0' : '') + v; }
  function set(unit, value) {
    var el = nums[unit], text = pad(value);
    if (el.textContent === text) return;
    el.textContent = text;
    if (!reduced) { el.classList.remove('is-flip'); void el.offsetWidth; el.classList.add('is-flip'); }
  }
  function tickClock() {
    var left = DEADLINE - Date.now();
    if (left <= 0) {
      eb.classList.add('is-ended');
      var eyebrow = eb.querySelector('.eb__eyebrow-text');
      if (eyebrow) eyebrow.textContent = 'Cyprus 2027 season';
      if (clock) clearInterval(clock);
      return;
    }
    var s = Math.floor(left / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    set('days', d); set('hours', h); set('minutes', m); set('seconds', s);
    cd.setAttribute('aria-label', d + ' days, ' + h + ' hours and ' + m + ' minutes left for early booking');
  }
  tickClock();
  if (!eb.classList.contains('is-ended')) clock = setInterval(tickClock, 1000);

  /* ------------------------------------------------------------------
     Card photos: one image spread over the three slices of the curve
     ------------------------------------------------------------------ */
  function sizeCardPhotos() {
    var cw = cards[0].offsetWidth, ch = cards[0].offsetHeight;
    cards.forEach(function (c) {
      var img = new Image();
      img.onload = function () {
        var ar = img.naturalWidth / img.naturalHeight, bw, bh;
        if (ar > cw / ch) { bh = ch; bw = ch * ar; } else { bw = cw; bh = cw / ar; }
        var fx = parseFloat(getComputedStyle(c).getPropertyValue('--fx')) || 0.5;
        c.style.setProperty('--img', 'url("' + new URL(c.getAttribute('data-img'), location.href).href + '")');   // absolute: the CSS file lives in css/
        c.style.setProperty('--bw', bw.toFixed(1) + 'px');
        c.style.setProperty('--bh', bh.toFixed(1) + 'px');
        c.style.setProperty('--bx', (-(bw - cw) * fx).toFixed(1) + 'px');
        c.style.setProperty('--by', (-(bh - ch) * 0.5).toFixed(1) + 'px');
      };
      img.src = c.getAttribute('data-img');
    });
  }

  /* ------------------------------------------------------------------
     Orbit geometry: card k sits at angle k·90° − rot on an ellipse
     ------------------------------------------------------------------ */
  var rot = -45;                 // between two cards: the base state shows no card in front
  var geo = { rx: 220, rz: 160, lift: 0 };
  function measureOrbit() {
    var w = stage.clientWidth, cw = cards[0].offsetWidth;
    geo.rx = Math.max(110, Math.min(250, (w - cw * 0.74) / 2 - 6));
    geo.rz = 170;
    geo.lift = cards[0].offsetHeight * 0.3;
  }
  function norm(a) { a = ((a % 360) + 360) % 360; return a > 180 ? a - 360 : a; }
  function place() {
    cards.forEach(function (c, k) {
      var t = norm(k * 90 - rot) * Math.PI / 180;
      var depth = Math.cos(t);                         // 1 front, −1 back
      var near = (depth + 1) / 2;                      // 0 … 1
      var x = Math.sin(t) * geo.rx;
      var z = (depth - 1) * geo.rz;
      var s = 0.58 + 0.42 * Math.pow(near, 1.3);
      var y = (1 - near) * -geo.lift;                  // cards behind sit higher, inside the panel
      c.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateY(' + (-Math.sin(t) * 24).toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
      c.style.zIndex = String(Math.round(near * 20));
      c.style.opacity = (0.25 + 0.75 * Math.min(1, near * 1.25)).toFixed(3);
      c.style.setProperty('--dim', (0.55 * (1 - near)).toFixed(3));
      c.classList.toggle('is-front', near > 0.98);
    });
  }

  /* smooth turn from the current angle to a target angle */
  var anim = null;
  function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function turnTo(target, done) {
    if (anim) cancelAnimationFrame(anim.raf);
    if (reduced) { rot = target; place(); if (done) done(); return; }
    var from = rot, t0 = performance.now();
    anim = { raf: 0 };
    (function step(now) {
      var p = Math.min(1, (now - t0) / TURN);
      rot = from + (target - from) * ease(p);
      place();
      if (p < 1) anim.raf = requestAnimationFrame(step);
      else { anim = null; if (done) done(); }
    })(t0);
  }

  /* ------------------------------------------------------------------
     States: pos = −1 base, 0 … 3 an open card
     ------------------------------------------------------------------ */
  var pos = -1;
  var busy = false;
  function background(k) {
    photos.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-bg') === (k < 0 ? 'base' : String(k))); });
  }
  function openCard(k) {
    cards.forEach(function (c, i) {
      var on = i === k;
      c.classList.toggle('is-open', on);
      c.setAttribute('aria-hidden', on ? 'false' : 'true');
      Array.prototype.forEach.call(c.querySelectorAll('a'), function (a) { a.tabIndex = on ? 0 : -1; });
    });
    background(k);
    bars.forEach(function (b, i) {
      b.classList.toggle('is-done', k >= 0 && i < k);
      b.firstChild.style.transform = i < k && k >= 0 ? '' : 'scaleX(0)';
    });
  }
  /* go to card k (dir +1 forward, −1 back) or to the base (k = −1) */
  function go(k, dir) {
    busy = true;
    elapsed = 0;
    openCard(-2);                                      // close the open card, keep the photo for a moment
    background(pos);
    var target;
    if (k < 0) target = Math.ceil(rot / 90) * 90 + 45;    // between two cards, turning forward
    else {
      var cur = rot, want = k * 90, diff = norm(want - cur);
      if (dir > 0 && diff <= 0) diff += 360;
      if (dir < 0 && diff >= 0) diff -= 360;
      target = cur + diff;
    }
    setTimeout(function () {
      turnTo(target, function () {
        pos = k;
        openCard(k);
        busy = false;
      });
    }, reduced ? 0 : 260);
  }

  /* ------------------------------------------------------------------
     Autoplay with pauses
     ------------------------------------------------------------------ */
  var elapsed = 0, last = 0;
  var paused = { hover: false, focus: false, hidden: document.hidden, offscreen: true, user: 0 };
  function isPaused(now) { return reduced || paused.hover || paused.focus || paused.hidden || paused.offscreen || now < paused.user; }
  function tick(now) {
    if (!last) last = now;
    var dt = Math.min(100, now - last);
    last = now;
    if (!busy && !isPaused(now)) {
      elapsed += dt;
      var hold = pos < 0 ? BASE_HOLD : CARD_HOLD;
      if (pos >= 0) bars[pos].firstChild.style.transform = 'scaleX(' + Math.min(1, elapsed / hold).toFixed(4) + ')';
      if (elapsed >= hold) {
        if (pos < 0) go(0, 1);
        else if (pos < n - 1) go(pos + 1, 1);
        else go(-1, 1);
      }
    }
    requestAnimationFrame(tick);
  }

  function interact() { paused.user = performance.now() + RESUME; }
  function next() { interact(); if (!busy) go(pos < 0 ? 0 : (pos + 1) % n, 1); }
  function prev() { interact(); if (!busy) go(pos < 0 ? n - 1 : (pos + n - 1) % n, -1); }
  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', prev);

  /* a click on a side card brings it to the front */
  cards.forEach(function (c, k) {
    c.addEventListener('click', function (e) {
      if (c.classList.contains('is-open')) return;
      e.preventDefault();
      interact();
      if (busy) return;
      var d = norm(k * 90 - rot);
      go(k, d >= 0 ? 1 : -1);
    });
  });

  eb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') paused.hover = true; });
  stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') paused.hover = false; });
  eb.addEventListener('focusin', function () { paused.focus = true; });
  eb.addEventListener('focusout', function (e) { if (!eb.contains(e.relatedTarget)) paused.focus = false; });
  document.addEventListener('visibilitychange', function () { paused.hidden = document.hidden; last = 0; });

  /* swipe on touch */
  var sx = 0, sy = 0, swiping = false, swiped = false;
  stage.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') return; swiping = true; swiped = false; sx = e.clientX; sy = e.clientY; });
  stage.addEventListener('pointerup', function (e) {
    if (!swiping) return;
    swiping = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped = true; if (dx < 0) next(); else prev(); }
  });
  stage.addEventListener('pointercancel', function () { swiping = false; });
  stage.addEventListener('click', function (e) { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);

  /* start when the section is on screen */
  function enter() { eb.classList.add('is-in'); paused.offscreen = false; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) enter(); else paused.offscreen = true;
    }, { threshold: 0.3 }).observe(eb);
  } else enter();

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function layout() { measureOrbit(); place(); sizeCardPhotos(); }
  layout();
  window.addEventListener('resize', layout);
  if (reduced) { enter(); rot = 0; pos = 0; place(); openCard(0); }
  else openCard(-1);
  requestAnimationFrame(tick);
})();
