/* Travel Tech Platform · behaviour
   Reveal on view, count-ups, the hero orbit, live module previews,
   agent activity logs, star fields and cursor light. Every loop runs
   only while its section is on screen. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = root.classList.contains('reduced-motion');
  var touch = window.matchMedia && matchMedia('(hover: none)').matches;

  /* ---------- links: change targets here ---------- */
  var FORM = 'https://www.wwe-cy.com/demo-request-platform';
  var LINKS = {
    demo: FORM,
    start: FORM,
    consult: FORM,
    contact: FORM,
    pricing: FORM,
    whatsapp: 'https://wa.me/35799210460',
    phone: 'tel:+35722420437',
    email: 'mailto:info@wwe-cy.com'
  };
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var k = a.getAttribute('data-link');
    if (!LINKS[k]) return;
    a.href = LINKS[k];
    if (/^https?:/.test(LINKS[k])) {
      a.target = k === 'whatsapp' ? '_blank' : '_top';
      if (a.target === '_blank') a.rel = 'noopener';
    } else {
      a.target = '_top';
    }
  });

  /* ---------- section visibility ---------- */
  var sections = [].slice.call(document.querySelectorAll('.sec')).filter(function (s) {
    return s.offsetParent !== null || getComputedStyle(s).display !== 'none';
  });
  var hooks = { enter: {}, leave: {} };
  function on(id, enter, leave) {
    (hooks.enter[id] = hooks.enter[id] || []).push(enter);
    if (leave) (hooks.leave[id] = hooks.leave[id] || []).push(leave);
  }
  var visible = {};

  function setVisible(sec, v) {
    if (visible[sec.id] === v) return;
    visible[sec.id] = v;
    if (v) sec.classList.add('in');
    (v ? hooks.enter : hooks.leave)[sec.id] && (v ? hooks.enter : hooks.leave)[sec.id].forEach(function (f) { f(); });
  }

  /* ---------- count-ups (run when their card comes into view) ---------- */
  function countUp(box) {
    var delay = 350 + (parseFloat(box.style.getPropertyValue('--d')) || 0) * 90;
    box.querySelectorAll('[data-count]').forEach(function (el, i) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var to = +el.getAttribute('data-count');
      if (reduced) { el.textContent = to; return; }
      var t0 = null, dur = 1800 + i * 120;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, delay);
    });
  }

  /* ---------- star fields ---------- */
  function stars(sec) {
    var cv = sec.querySelector('.stars');
    if (!cv) return;
    var ctx = cv.getContext('2d'), W = 0, H = 0, pts = [], raf = 0, last = 0;
    function seed() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = sec.clientWidth; H = sec.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(W < 700 ? 40 : 110, (W * H) / 16000));
      pts = [];
      for (var i = 0; i < n; i++) {
        var r = Math.random();
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          z: Math.random() * .8 + .2,
          vy: -(Math.random() * 5 + 1.5),
          tw: Math.random() * 6.3,
          c: r < .82 ? '235,236,240' : r < .94 ? '183,175,255' : '46,196,182'
        });
      }
    }
    function draw(t) {
      var dt = last ? Math.min(.05, (t - last) / 1000) : 0;
      last = t;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduced) { p.y += p.vy * dt * p.z; if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; } }
        // fade near the top and bottom edges so stacked frames meet without a seam
        var edge = Math.min(1, Math.min(p.y, H - p.y) / 70);
        var a = ((.3 + .3 * Math.sin(t / 900 + p.tw)) * p.z + .08) * .7 * Math.max(0, edge);
        ctx.fillStyle = 'rgba(' + p.c + ',' + a.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, .5 + p.z * 1.1, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    seed();
    var lastW = W;
    window.addEventListener('resize', function () {
      if (sec.clientWidth !== lastW || Math.abs(sec.clientHeight - H) > 40) { lastW = sec.clientWidth; seed(); }
    });
    if (reduced) { draw(0); cancelAnimationFrame(raf); return; }
    on(sec.id, function () { last = 0; raf = requestAnimationFrame(draw); }, function () { cancelAnimationFrame(raf); });
  }
  sections.forEach(stars);

  /* ---------- cursor light ---------- */
  if (!touch && !reduced) {
    sections.forEach(function (sec) {
      sec.addEventListener('pointermove', function (e) {
        var r = sec.getBoundingClientRect();
        sec.style.setProperty('--px', (e.clientX - r.left) + 'px');
        sec.style.setProperty('--py', (e.clientY - r.top) + 'px');
        sec.classList.add('has-pointer');
        var card = e.target.closest && e.target.closest('.card');
        if (card) {
          var c = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - c.left) + 'px');
          card.style.setProperty('--my', (e.clientY - c.top) + 'px');
        }
      }, { passive: true });
      sec.addEventListener('pointerleave', function () { sec.classList.remove('has-pointer'); });
    });
  }

  /* ---------- hero orbit ---------- */
  (function () {
    var vis = document.querySelector('.hero__visual');
    var orbit = document.getElementById('orbit');
    if (!orbit) return;
    var chips = [].slice.call(orbit.querySelectorAll('.chip'));
    var comet = orbit.querySelector('.comet');
    var CX = 280, CY = 230, TILT = -10 * Math.PI / 180, cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    var raf = 0, t0 = performance.now();

    function fit() { // scale the 560 × 460 stage to the column on tablet and phone
      if (window.innerWidth > 1000) { vis.style.removeProperty('--sc'); return; }
      var sc = Math.min(window.innerWidth > 750 ? .9 : .56, (vis.clientWidth - 8) / 640);
      vis.style.setProperty('--sc', sc.toFixed(3));
    }
    fit();
    window.addEventListener('resize', fit);

    function place(el, a, rx, ry) {
      var x = rx * Math.cos(a), y = ry * Math.sin(a);
      return { x: CX + x * cosT - y * sinT, y: CY + x * sinT + y * cosT, depth: Math.sin(a) };
    }
    function frame(now) {
      var t = (now - t0) / 1000;
      chips.forEach(function (c, i) {
        var a = t * (2 * Math.PI / 52) + i * (2 * Math.PI / chips.length) + .5;
        var p = place(c, a, 236, 122);
        var k = (p.depth + 1) / 2;
        var s = .8 + .2 * k;
        c.style.transform = 'translate(' + (p.x - c.offsetWidth / 2).toFixed(1) + 'px,' + (p.y - c.offsetHeight / 2).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        c.style.opacity = (.5 + .5 * k).toFixed(3);
        c.style.zIndex = p.depth > 0 ? 11 : 5;
        c.classList.toggle('is-front', p.depth > .55);
      });
      var ca = -t * (2 * Math.PI / 9);
      var q = place(comet, ca, 200, 98);
      comet.style.transform = 'translate(' + q.x.toFixed(1) + 'px,' + q.y.toFixed(1) + 'px)';
      comet.style.zIndex = q.depth > 0 ? 12 : 4;
      comet.style.opacity = (.35 + .65 * (q.depth + 1) / 2).toFixed(3);
      raf = requestAnimationFrame(frame);
    }
    if (reduced) { frame(t0); cancelAnimationFrame(raf); return; }
    frame(t0); cancelAnimationFrame(raf);
    on('hero', function () { raf = requestAnimationFrame(frame); }, function () { cancelAnimationFrame(raf); });
  })();

  /* ---------- module live previews ---------- */
  function every(id, ms, fn) {
    var h = 0;
    on(id, function () { if (!reduced && !h) { fn(); h = setInterval(fn, ms); } }, function () { clearInterval(h); h = 0; });
  }

  (function pay() {
    var box = document.querySelector('[data-cycle="pay"]');
    if (!box) return;
    var toast = box.querySelector('.toast'), slot = box.querySelector('[data-slot]');
    var list = ['BK-24817 · €1,240 · Stripe', 'BK-24818 · €380 · PayPal', 'BK-24819 · €2,150 · Visa', 'BK-24820 · €960 · Amex', 'BK-24821 · €545 · Apple Pay'];
    var i = 0, first = true;
    every('modules', 3200, function () {
      if (first) { first = false; return; }
      i = (i + 1) % list.length;
      slot.textContent = list[i];
      toast.classList.remove('is-swap'); void toast.offsetWidth; toast.classList.add('is-swap');
    });
  })();

  (function inv() {
    var rows = [].slice.call(document.querySelectorAll('[data-cycle="inv"] .inv__row'));
    if (!rows.length) return;
    every('modules', 2300, function () {
      var r = rows[Math.floor(Math.random() * rows.length)];
      var b = r.querySelector('b'), bar = r.querySelector('.inv__bar i');
      var base = +b.getAttribute('data-price');
      var cur = +b.textContent.replace(/[^\d]/g, '');
      var next = Math.max(Math.round(base * .9), Math.min(Math.round(base * 1.15), cur + Math.round((Math.random() - .35) * base * .08)));
      if (next === cur) next = cur + 1;
      b.textContent = '€' + next;
      b.classList.toggle('up', next > cur);
      bar.style.setProperty('--v', (.35 + Math.random() * .6).toFixed(2));
    });
  })();

  (function dist() {
    var ch = [].slice.call(document.querySelectorAll('[data-cycle="dist"] .dist__ch'));
    if (!ch.length) return;
    var i = 0;
    every('modules', 650, function () {
      if (i < ch.length) ch[i].classList.add('is-on');
      i++;
      if (i > ch.length + 3) { ch.forEach(function (c) { c.classList.remove('is-on'); }); i = 0; }
    });
  })();

  function typer(el, lines, opts) {
    opts = opts || {};
    var li = 0, ci = 0, mode = 'type', h = 0, holdT = 0;
    function tick() {
      var s = lines[li];
      if (mode === 'type') {
        ci++;
        el.textContent = s.slice(0, ci);
        if (opts.progress) opts.progress(ci / s.length * .7);
        if (ci >= s.length) { mode = 'hold'; holdT = 0; }
      } else if (mode === 'hold') {
        holdT += 1;
        if (opts.progress) opts.progress(.7 + .3 * Math.min(1, holdT / 40));
        if (holdT > 52) mode = 'erase';
      } else {
        ci = Math.max(0, ci - 3);
        el.textContent = s.slice(0, ci);
        if (ci === 0) { mode = 'type'; li = (li + 1) % lines.length; if (opts.progress) opts.progress(0); }
      }
    }
    return {
      start: function () { if (!h) h = setInterval(tick, 38); },
      stop: function () { clearInterval(h); h = 0; },
      done: function () { el.textContent = lines[0]; if (opts.progress) opts.progress(1); }
    };
  }

  (function ai() {
    var box = document.querySelector('[data-cycle="ai"]');
    if (!box) return;
    var bar = box.querySelector('.prog i');
    var tp = typer(box.querySelector('[data-type]'), [
      'Writing Instagram post · Summer offers',
      'Generating 4 visuals · Limassol tours',
      'Drafting newsletter · 2,400 contacts',
      'Optimising Google profile · 12 keywords'
    ], { progress: function (p) { bar.style.width = (p * 100).toFixed(1) + '%'; } });
    if (reduced) { tp.done(); return; }
    box.querySelector('[data-type]').textContent = '';
    on('modules', tp.start, tp.stop);
  })();

  (function flow() {
    var items = [].slice.call(document.querySelectorAll('[data-cycle="flow"] li'));
    if (!items.length) return;
    if (reduced) { items.forEach(function (x) { x.classList.add('done'); }); return; }
    var i = 0;
    every('modules', 1100, function () {
      if (i < items.length) items[i].classList.add('done');
      i++;
      if (i > items.length + 2) { items.forEach(function (x) { x.classList.remove('done'); }); i = 0; }
    });
  })();

  (function crm() {
    var bars = [].slice.call(document.querySelectorAll('[data-cycle="crm"] .bars i'));
    var k = document.querySelector('[data-cycle="crm"] .crm__k b');
    if (!bars.length) return;
    var first = true;
    every('modules', 2600, function () {
      if (first) { first = false; return; }
      var n = bars.length;
      bars.forEach(function (b, i) {
        var trend = .3 + .6 * (i / (n - 1));
        var h = i === n - 1 ? .9 + Math.random() * .1 : Math.min(.85, trend + (Math.random() - .5) * .2);
        b.style.setProperty('--h', h.toFixed(2));
      });
      k.textContent = '+' + (14 + Math.floor(Math.random() * 9)) + '%';
    });
  })();

  /* ---------- agent activity logs ---------- */
  document.querySelectorAll('[data-log]').forEach(function (el, i) {
    var lines = el.getAttribute('data-log').split('|');
    var tp = typer(el, lines);
    if (reduced) { tp.done(); return; }
    var d = 0;
    on('ai', function () { d = setTimeout(tp.start, 500 + i * 700); }, function () { clearTimeout(d); tp.stop(); });
  });

  /* ---------- dot-matrix wordmark (final CTA) ----------
     The words are rasterised off-screen and turned into a halftone grid.
     When the section comes into view a light sweeps from right to left:
     the dots start scattered, blurred and dim and resolve into crisp
     letters as it passes, then shimmer softly. Blue → indigo → violet. */
  (function () {
    var cv = document.querySelector('.mark canvas');
    if (!cv) return;
    var STOPS = [[31, 111, 191], [74, 63, 196], [124, 108, 255]]; // sea blue → indigo → violet
    var COLS = 14, ALPHAS = 7, SWEEP = 2.6;
    var W, H, STEP, BAND, SC, data = null, builtW = 0, raf = 0, t0 = 0;
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function smooth(x) { return x * x * (3 - 2 * x); }
    function color(t) {
      var seg = t < .5 ? 0 : 1, k = t < .5 ? t * 2 : (t - .5) * 2, A = STOPS[seg], B = STOPS[seg + 1];
      return [0, 1, 2].map(function (i) { return Math.round(A[i] + (B[i] - A[i]) * k); });
    }
    function build() {
      W = Math.max(280, Math.round(cv.clientWidth)); H = Math.max(80, Math.round(cv.clientHeight));
      SC = W / 1200; STEP = clamp(Math.round(W / 150), 5, 9); BAND = Math.max(110, 300 * SC);
      var lines = (W < 600 ? cv.getAttribute('data-word-phone') : cv.getAttribute('data-word')) || 'ONE LOGIN';
      lines = lines.split('|');
      var off = document.createElement('canvas'); off.width = W; off.height = H;
      var c = off.getContext('2d'), font = function (n) { return '700 ' + n + 'px Syne, "Plus Jakarta Sans", sans-serif'; };
      c.font = font(100);
      var wide = Math.max.apply(null, lines.map(function (l) { return c.measureText(l).width; }));
      var N = Math.min((W - 2 * Math.max(10, 24 * SC)) / (wide / 100), (H - 8) / (lines.length * .86));
      c.font = font(N); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      var cap = N * .7, lh = N * .86, top = (H - (lines.length - 1) * lh - cap) / 2;
      lines.forEach(function (l, i) { c.fillText(l, W / 2, top + cap + i * lh); });
      var img = c.getImageData(0, 0, W, H).data, o = Math.max(1, Math.round(STEP * .28));
      function sample(x, y) {
        var sum = 0, n = 0;
        for (var oy = -o; oy <= o; oy += o) for (var ox = -o; ox <= o; ox += o) {
          var px = Math.round(x + ox), py = Math.round(y + oy);
          if (px < 0 || py < 0 || px >= W || py >= H) continue;
          sum += img[(py * W + px) * 4 + 3]; n++;
        }
        return sum / n / 255;
      }
      var dots = [], minX = W, maxX = 0;
      for (var y = STEP / 2; y < H; y += STEP) for (var x = STEP / 2; x < W; x += STEP) {
        var a = sample(x, y);
        if (a > .06) {
          dots.push({ x: x, y: y, a: a, r: STEP * .47 * Math.sqrt(a) * (.8 + .2 * (1 - y / H)), j: Math.random() * 80,
            ox: (Math.random() - .5) * 150 * Math.max(.35, SC), oy: (Math.random() - .5) * 90 * Math.max(.35, SC), ph: Math.random() * 6.28 });
          if (x < minX) minX = x; if (x > maxX) maxX = x;
        }
      }
      dots.forEach(function (d) { d.ci = Math.min(COLS - 1, Math.floor(clamp((d.x - minX) / Math.max(1, maxX - minX), 0, 1) * COLS)); });
      var colors = []; for (var i = 0; i < COLS; i++) colors.push(color((i + .5) / COLS));
      builtW = cv.clientWidth;
      data = { dots: dots, colors: colors };
    }
    var buckets = []; for (var b = 0; b < COLS * ALPHAS; b++) buckets.push([]);
    function draw(now) {
      if (!data || Math.abs(cv.clientWidth - builtW) > 2) build();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      var ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var el = reduced ? 99 : (now - t0) / 1000 - .35;
      var p = clamp(el / SWEEP, 0, 1), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      var sx = W + BAND - e * (W + BAND * 2 + 120 * SC), done = p >= 1;
      buckets.forEach(function (q) { q.length = 0; });
      data.dots.forEach(function (d) {
        var k = smooth(done ? 1 : clamp((d.x - sx - d.j) / BAND, 0, 1)), inv = 1 - k;
        var a = (.14 + .86 * k) * (.55 + .45 * d.a);
        if (done && !reduced) a *= .84 + .16 * Math.sin(d.x * .011 + d.y * .004 - el * 1.7 + d.ph * .15);
        buckets[d.ci * ALPHAS + Math.min(ALPHAS - 1, Math.floor(a * ALPHAS))].push(d.x + d.ox * inv * inv, d.y + d.oy * inv * inv, d.r * (1 + 1.5 * inv), inv);
      });
      for (var ci = 0; ci < COLS; ci++) {
        var col = data.colors[ci];
        for (var ai = 0; ai < ALPHAS; ai++) {
          var q = buckets[ci * ALPHAS + ai];
          if (!q.length) continue;
          var al = (ai + .5) / ALPHAS;
          ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + al.toFixed(3) + ')';
          ctx.beginPath();
          for (var n = 0; n < q.length; n += 4) { ctx.moveTo(q[n] + q[n + 2], q[n + 1]); ctx.arc(q[n], q[n + 1], q[n + 2], 0, 6.283); }
          ctx.fill();
          if (!done) { // soft halo around unresolved dots
            ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (al * .18).toFixed(3) + ')';
            ctx.beginPath();
            for (n = 0; n < q.length; n += 4) {
              if (q[n + 3] < .15) continue;
              var rr = q[n + 2] * (1 + 1.6 * q[n + 3]);
              ctx.moveTo(q[n] + rr, q[n + 1]); ctx.arc(q[n], q[n + 1], rr, 0, 6.283);
            }
            ctx.fill();
          }
        }
      }
      if (!done && el > 0) { // the sweep of light
        var R = Math.max(60, 150 * SC), g;
        ctx.save(); ctx.translate(sx + 60 * SC, H / 2); ctx.scale(1, 1.8);
        g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
        g.addColorStop(0, 'rgba(214,224,255,.18)'); g.addColorStop(.35, 'rgba(214,224,255,.07)'); g.addColorStop(.7, 'rgba(214,224,255,0)');
        ctx.fillStyle = g; ctx.fillRect(-R, -R, R * 2, R * 2); ctx.restore();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    }
    var fontReady = document.fonts && document.fonts.load ? document.fonts.load('700 200px Syne').catch(function () {}) : Promise.resolve();
    t0 = Infinity; // dots wait, scattered and dim, until the wordmark itself is on screen
    cv.parentNode.addEventListener('reveal', function () { fontReady.then(function () { t0 = performance.now(); }); });
    on('cta', function () {
      fontReady.then(function () {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      });
    }, function () { cancelAnimationFrame(raf); });
  })();

  /* ---------- fit a single section to its Wix frame ----------
     The frame has one fixed height per Wix breakpoint. If the content is
     taller at an unusual width, shrink the padding first, then zoom out. */
  (function () {
    if (!root.classList.contains('is-single') || !root.classList.contains('is-embedded')) return;
    var sec = sections[0];
    if (!sec) return;
    var wrap = sec.querySelector('.wrap');
    function fit() {
      wrap.style.zoom = '';
      sec.style.paddingTop = sec.style.paddingBottom = '';
      var H = window.innerHeight;
      if (sec.offsetHeight <= H) return;
      var pad = parseFloat(getComputedStyle(sec).paddingTop) || 0;
      var p = Math.max(12, Math.floor((H - (sec.offsetHeight - 2 * pad)) / 2));
      sec.style.paddingTop = sec.style.paddingBottom = p + 'px';
      // zoom changes the line wrapping, so settle in a few steps
      for (var i = 0, z = 1; i < 4 && sec.offsetHeight > H; i++) {
        z = Math.max(.6, z * (H - 2 * p) / (sec.offsetHeight - 2 * p));
        wrap.style.zoom = z.toFixed(3);
      }
    }
    fit();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fit, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  })();

  /* ---------- observe ----------
     Sections switch their loops on and off. Each card, heading and the
     wordmark reveals on its own once a good part of it is on screen, so a
     tall frame does not finish its animations before you scroll to them. */
  var items = [];
  sections.forEach(function (s) { items = items.concat([].slice.call(s.querySelectorAll('.rv, .mark'))); });
  function reveal(el) {
    if (el.classList.contains('is-in')) return;
    el.classList.add('is-in');
    countUp(el);
    el.dispatchEvent(new Event('reveal'));
  }
  if (!('IntersectionObserver' in window) || reduced) {
    sections.forEach(function (s) { setVisible(s, true); });
    items.forEach(reveal);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { setVisible(e.target, e.isIntersecting); });
  }, { threshold: [0, .12] });
  sections.forEach(function (s) { io.observe(s); });
  var eio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      // half of the element, or 260px of a tall one
      if (e.isIntersecting && e.intersectionRect.height >= Math.min(e.boundingClientRect.height * .5, 260)) {
        reveal(e.target);
        eio.unobserve(e.target);
      }
    });
  }, { threshold: [0, .1, .25, .5, .75, 1] });
  items.forEach(function (el) { eio.observe(el); });
})();
