/* =====================================================================
   Tiny motion helpers (no dependencies).
   Easing curves follow GSAP's power3 / expo so the motion feels the same
   as a GSAP timeline, without loading a library into the Wix iframe.
   ===================================================================== */
(function () {
  'use strict';

  var ease = {
    linear: function (t) { return t; },
    power2InOut: function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
    power3Out: function (t) { return 1 - Math.pow(1 - t, 3); },
    power3InOut: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    expoOut: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  };

  /* CSS equivalents, for the Web Animations API */
  var css = {
    expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    power3Out: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    power3In: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)'
  };

  /* requestAnimationFrame tween; returns { cancel } */
  function tween(opts) {
    var dur = opts.duration || 1000;
    var fn = opts.ease || ease.power3Out;
    var start = null;
    var raf = 0;
    var done = false;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / dur);
      opts.update(fn(t), t);
      if (t < 1) raf = requestAnimationFrame(frame);
      else { done = true; if (opts.complete) opts.complete(); }
    }
    if (opts.delay) {
      var to = setTimeout(function () { raf = requestAnimationFrame(frame); }, opts.delay);
      return { cancel: function () { clearTimeout(to); cancelAnimationFrame(raf); } };
    }
    raf = requestAnimationFrame(frame);
    return { cancel: function () { if (!done) cancelAnimationFrame(raf); } };
  }

  /* Element.animate with a safe fallback: jump to the final frame */
  function animate(el, frames, options) {
    if (!el) return null;
    if (el.animate) {
      var a = el.animate(frames, options);
      return a;
    }
    var last = frames[frames.length - 1];
    for (var k in last) if (k !== 'offset') el.style[k] = last[k];
    return null;
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  window.WWEMotion = { ease: ease, css: css, tween: tween, animate: animate, wait: wait };
})();
