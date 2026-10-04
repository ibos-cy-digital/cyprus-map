/* =====================================================================
   WWE Travel CY · "Kipar koji poznajemo" · interaction + motion
   Content lives in js/data.js. This file builds the map markers and the
   region selector, runs the entrance sequence and switches the panel.
   ===================================================================== */
(function () {
  'use strict';

  var DATA = window.WWE_SECTION_DATA;
  var M = window.WWEMotion;
  if (!DATA || !M) return;

  var regions = DATA.regions;
  var airports = DATA.airports;
  var settings = DATA.settings || {};

  /* language: all visible text comes from js/i18n.js (?lang=sr | ?lang=en) */
  var I18N = window.WWE_I18N;
  var T = (I18N && I18N.t) || {};
  if (I18N) {
    I18N.localizeRegions(regions);
    I18N.apply(document);
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  var root = document.documentElement;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    wwe: $('wwe'),
    map: $('map'),
    svg: $('map-svg'),
    stage: document.querySelector('.map__stage'),
    markers: $('markers'),
    airports: $('airports'),
    regions: $('regions'),
    routeDots: $('route-dots'),
    routeTrail: $('route-trail'),
    routeLabel: $('route-label'),
    plane: $('plane'),
    panel: $('panel'),
    bignum: $('bignum'),
    idx: $('p-idx'),
    coords: $('p-coords'),
    name: $('p-name'),
    line: $('p-line'),
    transfer: $('p-transfer'),
    stay: $('p-stay'),
    exp: $('p-exp'),
    ideal: $('p-ideal'),
    cover: $('cover'),
    hint: $('hint'),
    hintText: $('hint-text'),
    pcA: $('pc-a'),
    pcB: $('pc-b'),
    title: document.querySelector('.title'),
    head: document.querySelector('.head'),
    foot: $('foot')
  };
  var swapEls = Array.prototype.slice.call(el.panel.querySelectorAll('.swap'));

  /* ------------------------------------------------------------------
     State
     ------------------------------------------------------------------ */
  var reducedMQ = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = !!(reducedMQ && reducedMQ.matches);
  var current = -1;
  var seq = 0;
  var k = 1.6;             // SVG units per screen px
  var ms = 1;              // marker scale (SVG units)
  var flight = null;       // running flight tween
  var routeGeo = null;     // current route geometry, for resize
  var mapStarted = false;
  var mapReady = false;
  var auto = { on: true, timer: 0, inView: true };
  var hoverTimer = 0;
  var anims = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

  var defaultIndex = Math.max(0, indexOf(settings.defaultRegion));
  var AUTO_MS = settings.autoAdvanceMs || 7000;

  /* postcard angles per region, so the "journal" reshuffles on every change */
  var ANGLES_A = [5, -4, 6.5, -3, 4];
  var ANGLES_B = [-6, 5, -4.5, 7, -5.5];

  function indexOf(id) {
    for (var i = 0; i < regions.length; i++) if (regions[i].id === id) return i;
    return 0;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtMin(m) {
    m = Math.round(m);
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60), r = m % 60;
    return h + 'h' + (r ? ' ' + r + ' min' : '');
  }
  function layout() {
    var v = getComputedStyle(root).getPropertyValue('--layout');
    return (v || 'desktop').trim();
  }
  function svgEl(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var a in attrs) n.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function run(node, frames, opts) {
    if (!node) return null;
    if (anims) {
      var prev = anims.get(node);
      if (prev) prev.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    }
    var a = M.animate(node, frames, opts);
    if (anims && a) anims.set(node, [a]);
    return a;
  }

  /* ------------------------------------------------------------------
     Build: markers, airports, region selector
     ------------------------------------------------------------------ */
  var markerEls = [];
  var tabEls = [];

  regions.forEach(function (r, i) {
    var g = svgEl('g', { 'class': 'mk', transform: 'translate(' + r.map.x + ' ' + r.map.y + ')', 'data-i': i, 'aria-hidden': 'true' }, el.markers);
    g.style.setProperty('--i', i);
    var s = svgEl('g', { 'class': 'mk__s' }, g);
    var pop = svgEl('g', { 'class': 'mk__pop' }, s);
    var hov = svgEl('g', { 'class': 'mk__hover' }, pop);
    svgEl('circle', { 'class': 'mk__halo', r: 17 }, hov);
    svgEl('circle', { 'class': 'mk__dot', r: 14 }, hov);
    var num = svgEl('text', { 'class': 'mk__num', y: 4.3 }, hov);
    num.textContent = pad(i + 1);
    svgEl('circle', { 'class': 'mk__hit', r: 26 }, hov);
    var lb = r.label || { dx: 22, dy: 5, anchor: 'start' };
    var label = svgEl('text', { 'class': 'mk__label', x: lb.dx, y: lb.dy, 'text-anchor': lb.anchor || 'start' }, s);
    label.textContent = r.name;
    markerEls.push(g);

    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'rg';
    b.id = 'rg-' + i;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'panel');
    b.setAttribute('aria-selected', 'false');
    b.tabIndex = -1;
    b.dataset.i = i;
    b.innerHTML = '<span class="rg__bar" aria-hidden="true"></span>' +
      '<span class="rg__num">' + pad(i + 1) + '</span>' +
      '<span class="rg__name"><span class="rg__full"></span><span class="rg__short" aria-hidden="true"></span></span>';
    b.querySelector('.rg__full').textContent = r.name;
    b.querySelector('.rg__short').textContent = r.short || r.name;
    el.regions.appendChild(b);
    tabEls.push(b);
  });

  Object.keys(airports).forEach(function (code) {
    var a = airports[code];
    var g = svgEl('g', { 'class': 'ap', transform: 'translate(' + a.map.x + ' ' + a.map.y + ')' }, el.airports);
    var s = svgEl('g', { 'class': 'ap__s' }, g);
    var pop = svgEl('g', { 'class': 'ap__pop' }, s);
    svgEl('circle', { 'class': 'ap__bg', r: 11 }, pop);
    svgEl('path', {
      'class': 'ap__icon',
      transform: 'translate(-7.2 -7.2) scale(0.6)',
      d: 'M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-6z'
    }, pop);
    var lb = a.label || { dx: 18, dy: 4, anchor: 'start' };
    var t = svgEl('text', { 'class': 'ap__label', x: lb.dx, y: lb.dy, 'text-anchor': lb.anchor || 'start' }, s);
    t.textContent = a.code;
  });

  /* headline: split words for the masked line reveal */
  (function splitTitle() {
    var lines = el.title.querySelectorAll('.title__in');
    Array.prototype.forEach.call(lines, function (line, li) {
      var words = line.textContent.trim().split(/\s+/);
      line.textContent = '';
      words.forEach(function (w, wi) {
        var s = document.createElement('span');
        s.className = 'w';
        s.setAttribute('aria-hidden', 'true');
        if (li === lines.length - 1 && wi === words.length - 1 && /\.$/.test(w)) {
          s.textContent = w.slice(0, -1);
          var dot = document.createElement('span');
          dot.className = 'dot';
          dot.textContent = '.';
          s.appendChild(dot);
        } else {
          s.textContent = w;
        }
        s.style.transitionDelay = (0.15 + li * 0.14 + wi * 0.06).toFixed(2) + 's';
        line.appendChild(s);
        if (wi < words.length - 1) line.appendChild(document.createTextNode(' '));
      });
    });
  })();

  /* ------------------------------------------------------------------
     Scale: keep markers, labels and lines the same size on screen
     ------------------------------------------------------------------ */
  function measure() {
    var w = el.stage.clientWidth, h = el.stage.clientHeight;
    if (!w || !h) return;
    var scale = Math.min(w / 1000, h / 624);
    k = 1 / scale;
    var lay = layout();
    ms = k * (lay === 'mobile' ? 0.85 : 1);
    root.style.setProperty('--k', k.toFixed(3));
    root.style.setProperty('--ms', ms.toFixed(3));
    el.routeDots.setAttribute('stroke-width', (2.4 * k).toFixed(2));
    el.routeDots.setAttribute('stroke-dasharray', '0 ' + (7 * k).toFixed(2));
    el.routeTrail.setAttribute('stroke-width', (1.7 * k).toFixed(2));
    if (routeGeo) placeLabel(routeGeo);
  }

  /* ------------------------------------------------------------------
     Flight path: nearest airport → region
     ------------------------------------------------------------------ */
  function routeFor(i) {
    var r = regions[i];
    var ap = airports[r.route] || airports[r.transfer[0].code];
    var A = ap.map, R = r.map;
    var dx = R.x - A.x, dy = R.y - A.y;
    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / dist, ny = dx / dist;
    if (ny > 0) { nx = -nx; ny = -ny; }           // always bow "up", inland
    var bulge = Math.max(70, Math.min(150, dist * 0.38));
    var C = { x: (A.x + R.x) / 2 + nx * bulge, y: (A.y + R.y) / 2 + ny * bulge };
    var minutes = 0;
    r.transfer.forEach(function (t) { if (t.code === ap.code) minutes = t.min; });
    return {
      A: A, R: R, C: C, nx: nx, ny: ny, dist: dist, code: ap.code, minutes: minutes,
      d: 'M' + A.x + ' ' + A.y + ' Q' + C.x.toFixed(1) + ' ' + C.y.toFixed(1) + ' ' + R.x + ' ' + R.y
    };
  }

  /* put the time label beside the route, clear of markers and labels */
  function placeLabel(geo) {
    var ax = 0.25 * geo.A.x + 0.5 * geo.C.x + 0.25 * geo.R.x;
    var ay = 0.25 * geo.A.y + 0.5 * geo.C.y + 0.25 * geo.R.y;
    var ctm = el.svg.getScreenCTM ? el.svg.getScreenCTM() : null;
    var wPx = (geo.labelW || 110) * ms / k, hPx = 22 * ms / k;
    var halfU = wPx * k / 2, halfHU = hPx * k / 2;
    var pick = null;
    if (ctm) {
      var obstacles = [];
      Array.prototype.forEach.call(el.svg.querySelectorAll('.mk__dot, .ap__bg, .mk__label, .ap__label'), function (n) {
        if (n.classList.contains('mk__label') && getComputedStyle(n).opacity === '0') return;
        var b = n.getBoundingClientRect();
        if (b.width) obstacles.push(b);
      });
      var stage = el.stage.getBoundingClientRect();
      for (var step = 0; step < 36 && !pick; step++) {
        for (var side = 1; side >= -1 && !pick; side -= 2) {
          var offU = (16 + step * 5) * k + halfHU;
          var x = ax + geo.nx * side * offU, y = ay + geo.ny * side * offU;
          var sx = ctm.a * x + ctm.e, sy = ctm.d * y + ctm.f;
          var L = sx - wPx / 2 - 5, R = sx + wPx / 2 + 5, T = sy - hPx / 2 - 5, B = sy + hPx / 2 + 5;
          if (L < stage.left || R > stage.right || T < stage.top || B > stage.bottom) continue;
          var hit = obstacles.some(function (o) { return !(R < o.left || L > o.right || B < o.top || T > o.bottom); });
          if (!hit) pick = { x: x, y: y };
        }
      }
    }
    if (!pick) {
      var off = 24 * k + halfHU;
      pick = { x: ax + geo.nx * off, y: ay + geo.ny * off };
    }
    pick.x = Math.max(halfU + 4, Math.min(1000 - halfU - 4, pick.x));
    pick.y = Math.max(halfHU + 4, Math.min(624 - halfHU - 4, pick.y));
    el.routeLabel.setAttribute('transform', 'translate(' + pick.x.toFixed(1) + ' ' + pick.y.toFixed(1) + ')');
  }

  function setLabel(geo, minutes) {
    var code = el.routeLabel.querySelector('.rl-code');
    var time = el.routeLabel.querySelector('.rl-time');
    var text = el.routeLabel.querySelector('text');
    var rect = el.routeLabel.querySelector('rect');
    code.textContent = geo.code;
    // size the pill for the final value so it does not jump while counting
    time.textContent = '~' + fmtMin(geo.minutes);
    var w = 110;
    try { w = text.getComputedTextLength() + 22; } catch (e) {}
    geo.labelW = w;
    rect.setAttribute('width', w.toFixed(1));
    rect.setAttribute('x', (-w / 2).toFixed(1));
    rect.setAttribute('y', -11);
    text.setAttribute('x', (-w / 2 + 11).toFixed(1));
    text.setAttribute('y', 4.2);
    time.textContent = '~' + fmtMin(minutes);
  }

  function flyTo(i, instant) {
    if (flight) { flight.cancel(); flight = null; }
    var geo = routeFor(i);
    routeGeo = geo;
    el.routeDots.setAttribute('d', geo.d);
    el.routeTrail.setAttribute('d', geo.d);
    var L = el.routeTrail.getTotalLength ? el.routeTrail.getTotalLength() : geo.dist;
    el.routeTrail.setAttribute('stroke-dasharray', L.toFixed(1) + ' ' + (L + 10).toFixed(1));
    setLabel(geo, instant || reduced ? geo.minutes : 0);
    placeLabel(geo);
    el.routeLabel.classList.add('is-on');

    if (instant || reduced) {
      el.routeTrail.setAttribute('stroke-dashoffset', 0);
      el.routeDots.style.opacity = 1;
      el.plane.style.opacity = 0;
      return;
    }

    el.routeTrail.setAttribute('stroke-dashoffset', L.toFixed(1));
    run(el.routeDots, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: M.css.power3Out, fill: 'forwards' });
    var timeEl = el.routeLabel.querySelector('.rl-time');
    var marker = markerEls[i];
    var dur = Math.min(2300, 1400 + geo.dist * 2.6);

    flight = M.tween({
      duration: dur,
      delay: 180,
      ease: M.ease.power2InOut,
      update: function (p, raw) {
        var l = L * p;
        var pt = el.routeTrail.getPointAtLength(l);
        var ahead = el.routeTrail.getPointAtLength(Math.min(L, l + 1));
        var behind = el.routeTrail.getPointAtLength(Math.max(0, l - 1));
        var ang = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
        el.plane.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')');
        el.plane.style.opacity = raw < 0.08 ? raw / 0.08 : raw > 0.9 ? Math.max(0, (1 - raw) / 0.1) : 1;
        el.routeTrail.setAttribute('stroke-dashoffset', (L - l).toFixed(1));
        timeEl.textContent = '~' + fmtMin(geo.minutes * M.ease.power3Out(raw));
      },
      complete: function () {
        el.plane.style.opacity = 0;
        timeEl.textContent = '~' + fmtMin(geo.minutes);
        marker.classList.remove('st-ping');
        void marker.getBoundingClientRect();
        marker.classList.add('st-ping');
        setTimeout(function () { marker.classList.remove('st-ping'); }, 950);
        flight = null;
      }
    });
  }

  /* ------------------------------------------------------------------
     Feature panel
     ------------------------------------------------------------------ */
  function fillText(r, i) {
    el.idx.textContent = pad(i + 1);
    el.coords.textContent = r.coords || '';
    el.name.textContent = r.name;
    el.line.textContent = r.tagline;

    el.transfer.textContent = '';
    r.transfer.forEach(function (t) {
      var s = document.createElement('span');
      s.className = 'tr' + (t.code === r.route ? ' tr--main' : '');
      var b = document.createElement('b');
      b.textContent = t.code;
      s.appendChild(b);
      s.appendChild(document.createTextNode('~' + fmtMin(t.min)));
      el.transfer.appendChild(s);
    });
    el.stay.textContent = r.stay;
    el.exp.textContent = '';
    r.experiences.forEach(function (x) {
      var li = document.createElement('li');
      li.textContent = x;
      el.exp.appendChild(li);
    });
    el.ideal.textContent = '';
    r.idealFor.forEach(function (x, n) {
      if (n) {
        var dot = document.createElement('i');
        dot.setAttribute('aria-hidden', 'true');
        dot.textContent = ' · ';
        el.ideal.appendChild(dot);
      }
      el.ideal.appendChild(document.createTextNode(x));
    });
  }

  function tone(node, r) {
    var t = r.tone || [];
    ['--t1', '--t2', '--t3', '--t4'].forEach(function (v, n) { if (t[n]) node.style.setProperty(v, t[n]); });
  }

  /* postcard photo: image over a styled card, so a missing or failed photo never looks empty */
  function makePhoto(p, r) {
    var wrap = document.createElement('div');
    wrap.className = 'ph';
    tone(wrap, r);
    var fb = document.createElement('div');
    fb.className = 'ph__fb';
    fb.setAttribute('aria-hidden', 'true');
    var b = document.createElement('b');
    b.textContent = r.short || r.name;
    var sm = document.createElement('small');
    sm.textContent = T.island || 'Kipar';
    fb.appendChild(sm);
    fb.appendChild(b);
    wrap.appendChild(fb);
    if (p && p.src) {
      var img = new Image();
      img.decoding = 'async';
      img.alt = p.caption || '';
      img.onload = function () { wrap.classList.add('is-loaded'); };
      img.onerror = function () { wrap.classList.add('is-failed'); img.remove(); };
      img.src = p.src;
      wrap.appendChild(img);
    }
    return wrap;
  }

  /* cover card: the region's own warm tone, name and coordinates */
  function makeCover(r, i) {
    var cv = document.createElement('div');
    cv.className = 'cv';
    tone(cv, r);
    var top = document.createElement('span');
    top.className = 'cv__kicker';
    top.textContent = (T.coverKicker || 'Region') + ' ' + pad(i + 1);
    var name = document.createElement('b');
    name.className = 'cv__name';
    name.textContent = r.name;
    var co = document.createElement('small');
    co.className = 'cv__coords';
    co.textContent = r.coords || T.island || 'Kipar';
    cv.appendChild(top);
    cv.appendChild(name);
    cv.appendChild(co);
    return cv;
  }

  function setCover(r, i, instant) {
    var layer = makeCover(r, i);
    el.cover.appendChild(layer);
    var olds = Array.prototype.slice.call(el.cover.children, 0, -1);
    olds.forEach(function (o) { o.classList.remove('is-current'); });
    layer.classList.add('is-current');
    function cleanup() { olds.forEach(function (o) { if (o.parentNode) o.parentNode.removeChild(o); }); }
    if (instant || reduced) { cleanup(); return; }
    var a = M.animate(layer, [
      { clipPath: 'inset(0 0 0 100%)' },
      { clipPath: 'inset(0 0 0 0%)' }
    ], { duration: 1150, easing: M.css.expoOut, fill: 'both' });
    if (a) a.onfinish = function () { cleanup(); a.cancel(); };
    else cleanup();
  }

  function setPostcard(card, p, r) {
    card.textContent = '';
    card.appendChild(makePhoto(p, r));
    var cap = document.createElement('figcaption');
    cap.className = 'postcard__cap';
    cap.textContent = (p && p.caption) || r.name;
    card.appendChild(cap);
  }

  function setPostcards(r, i, instant, enterOnly) {
    var aA = ANGLES_A[i % ANGLES_A.length], aB = ANGLES_B[i % ANGLES_B.length];
    if (instant || reduced) {
      setPostcard(el.pcA, r.photos[0], r);
      setPostcard(el.pcB, r.photos[1], r);
      el.pcA.style.transform = 'rotate(' + aA + 'deg)';
      el.pcB.style.transform = 'rotate(' + aB + 'deg)';
      return;
    }
    [[el.pcA, r.photos[0], aA, 1], [el.pcB, r.photos[1], aB, -1]].forEach(function (c, n) {
      var card = c[0], from = card.style.transform || 'rotate(0deg)';
      if (enterOnly) {
        setPostcard(card, c[1], r);
        card.style.transform = 'rotate(' + c[2] + 'deg)';
        run(card, [
          { transform: 'translate(' + (c[3] * 30) + 'px, 34px) rotate(' + (c[2] + c[3] * 14) + 'deg)', opacity: 0 },
          { transform: 'rotate(' + c[2] + 'deg)', opacity: 1 }
        ], { duration: 1300, delay: 350 + n * 160, easing: M.css.expoOut, fill: 'both' });
        return;
      }
      run(card, [
        { transform: from, opacity: 1 },
        { transform: 'translate(' + (c[3] * 18) + 'px, 22px) rotate(' + (c[2] + c[3] * 10) + 'deg)', opacity: 0 }
      ], { duration: 320, delay: n * 40, easing: M.css.power3In, fill: 'forwards' });
      setTimeout(function () {
        setPostcard(card, c[1], r);
        card.style.transform = 'rotate(' + c[2] + 'deg)';
        run(card, [
          { transform: 'translate(' + (-c[3] * 26) + 'px, -18px) rotate(' + (c[2] - c[3] * 12) + 'deg)', opacity: 0 },
          { transform: 'rotate(' + c[2] + 'deg)', opacity: 1 }
        ], { duration: 1000, delay: 120 + n * 110, easing: M.css.expoOut, fill: 'both' });
      }, 360 + n * 40);
    });
  }

  function swapPanel(i, instant) {
    var r = regions[i];
    var my = seq;
    if (instant || reduced) {
      fillText(r, i);
      el.bignum.textContent = pad(i + 1);
      setCover(r, i, true);
      setPostcards(r, i, true);
      return;
    }
    swapEls.forEach(function (node, n) {
      run(node, [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: 'translateX(-14px)' }
      ], { duration: 260, delay: n * 22, easing: M.css.power3In, fill: 'forwards' });
    });
    run(el.bignum, [
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'translateX(-36px) rotateY(28deg)' }
    ], { duration: 380, easing: M.css.power3In, fill: 'forwards' });

    setCover(r, i, false);
    setPostcards(r, i, false);

    setTimeout(function () {
      if (my !== seq) return;
      fillText(r, i);
      el.bignum.textContent = pad(i + 1);
      swapEls.forEach(function (node, n) {
        run(node, [
          { opacity: 0, transform: 'translateX(22px)' },
          { opacity: 1, transform: 'none' }
        ], { duration: 800, delay: n * 55, easing: M.css.expoOut, fill: 'both' });
      });
      run(el.bignum, [
        { opacity: 0, transform: 'translateX(48px) rotateY(-32deg)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 1100, delay: 40, easing: M.css.expoOut, fill: 'both' });
    }, 330);
  }

  /* ------------------------------------------------------------------
     Selection
     ------------------------------------------------------------------ */
  function updateNav(i) {
    tabEls.forEach(function (b, n) {
      var on = n === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    markerEls.forEach(function (m, n) { m.classList.toggle('is-active', n === i); });
    el.panel.setAttribute('aria-labelledby', 'rg-' + i);
  }

  function select(i, opts) {
    opts = opts || {};
    if (i === current && !opts.force) return;
    current = i;
    seq++;
    updateNav(i);
    swapPanel(i, opts.instant);
    if (mapReady || opts.instant) flyTo(i, opts.instant);
    if (auto.on) restartTimerBar();
  }

  function userSelect(i) {
    stopAuto();
    select(i);
  }

  /* hint under the tabs: invite to click, then to compare */
  var hintSwapped = false;
  var HINT_AFTER = T.hintAfter || 'Kliknite drugi region za poređenje';
  function swapHint() {
    if (hintSwapped || !el.hintText) return;
    hintSwapped = true;
    el.hint.classList.add('is-used');
    if (reduced) { el.hintText.textContent = HINT_AFTER; return; }
    var out = M.animate(el.hintText, [
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'translateY(-4px)' }
    ], { duration: 260, easing: M.css.power3In, fill: 'forwards' });
    setTimeout(function () {
      el.hintText.textContent = HINT_AFTER;
      if (out) out.cancel();
      M.animate(el.hintText, [
        { opacity: 0, transform: 'translateY(5px)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 700, easing: M.css.expoOut });
    }, 280);
  }

  /* ------------------------------------------------------------------
     Auto-advance until the first interaction
     ------------------------------------------------------------------ */
  function restartTimerBar() {
    el.regions.style.setProperty('--dur', AUTO_MS + 'ms');
    el.regions.classList.remove('is-timing');
    void el.regions.offsetWidth;
    if (auto.on && mapReady && auto.inView && !document.hidden) el.regions.classList.add('is-timing');
  }
  function scheduleAuto() {
    clearTimeout(auto.timer);
    if (!auto.on || reduced || !mapReady || !auto.inView || document.hidden) {
      el.regions.classList.remove('is-timing');
      return;
    }
    restartTimerBar();
    auto.timer = setTimeout(function () {
      if (!auto.on) return;
      select((current + 1) % regions.length);
      scheduleAuto();
    }, AUTO_MS);
  }
  function stopAuto() {
    if (!auto.on) return;
    auto.on = false;
    clearTimeout(auto.timer);
    el.regions.classList.remove('is-timing');
    el.panel.setAttribute('aria-live', 'polite');
  }

  /* ------------------------------------------------------------------
     Events
     ------------------------------------------------------------------ */
  function isMouse(e) { return !e.pointerType || e.pointerType === 'mouse'; }

  function bindHoverSelect(node, i) {
    node.addEventListener('pointerenter', function (e) {
      if (!isMouse(e) || !mapReady) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { userSelect(i); }, 110);
    });
    node.addEventListener('pointerleave', function () { clearTimeout(hoverTimer); });
    node.addEventListener('click', function () { clearTimeout(hoverTimer); userSelect(i); swapHint(); });
  }
  markerEls.forEach(function (m, i) { bindHoverSelect(m, i); });
  tabEls.forEach(function (b, i) { bindHoverSelect(b, i); });

  el.regions.addEventListener('keydown', function (e) {
    var n = current, last = regions.length - 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = current >= last ? 0 : current + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = current <= 0 ? last : current - 1;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = last;
    else return;
    e.preventDefault();
    userSelect(n);
    swapHint();
    tabEls[n].focus();
  });

  el.wwe.addEventListener('pointerdown', stopAuto, { passive: true });
  el.wwe.addEventListener('keydown', function (e) { if (e.key === 'Tab') stopAuto(); });

  document.addEventListener('visibilitychange', scheduleAuto);

  if (reducedMQ && reducedMQ.addEventListener) {
    reducedMQ.addEventListener('change', function (e) {
      reduced = e.matches;
      root.classList.toggle('reduced-motion', reduced);
      if (reduced) { stopAuto(); showAllFinal(); }
    });
  }

  var resizeRaf = 0;
  function onResize() {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(measure);
  }
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(el.stage);
  else window.addEventListener('resize', onResize);

  /* ------------------------------------------------------------------
     Entrance sequences
     ------------------------------------------------------------------ */
  function revealHead() {
    var eyebrow = el.head.querySelector('.eyebrow');
    var intro = el.head.querySelector('.head__intro');
    eyebrow.classList.add('is-in');
    setTimeout(function () { el.title.classList.add('is-in'); }, 120);
    setTimeout(function () { intro.classList.add('is-in'); }, 520);
  }

  function revealPanel() {
    if (el.panel.classList.contains('is-in')) return;
    el.panel.classList.add('is-in');
    if (reduced) return;
    var r = regions[current];
    setCover(r, current, false);
    setPostcards(r, current, false, true);
    swapEls.forEach(function (node, n) {
      run(node, [
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 900, delay: 120 + n * 60, easing: M.css.expoOut, fill: 'both' });
    });
    run(el.bignum, [
      { opacity: 0, transform: 'translateX(48px) rotateY(-32deg)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 1300, delay: 200, easing: M.css.expoOut, fill: 'both' });
  }

  function startMap() {
    if (mapStarted) return;
    mapStarted = true;
    measure();
    var mc = el.map.classList;
    if (reduced) { showAllFinal(); return; }
    requestAnimationFrame(function () { mc.add('st-line'); });
    setTimeout(function () { mc.add('st-sea'); }, 1500);
    setTimeout(function () { mc.add('st-markers'); }, 2050);
    setTimeout(function () { mc.add('st-airports'); }, 2900);
    setTimeout(function () {
      mc.add('st-done');
      mapReady = true;
      flyTo(current, false);
      setTimeout(scheduleAuto, 900);
      preloadAll();
    }, 3350);
  }

  function countUp(node) {
    var to = parseFloat(node.getAttribute('data-to'));
    var from = parseFloat(node.getAttribute('data-from') || '0');
    var suffix = node.getAttribute('data-suffix') || '';
    if (reduced) { node.textContent = to + suffix; return; }
    M.tween({
      duration: 1800,
      ease: M.ease.expoOut,
      update: function (p) { node.textContent = Math.round(from + (to - from) * p) + (p === 1 ? suffix : ''); },
      complete: function () { node.textContent = to + suffix; }
    });
  }

  function revealFoot() {
    var trust = el.foot.querySelector('.trust');
    var cta = el.foot.querySelector('.btn');
    trust.classList.add('is-in');
    setTimeout(function () { cta.classList.add('is-in'); }, 180);
    Array.prototype.forEach.call(el.foot.querySelectorAll('.count'), function (n, i) {
      setTimeout(function () { countUp(n); }, 200 + i * 160);
    });
  }

  function showAllFinal() {
    ['.eyebrow', '.head__intro', '.trust', '.btn'].forEach(function (s) {
      var n = document.querySelector(s);
      if (n) n.classList.add('is-in');
    });
    el.title.classList.add('is-in');
    el.panel.classList.add('is-in');
    el.map.classList.add('st-line', 'st-sea', 'st-markers', 'st-airports', 'st-done');
    mapReady = true;
    mapStarted = true;
    measure();
    if (current >= 0) flyTo(current, true);
    Array.prototype.forEach.call(el.foot.querySelectorAll('.count'), function (n) {
      n.textContent = n.getAttribute('data-to') + (n.getAttribute('data-suffix') || '');
    });
  }

  var preloaded = false;
  function preloadAll() {
    if (preloaded) return;
    preloaded = true;
    regions.forEach(function (r, ri) {
      if (ri === current) return;
      r.photos.forEach(function (p, pi) {
        if (!p.src) return;
        setTimeout(function () { var im = new Image(); im.decoding = 'async'; im.src = p.src; }, 400 + ri * 250 + pi * 80);
      });
    });
  }

  function observe(node, threshold, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.disconnect(); fn(); }
      });
    }, { threshold: threshold });
    io.observe(node);
  }

  /* ------------------------------------------------------------------
     CTA: always leave the iframe (target="_top" in the markup)
     ------------------------------------------------------------------ */
  /* (the button text and href are set by js/i18n.js) */

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  el.panel.setAttribute('role', 'tabpanel');
  el.panel.setAttribute('aria-live', 'off');
  current = defaultIndex;
  updateNav(current);
  fillText(regions[current], current);
  el.bignum.textContent = pad(current + 1);
  setCover(regions[current], current, true);
  setPostcards(regions[current], current, true);
  measure();

  if (reduced) {
    showAllFinal();
    stopAuto();
    el.panel.setAttribute('aria-live', 'polite');
    return;
  }

  /* start the count-ups from their first value */
  Array.prototype.forEach.call(el.foot.querySelectorAll('.count'), function (n) {
    n.textContent = n.getAttribute('data-from') || '0';
  });

  observe(el.head, 0.2, revealHead);
  observe(el.map, 0.3, startMap);
  observe(el.panel, 0.2, function () { setTimeout(revealPanel, layout() === 'mobile' ? 150 : 700); });
  observe(el.foot, 0.5, revealFoot);

  /* pause auto-advance while the map is off screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      auto.inView = entries[0].isIntersecting;
      if (auto.on) scheduleAuto();
    }, { threshold: 0.15 }).observe(el.map);
  }
})();
