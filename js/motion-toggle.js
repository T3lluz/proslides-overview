/* Animations on/off toggle — persists to localStorage, reloads to reset all effects */
(function () {
  'use strict';

  var KEY = 'proslides-overview-animations';
  var btn;
  var labelEl;
  var statusEl;

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
    var status = on ? 'På' : 'Av';
    var detail = on ? 'Animasjoner på' : 'Animasjoner av';
    btn.setAttribute('aria-checked', on ? 'true' : 'false');
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-label', on ? 'Slå av animasjoner' : 'Slå på animasjoner');
    if (statusEl) statusEl.textContent = status;
    if (labelEl) labelEl.textContent = detail;
  }

  document.addEventListener('DOMContentLoaded', function () {
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
  });
})();
