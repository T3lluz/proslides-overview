/* Theme toggle with view-transition circle animation */
(function () {
  var btn = document.getElementById('theme-toggle');
  var k   = 'proslides-overview-theme';
  if (!btn) return;

  function clearVars() {
    var r = document.documentElement;
    ['--theme-vt-new-name','--theme-vt-old-name','--theme-vt-dur','--theme-vt-new-z','--theme-vt-old-z','--theme-orig-x','--theme-orig-y'].forEach(function (p) {
      r.style.removeProperty(p);
    });
  }

  function setAria() {
    var dark = document.documentElement.classList.contains('dark');
    btn.setAttribute('aria-label', dark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema');
  }
  setAria();

  btn.addEventListener('click', function () {
    var root      = document.documentElement;
    var isDark    = root.classList.contains('dark');
    var nextDark  = !isDark;
    var nextTheme = nextDark ? 'dark' : 'light';

    var rect = btn.getBoundingClientRect();
    root.style.setProperty('--theme-orig-x', ((rect.left + rect.right) / 2 / window.innerWidth  * 100) + '%');
    root.style.setProperty('--theme-orig-y', ((rect.top  + rect.bottom) / 2 / window.innerHeight * 100) + '%');
    root.style.setProperty('--theme-vt-dur', '0.52s');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var startVt      = document.startViewTransition && document.startViewTransition.bind(document);

    function apply() {
      root.classList.toggle('dark', nextDark);
      try { localStorage.setItem(k, nextTheme); } catch (_) {}
      setAria();
    }

    if (reduceMotion || !startVt) { apply(); clearVars(); return; }

    if (nextTheme === 'light') {
      root.style.setProperty('--theme-vt-new-name', 'theme-vt-expand');
      root.style.setProperty('--theme-vt-new-z', '2');
      root.style.setProperty('--theme-vt-old-z', '1');
    } else {
      root.style.setProperty('--theme-vt-old-name', 'theme-vt-implode');
      root.style.setProperty('--theme-vt-old-z', '2');
      root.style.setProperty('--theme-vt-new-z', '1');
    }

    try {
      var transition = startVt(apply);
      void (transition.finished || Promise.resolve()).finally(clearVars);
    } catch (_) {
      clearVars();
      apply();
    }
  });
})();
