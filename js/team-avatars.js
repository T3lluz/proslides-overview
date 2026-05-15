/**
 * Default avatar is GitHub (img src). If assets/team/<file> exists, swap to that photo.
 */
(function () {
  'use strict';

  function init() {
    document.querySelectorAll('.team-card__photo[data-photo]').forEach(function (img) {
      var local = img.getAttribute('data-photo');
      if (!local) return;

      img.classList.add('is-fallback');

      var probe = new Image();
      probe.onload = function () {
        img.src = local;
        img.classList.add('is-custom');
        img.classList.remove('is-fallback');
      };
      probe.onerror = function () {
        img.classList.add('is-fallback');
        img.classList.remove('is-custom');
      };
      probe.src = local;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
