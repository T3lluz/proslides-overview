/* -----------------------------------------------------------------------
   ProSlides – Screenshot Showcase
   Stacked-cell carousel: all slides share the same grid cell and transition
   via opacity + scale + blur crossfade (no translateX). CSS transitions are
   enabled only after first render to prevent an entrance animation on load.

   The Lyst/Mørkt toggle inside the showcase proxies to the site's
   #theme-toggle button so both controls stay in sync. The per-image dark/
   light stack is revealed with a circle clip-path animation that originates
   from whichever toggle was clicked — matching the page view-transition style.
   ----------------------------------------------------------------------- */
(function () {
  var LABELS        = ['Dashboard', 'Editor', 'Live-presentasjon'];
  var AUTO_INTERVAL = 9000;  /* ms between auto-advances */
  var TRANS_DUR     = 750;   /* ms — keep ≥ longest CSS transition */

  /* Default clip-path origin when no button rect is available */
  var ORIGIN_X = '89%';
  var ORIGIN_Y = '2%';

  var current      = 0;
  var darkImages   = false;
  var autoTimer    = null;
  var runningAnims = [];

  /* ---- element refs ---- */
  var viewport     = document.getElementById('showcase-wrap');
  var track        = document.getElementById('sc-track');
  var items        = track ? Array.from(track.querySelectorAll('.sc-item'))   : [];
  var darkImgs     = track ? Array.from(track.querySelectorAll('.sc-dark'))   : [];
  var tabs         = Array.from(document.querySelectorAll('.showcase-tab'));
  var dots         = Array.from(document.querySelectorAll('.sc-dot'));
  var label        = document.getElementById('showcase-label');
  var prevBtn      = document.getElementById('showcase-prev');
  var nextBtn      = document.getElementById('showcase-next');
  var toggle       = document.getElementById('showcase-theme-toggle');
  var lblLight     = document.getElementById('showcase-label-light');
  var lblDark      = document.getElementById('showcase-label-dark');
  var siteToggle   = document.getElementById('theme-toggle');

  if (!viewport || !track || !items.length) return;

  /* ---- progress bar ---- */
  var progressTrack = document.createElement('div');
  progressTrack.className = 'sc-progress-track';
  var progressBar = document.createElement('div');
  progressBar.className = 'sc-progress';
  progressTrack.appendChild(progressBar);
  viewport.appendChild(progressTrack);

  function startProgress() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    void progressBar.offsetWidth;
    progressBar.style.transition = 'width ' + AUTO_INTERVAL + 'ms linear';
    progressBar.style.width = '100%';
  }
  function resetProgress() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
  }

  /* ---- slide transition ---- */
  var zCleanTimer = null;

  function setSlide(idx) {
    var nextIdx = ((idx % LABELS.length) + LABELS.length) % LABELS.length;
    if (nextIdx === current) return;

    var prevIdx = current;
    current = nextIdx;

    items[prevIdx].style.zIndex = '1';
    items[current].style.zIndex = '3';

    items[prevIdx].classList.remove('is-active');
    items[current].classList.add('is-active');

    clearTimeout(zCleanTimer);
    zCleanTimer = setTimeout(function () {
      items.forEach(function (item) { item.style.zIndex = ''; });
    }, TRANS_DUR + 50);

    tabs.forEach(function (t, i) {
      t.classList.toggle('showcase-tab--active', i === current);
    });

    dots.forEach(function (d, i) {
      var on = i === current;
      d.style.background   = on ? 'var(--primary)' : 'var(--border)';
      d.style.width        = on ? '1.5rem' : '';
      d.style.height       = on ? '0.375rem' : '';
      d.style.borderRadius = on ? '999px' : '';
    });

    if (label) label.textContent = LABELS[current];

    resetAuto();
  }

  /* ---- auto-play ---- */
  function resetAuto() {
    clearInterval(autoTimer);
    resetProgress();
    startProgress();
    autoTimer = setInterval(function () {
      setSlide((current + 1) % LABELS.length);
    }, AUTO_INTERVAL);
  }

  /* ---- theme: instant commit (no animation, used on first load) ---- */
  function commitTheme(dark) {
    darkImages = dark;
    var clip = dark
      ? 'circle(300% at ' + ORIGIN_X + ' ' + ORIGIN_Y + ')'
      : 'circle(0% at '   + ORIGIN_X + ' ' + ORIGIN_Y + ')';
    darkImgs.forEach(function (img) { img.style.clipPath = clip; });
    syncToggleUI(dark);
  }

  /* ---- theme: animated circle reveal ---- */
  function animateTheme(dark, ox, oy) {
    ox = (ox !== undefined) ? ox : ORIGIN_X;
    oy = (oy !== undefined) ? oy : ORIGIN_Y;

    runningAnims.forEach(function (a) { try { a.cancel(); } catch (_) {} });
    runningAnims = [];

    /* Snapshot mid-animation state so a reverse doesn't jump */
    darkImgs.forEach(function (img) {
      var cur = getComputedStyle(img).clipPath;
      img.style.clipPath = cur || (darkImages
        ? 'circle(300% at ' + ox + ' ' + oy + ')'
        : 'circle(0% at '   + ox + ' ' + oy + ')');
    });

    darkImages = dark;
    syncToggleUI(dark);

    var from = dark
      ? 'circle(0% at '   + ox + ' ' + oy + ')'
      : 'circle(300% at ' + ox + ' ' + oy + ')';
    var to = dark
      ? 'circle(300% at ' + ox + ' ' + oy + ')'
      : 'circle(0% at '   + ox + ' ' + oy + ')';

    var dur    = dark ? 580 : 460;
    var easing = dark
      ? 'cubic-bezier(0.33, 0.86, 0.2, 1)'
      : 'cubic-bezier(0.4, 0, 0.75, 1)';

    darkImgs.forEach(function (img) {
      img.style.clipPath = from;
      var anim = img.animate(
        [{ clipPath: from }, { clipPath: to }],
        { duration: dur, easing: easing, fill: 'forwards' }
      );
      anim.onfinish = function () { img.style.clipPath = to; };
      runningAnims.push(anim);
    });
  }

  /* ---- toggle pill + label sync ---- */
  function syncToggleUI(dark) {
    if (!toggle) return;
    toggle.setAttribute('aria-checked', dark ? 'true' : 'false');
    toggle.classList.toggle('showcase-toggle--on', dark);
    if (lblLight) lblLight.classList.toggle('showcase-lbl--active', !dark);
    if (lblDark)  lblDark.classList.toggle('showcase-lbl--active',  dark);
  }

  /* ---- compute showcase toggle rect as % of viewport ---- */
  function toggleOrigin() {
    if (!toggle || !viewport) return { ox: ORIGIN_X, oy: ORIGIN_Y };
    var r   = toggle.getBoundingClientRect();
    var w   = viewport.getBoundingClientRect();
    var ox  = (((r.left + r.right)  / 2 - w.left) / w.width  * 100).toFixed(1) + '%';
    var oy  = (((r.top  + r.bottom) / 2 - w.top)  / w.height * 100).toFixed(1) + '%';
    return { ox: ox, oy: oy };
  }

  /* ---- initialise ---- */
  items[0].classList.add('is-active');

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      track.classList.add('sc-initialized');
    });
  });

  darkImages = document.documentElement.classList.contains('dark');
  commitTheme(darkImages);

  tabs.forEach(function (t, i) { t.classList.toggle('showcase-tab--active', i === 0); });
  dots.forEach(function (d, i) {
    d.style.background   = i === 0 ? 'var(--primary)' : 'var(--border)';
    d.style.width        = i === 0 ? '1.5rem' : '';
    d.style.height       = i === 0 ? '0.375rem' : '';
    d.style.borderRadius = i === 0 ? '999px' : '';
  });
  if (label) label.textContent = LABELS[0];

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

  /*
   * Showcase Lyst/Mørkt toggle → animate only the preview images.
   * Does NOT affect the site theme; the site toggle is a separate control.
   * Origin is mapped from the toggle button into the carousel's coordinate
   * space so the circle expands from the toggle position.
   */
  toggle && toggle.addEventListener('click', function () {
    var o = toggleOrigin();
    animateTheme(!darkImages, o.ox, o.oy);
  });

  /* ---- sync images with site theme (fires on nav toggle AND showcase toggle) ---- */
  /*
   * Delay ~380 ms so the screenshot circle fires in the tail of the page
   * view-transition (~520 ms). Origin is mapped from whichever button
   * triggered the change into the carousel's coordinate space.
   */
  var pendingThemeTimer = null;

  new MutationObserver(function () {
    var siteDark = document.documentElement.classList.contains('dark');
    if (siteDark === darkImages) return;

    /* Use the site nav toggle as the animation origin so the circle
       appears to ripple from the nav button through the page into the images. */
    var ox = ORIGIN_X, oy = ORIGIN_Y;
    var originBtn = siteToggle;
    if (originBtn && viewport) {
      var btnRect  = originBtn.getBoundingClientRect();
      var wrapRect = viewport.getBoundingClientRect();
      ox = (((btnRect.left + btnRect.right) / 2 - wrapRect.left) / wrapRect.width  * 100).toFixed(1) + '%';
      oy = (((btnRect.top  + btnRect.bottom) / 2 - wrapRect.top)  / wrapRect.height * 100).toFixed(1) + '%';
    }

    clearTimeout(pendingThemeTimer);
    pendingThemeTimer = setTimeout(function () {
      animateTheme(siteDark, ox, oy);
    }, 380);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

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
