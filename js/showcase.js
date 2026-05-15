/* -----------------------------------------------------------------------
   ProSlides – Screenshot Showcase
   Single full-width slide carousel.
   Per-item circle-reveal animation for the image theme toggle,
   originating from the position of the theme icon inside each screenshot
   (≈89% from left, 2% from top — the settings/theme button in the app nav).
   Matches the site's own view-transition theme animation direction.
   ----------------------------------------------------------------------- */
(function () {
  var LABELS = ['Dashboard', 'Editor', 'Live-presentasjon'];
  /* Position of the theme icon inside each screenshot (1024×556 px).
     Expressed as percentage of the image so it scales with the element. */
  var ORIGIN_X = '89%';
  var ORIGIN_Y = '2%';

  var current    = 0;
  var darkImages = false;
  var autoTimer  = null;
  var runningAnims = []; // per-item Web Animation refs

  /* ---- element refs ---- */
  var viewport = document.getElementById('showcase-wrap');
  var track    = document.getElementById('sc-track');
  var items    = track ? Array.from(track.querySelectorAll('.sc-item')) : [];
  var darkImgs = track ? Array.from(track.querySelectorAll('.sc-dark')) : [];
  var tabs     = Array.from(document.querySelectorAll('.showcase-tab'));
  var dots     = Array.from(document.querySelectorAll('.sc-dot'));
  var label    = document.getElementById('showcase-label');
  var prevBtn  = document.getElementById('showcase-prev');
  var nextBtn  = document.getElementById('showcase-next');
  var toggle   = document.getElementById('showcase-theme-toggle');
  var lblLight = document.getElementById('showcase-label-light');
  var lblDark  = document.getElementById('showcase-label-dark');

  if (!viewport || !track || !items.length) return;

  /* ---- slide navigation ---- */
  function setSlide(idx) {
    current = ((idx % LABELS.length) + LABELS.length) % LABELS.length;

    // Slide the track
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    // Update tabs
    tabs.forEach(function (t, i) {
      t.classList.toggle('showcase-tab--active', i === current);
    });

    // Update dots
    dots.forEach(function (d, i) {
      var active = i === current;
      d.style.background = active ? 'var(--primary)' : 'var(--border)';
      d.style.width      = active ? '1.5rem' : '';
      d.style.height     = active ? '0.375rem' : '';
      d.style.borderRadius = active ? '999px' : '';
    });

    if (label) label.textContent = LABELS[current];

    resetAuto();
  }

  /* ---- auto-play ---- */
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      setSlide((current + 1) % LABELS.length);
    }, 5000);
  }

  /* ---- commit theme instantly (no animation — used on first load) ---- */
  function commitTheme(dark) {
    darkImages = dark;
    var endClip = dark
      ? 'circle(150% at ' + ORIGIN_X + ' ' + ORIGIN_Y + ')'
      : 'circle(0% at '   + ORIGIN_X + ' ' + ORIGIN_Y + ')';

    darkImgs.forEach(function (img) {
      img.style.clipPath = endClip;
    });

    syncToggleUI(dark);
  }

  /* ---- per-item circle-reveal animation ---- */
  function animateTheme(dark) {
    // Cancel any still-running animations
    runningAnims.forEach(function (a) { try { a.cancel(); } catch (_) {} });
    runningAnims = [];

    // Commit mid-animation state before reversing
    darkImgs.forEach(function (img) {
      var computed = getComputedStyle(img).clipPath;
      img.style.clipPath = computed || (darkImages
        ? 'circle(150% at ' + ORIGIN_X + ' ' + ORIGIN_Y + ')'
        : 'circle(0% at '   + ORIGIN_X + ' ' + ORIGIN_Y + ')');
    });

    darkImages = dark;
    syncToggleUI(dark);

    var from = dark
      ? 'circle(0% at '   + ORIGIN_X + ' ' + ORIGIN_Y + ')'
      : 'circle(150% at ' + ORIGIN_X + ' ' + ORIGIN_Y + ')';
    var to = dark
      ? 'circle(150% at ' + ORIGIN_X + ' ' + ORIGIN_Y + ')'
      : 'circle(0% at '   + ORIGIN_X + ' ' + ORIGIN_Y + ')';

    var dur    = dark ? 540 : 420;
    var easing = dark
      ? 'cubic-bezier(0.33, 0.86, 0.2, 1)'  // expanding: matches site "going dark"
      : 'cubic-bezier(0.4, 0, 0.75, 1)';    // contracting: matches site "going light"

    darkImgs.forEach(function (img) {
      img.style.clipPath = from;

      var anim = img.animate(
        [{ clipPath: from }, { clipPath: to }],
        { duration: dur, easing: easing, fill: 'forwards' }
      );

      anim.onfinish = function () {
        img.style.clipPath = to;
      };

      runningAnims.push(anim);
    });
  }

  /* ---- keep the toggle pill + labels in sync ---- */
  function syncToggleUI(dark) {
    if (!toggle) return;
    toggle.setAttribute('aria-checked', dark ? 'true' : 'false');
    toggle.classList.toggle('showcase-toggle--on', dark);
    if (lblLight) lblLight.classList.toggle('showcase-lbl--active', !dark);
    if (lblDark)  lblDark.classList.toggle('showcase-lbl--active',  dark);
  }

  /* ---- initialise ---- */
  // Each slide fills 100% of viewport — enforce this
  items.forEach(function (item) {
    item.style.width = '100%';
  });

  setSlide(0);

  // Sync image theme to site theme on load (instant, no animation)
  darkImages = document.documentElement.classList.contains('dark');
  commitTheme(darkImages);
  resetAuto();

  /* ---- events ---- */
  prevBtn && prevBtn.addEventListener('click', function () { setSlide(current - 1); });
  nextBtn && nextBtn.addEventListener('click', function () { setSlide(current + 1); });

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { setSlide(i); });
  });

  dots.forEach(function (d, i) {
    d.style.cursor = 'pointer';
    d.addEventListener('click', function () { setSlide(i); });
  });

  toggle && toggle.addEventListener('click', function () {
    animateTheme(!darkImages);
  });

  /* ---- sync with site theme toggle ---- */
  new MutationObserver(function () {
    var siteDark = document.documentElement.classList.contains('dark');
    if (siteDark !== darkImages) animateTheme(siteDark);
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  /* ---- keyboard ---- */
  viewport.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { setSlide(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setSlide(current + 1); e.preventDefault(); }
  });

  /* ---- touch swipe ---- */
  var touchX = null;
  viewport.addEventListener('touchstart', function (e) {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 40) return;
    setSlide(dx < 0 ? current + 1 : current - 1);
  });
})();
