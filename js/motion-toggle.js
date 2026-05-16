/* Animations on/off toggle — persists to localStorage, reloads to reset all effects */
(function () {
  'use strict';

  var KEY = 'proslides-overview-animations';
  var btn;
  var labelEl;
  var statusEl;

  function i18n(key, fallback) {
    return window.ProSlidesI18n ? window.ProSlidesI18n.t(key, fallback) : fallback;
  }

  function storedOn() {
    try {
      var s = localStorage.getItem(KEY);
      if (s === 'off') return false;
      if (s === 'on') return true;
    } catch (_) {}
    return true;
  }

  function motionReduced() {
    return (
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      document.documentElement.classList.contains('animations-off')
    );
  }

  window.ProSlidesMotion = {
    reduced: motionReduced,
    isOn: function () { return !document.documentElement.classList.contains('animations-off'); }
  };

  function syncToggleUI(on) {
    if (!btn) return;
    btn.setAttribute('aria-checked', on ? 'true' : 'false');
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-label', i18n(on ? 'motion.ariaOff' : 'motion.ariaOn'));
    if (statusEl) statusEl.textContent = i18n(on ? 'motion.on' : 'motion.off');
    if (labelEl) labelEl.textContent = i18n(on ? 'motion.onDetail' : 'motion.offDetail');
  }

  function init() {
    btn = document.getElementById('animations-toggle');
    labelEl = document.getElementById('animations-toggle-label');
    statusEl = document.getElementById('animations-toggle-status');
    syncToggleUI(storedOn());
    if (!btn) return;

    btn.addEventListener('click', function () {
      var nextOn = document.documentElement.classList.contains('animations-off');
      try {
        localStorage.setItem(KEY, nextOn ? 'on' : 'off');
      } catch (_) {}
      location.reload();
    });

    document.addEventListener('proslides:locale', function () {
      syncToggleUI(storedOn());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
