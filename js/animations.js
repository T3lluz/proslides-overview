/* =====================================================================
   ProSlides – Scroll & entrance animations  |  animations.js  v6
   ===================================================================== */

(function () {
  'use strict';

  var reducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canHover =
    window.matchMedia && window.matchMedia('(hover: hover)').matches;

  function each(sel, cb) {
    document.querySelectorAll(sel).forEach(cb);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  /* ── shared transition curves ─────────────────────────────────── */

  var EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

  var SHADOW_L = '0 14px 40px -8px rgba(0,0,0,0.18), 0 4px 14px -4px rgba(0,0,0,0.08)';
  var SHADOW_D = '0 14px 40px -6px rgba(0,0,0,0.50), 0 4px 14px -3px rgba(0,0,0,0.25)';

  function shadow() { return isDark() ? SHADOW_D : SHADOW_L; }

  function clearLater(el, ms) {
    clearTimeout(el._psClear);
    el._psClear = setTimeout(function () {
      if (!el.matches(':hover')) {
        el.style.transition = '';
        el.style.willChange = '';
      }
    }, ms);
  }

  /* =================================================================
     HOVER PRESET A  —  "tilt"
     Full 3-D perspective tilt following mouse position.
     Smooth: 60 ms tracking on move, 400 ms spring-back on leave.
     ================================================================= */

  function presetTilt(card, opts) {
    var maxRot = (opts && opts.maxRot) || 10;
    var sc     = (opts && opts.scale)  || 1.04;

    function applyTilt(e) {
      var r  = card.getBoundingClientRect();
      var dx = clamp((e.clientX - r.left - r.width  * 0.5) / (r.width  * 0.5), -1, 1);
      var dy = clamp((e.clientY - r.top  - r.height * 0.5) / (r.height * 0.5), -1, 1);

      /* No transform transition while tracking — avoids fighting Tailwind/CSS */
      card.style.transition = 'box-shadow 80ms linear';
      card.style.transform  =
        'rotateX(' + (-dy * maxRot) + 'deg) rotateY(' +
        (dx * maxRot) + 'deg) scale(' + sc + ')';
      card.style.boxShadow = shadow();
    }

    card.addEventListener('mouseenter', function (e) {
      clearTimeout(card._psClear);
      card.style.willChange = 'transform';
      applyTilt(e);
    });

    card.addEventListener('mousemove', applyTilt);

    card.addEventListener('mouseleave', function () {
      card.style.transition =
        'transform 0.40s ' + EASE_OUT + ', box-shadow 0.35s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      clearLater(card, 450);
    });
  }

  /* =================================================================
     HOVER PRESET B  —  "lean"
     Fixed-direction tilt on hover (no mouse tracking).
     Card tilts from one edge — e.g. timeline cards lean away from
     the centre line, giving a "hinged" connected feel.
     ================================================================= */

  function presetLean(card, opts) {
    var deg    = (opts && opts.deg)    || 2.5;
    var sc     = (opts && opts.scale)  || 1.02;
    var origin = (opts && opts.origin) || 'center';
    var lift   = (opts && opts.lift  != null) ? opts.lift : 5;

    var dir = origin === 'left' ? -1 : origin === 'right' ? 1 : 0;
    var ry  = dir * deg;
    var rx  = -0.8;

    card.addEventListener('mouseenter', function () {
      clearTimeout(card._psClear);
      card.style.willChange = 'transform';
      card.style.transition =
        'transform 0.30s ' + EASE_OUT + ', box-shadow 0.28s ease';
      card.style.transform =
        'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry +
        'deg) translateY(-' + lift + 'px) scale(' + sc + ')';
      card.style.boxShadow = shadow();
    });

    card.addEventListener('mouseleave', function () {
      card.style.transition =
        'transform 0.38s ' + EASE_OUT + ', box-shadow 0.34s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      clearLater(card, 420);
    });
  }

  /* =================================================================
     HOVER PRESET C  —  "expand"
     Card lifts subtly while inner content (icon, title, text) scales
     up with shadow — the content "grows out" of its container.
     ================================================================= */

  function presetPop(card, opts) {
    var lift = (opts && opts.lift)  || 4;
    var sc   = (opts && opts.scale) || 1.02;

    card.classList.add('ps-expand-card');

    card.addEventListener('mouseenter', function () {
      clearTimeout(card._psClear);
      card.style.willChange = 'transform';
      card.style.transition =
        'transform 0.32s ' + EASE_OUT + ', box-shadow 0.30s ease';
      card.style.transform =
        'translateY(-' + lift + 'px) scale(' + sc + ')';
      card.style.boxShadow = shadow();
    });

    card.addEventListener('mouseleave', function () {
      card.style.transition =
        'transform 0.38s ' + EASE_OUT + ', box-shadow 0.34s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      clearLater(card, 420);
    });
  }

  /* =================================================================
     IN-VIEW PRESET C  —  "expand" as scroll focus (not hover)
     Inner content scales when the card is sufficiently in viewport.
     ================================================================= */

  var expandFocusObs = null;

  function observeExpandCard(card, opts) {
    if (reducedMotion || !card) return;

    var lift = (opts && opts.lift) || 4;
    var sc   = (opts && opts.scale) || 1.02;

    card.classList.add('ps-expand-card');
    card.style.setProperty('--ps-lift', lift + 'px');
    card.style.setProperty('--ps-scale', String(sc));

    if (card._psExpandObserved) return;
    card._psExpandObserved = true;

    if (!expandFocusObs) {
      expandFocusObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('ps-expand-focused', entry.isIntersecting);
        });
      }, { threshold: 0.2, rootMargin: '-30% 0px -30% 0px' });
    }

    expandFocusObs.observe(card);
  }

  /* =================================================================
     HOVER PRESET D  —  "showcase"
     Gentle lift + shadow bloom without any rotation or mouse-tracking.
     Keeps overlay buttons perfectly clickable.
     ================================================================= */

  function presetShowcase(card) {
    card.addEventListener('mouseenter', function () {
      clearTimeout(card._psClear);
      card.style.willChange = 'transform, box-shadow';
      card.style.transition =
        'transform 0.35s ' + EASE_OUT + ', box-shadow 0.30s ease';
      card.style.transform = 'translateY(-4px) scale(1.008)';
      card.style.boxShadow = isDark()
        ? '0 18px 50px -10px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in oklch, var(--primary) 18%, transparent)'
        : '0 18px 50px -10px rgba(0,0,0,0.16), 0 0 0 1px color-mix(in oklch, var(--primary) 12%, transparent)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transition =
        'transform 0.40s ' + EASE_OUT + ', box-shadow 0.35s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      clearLater(card, 450);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     1. Classify elements with reveal classes
     ───────────────────────────────────────────────────────────────── */

  function classifyHeaders() {
    each('section[id] > [class*="max-w-"] > h2', function (h) {
      h.classList.add('reveal', 'reveal-up');
    });
    each('section[id] > [class*="max-w-"] > p.text-muted-foreground', function (p) {
      p.classList.add('reveal', 'reveal-up');
      p.dataset.delay = '2';
    });
  }

  function classifyAbout() {
    each('#about .rounded-lg', function (box, i) {
      box.classList.add('reveal', i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      box.dataset.delay = String(i + 1);
    });
    document.querySelectorAll('#about .grid > div').forEach(function (c, i) {
      c.classList.add('reveal', 'reveal-up');
      c.dataset.delay = String((i % 4) + 1);
    });
  }

  function classifyArch() {
    document.querySelectorAll('#architecture > [class*="max-w-"] > .grid > div').forEach(
      function (c, i) {
        c.classList.add('reveal', 'reveal-up');
        c.dataset.delay = String(i + 1);
      }
    );
    var explorer = document.querySelector('#architecture-explorer');
    if (explorer) {
      explorer.classList.add('reveal', 'reveal-scale');
      explorer.dataset.delay = '3';
    }
  }

  function classifyShowcase() {
    var wrap = document.querySelector('#showcase-wrap');
    if (wrap) {
      wrap.classList.add('reveal', 'reveal-scale');
      wrap.dataset.delay = '2';
    }
  }

  function classifyTimeline() {
    document.querySelectorAll('.tl-row').forEach(function (row) {
      var divs = row.querySelectorAll(':scope > div');
      var isLeft = false;
      for (var i = 0; i < divs.length; i++) {
        if (divs[i].querySelector('.tl-card')) {
          var cn = divs[i].className;
          isLeft = cn.indexOf('pr-14') !== -1 || cn.indexOf('text-right') !== -1;
          break;
        }
      }
      row.classList.add(isLeft ? 'tl-row-left' : 'tl-row-right');
    });
  }

  var revealObs = null;

  function initDocCards() {
    each('#docs-catalog .doc-card', function (c, i) {
      if (!c.classList.contains('reveal')) {
        c.classList.add('reveal', 'reveal-up');
        c.dataset.delay = String((i % 6) + 1);
      }
      observeRevealOnce(c);
      observeExpandCard(c, { lift: 3, scale: 1.012 });
    });
  }

  function animateDocsCards() {
    var container = document.getElementById('docs-catalog');
    if (!container || reducedMotion) return;

    var items = container.querySelectorAll('.doc-card');
    if (!items.length) return;

    items.forEach(function (el) {
      el.style.opacity = '0';
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        entry.target.querySelectorAll('.doc-card').forEach(function (el, i) {
          setTimeout(function () {
            el.style.transition = 'opacity 0.42s ' + EASE_OUT;
            el.style.opacity = '1';
            setTimeout(function () {
              if (!el.matches(':hover')) el.style.transition = '';
              el.style.opacity = '';
            }, 480);
          }, i * 50);
        });
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -20px 0px' });

    obs.observe(container);
  }

  /* ─────────────────────────────────────────────────────────────────
     2. Grid entrance — one-shot Web Animations API
     ───────────────────────────────────────────────────────────────── */

  function animateGrid(containerSel, itemSel) {
    var container = document.querySelector(containerSel);
    if (!container || reducedMotion) return;

    var items = container.querySelectorAll(itemSel);
    items.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(36px) scale(0.95)';
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        entry.target.querySelectorAll(itemSel).forEach(function (el, i) {
          setTimeout(function () {
            el.style.transition =
              'opacity 0.42s ' + EASE_OUT + ', transform 0.42s ' + EASE_OUT;
            el.style.opacity = '1';
            el.style.transform = 'none';
            setTimeout(function () {
              el.style.transition = '';
              el.style.opacity = '';
              el.style.transform = '';
            }, 480);
          }, i * 50);
        });
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -20px 0px' });

    obs.observe(container);
  }

  function animateTechCards() { animateGrid('#tech .grid', ':scope > a'); }

  /* Opacity-only entrance — team cards use inline transform for tilt hover */
  function animateTeamCards() {
    var container = document.querySelector('#team .grid');
    if (!container || reducedMotion) return;

    var items = container.querySelectorAll(':scope > div');
    items.forEach(function (el) {
      el.style.opacity = '0';
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        entry.target.querySelectorAll(':scope > div').forEach(function (el, i) {
          setTimeout(function () {
            el.style.transition = 'opacity 0.42s ' + EASE_OUT;
            el.style.opacity = '1';
            setTimeout(function () {
              if (!el.matches(':hover')) el.style.transition = '';
              el.style.opacity = '';
            }, 480);
          }, i * 50);
        });
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -20px 0px' });

    obs.observe(container);
  }

  function watchDocsGrid() {
    var grid = document.getElementById('docs-catalog');
    if (!grid || reducedMotion) return;

    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (!(node instanceof Element)) return;
          var cards = node.classList.contains('doc-card')
            ? [node]
            : Array.from(node.querySelectorAll('.doc-card'));
          cards.forEach(function (card) {
            card.animate(
              [
                { opacity: '0', transform: 'translateY(24px)' },
                { opacity: '1', transform: 'none' }
              ],
              { duration: 380, easing: EASE_OUT, fill: 'both' }
            ).onfinish = function () { this.cancel(); };
            observeExpandCard(card, { lift: 3, scale: 1.012 });
          });
          if (cards.length) initDocCards();
        });
      });
    }).observe(grid, { childList: true, subtree: true });
  }

  /* ─────────────────────────────────────────────────────────────────
     3. Showcase preview images — custom entrance

     When the showcase section scrolls into view, the wrapper does a
     cinematic scale-up from 0.90 → 1 with a reflection-like shimmer
     (a bright gradient pseudo-element sweeps across).
     The shimmer is CSS-only (see animations.css @keyframes ps-shimmer).
     JS just adds the trigger class.
     ───────────────────────────────────────────────────────────────── */

  function initShowcaseEntrance() {
    var wrap = document.querySelector('#showcase-wrap');
    if (!wrap || reducedMotion) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          wrap.classList.add('ps-showcase-entered');
          obs.unobserve(wrap);
        }
      });
    }, { threshold: 0.25 });

    obs.observe(wrap);
  }

  /* ─────────────────────────────────────────────────────────────────
     4. General reveal observer  (one-shot appear; focus is separate)
     ───────────────────────────────────────────────────────────────── */

  function observeRevealOnce(el) {
    if (!el || el.classList.contains('is-revealed') || el._psRevealObserved) return;
    if (reducedMotion) {
      el.classList.add('is-revealed');
      return;
    }
    if (!revealObs) return;
    el._psRevealObserved = true;
    revealObs.observe(el);
  }

  function initRevealObserver() {
    revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    each('.reveal', function (el) { observeRevealOnce(el); });
  }

  /* ─────────────────────────────────────────────────────────────────
     5. Timeline — scroll snap focus, line fill → active dot, expand
     ───────────────────────────────────────────────────────────────── */

  function initTimelineScrollFocus() {
    var section = document.querySelector('#timeline');
    if (!section) return;

    var rows = Array.from(section.querySelectorAll('.tl-row'));
    var fill  = section.querySelector('.tl-fill');
    var track = section.querySelector('.tl-track');
    var dots  = Array.from(section.querySelectorAll('.tl-dot'));
    if (!rows.length) return;

    rows.forEach(function (row) {
      var card = row.querySelector('.tl-card');
      if (card) card.classList.add('tl-expand-card');
    });

    var activeIndex = -1;
    var inTimeline  = false;

    var tlAppearObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        tlAppearObs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -28px 0px' });

    rows.forEach(function (row) {
      if (!row.classList.contains('is-visible')) tlAppearObs.observe(row);
    });

    function isInTimelineView() {
      var r = section.getBoundingClientRect();
      return r.top < window.innerHeight * 0.72 && r.bottom > window.innerHeight * 0.28;
    }

    /* Only switch focus when a row’s centre enters a narrow band —
       avoids jumping on every wheel tick / small scroll nudge. */
    var FOCUS_ZONE = 0.14;

    function rowCenterY(row) {
      var r = row.getBoundingClientRect();
      return r.top + r.height * 0.5;
    }

    function closestRowIndex() {
      var center = window.innerHeight * 0.5;
      var best = 0;
      var bestDist = Infinity;
      rows.forEach(function (row, i) {
        var dist = Math.abs(rowCenterY(row) - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    function focusCandidateIndex() {
      var center = window.innerHeight * 0.5;
      var zonePx = window.innerHeight * FOCUS_ZONE;
      var inZone = [];

      rows.forEach(function (row, i) {
        var dist = Math.abs(rowCenterY(row) - center);
        if (dist <= zonePx) inZone.push({ i: i, dist: dist });
      });

      if (!inZone.length) {
        if (activeIndex >= 0) return activeIndex;
        return closestRowIndex();
      }

      inZone.sort(function (a, b) { return a.dist - b.dist; });
      var pick = inZone[0].i;

      if (activeIndex >= 0 && activeIndex !== pick) {
        var curDist = Math.abs(rowCenterY(rows[activeIndex]) - center);
        var pickDist = inZone[0].dist;
        if (curDist - pickDist < zonePx * 0.35) return activeIndex;
      }

      return pick;
    }

    function setFocus(index) {
      if (index === activeIndex) return;
      activeIndex = index;

      rows.forEach(function (row, i) {
        row.classList.toggle('is-focused', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.classList.toggle('is-reached', i <= index);
      });
    }

    function clearFocus() {
      activeIndex = -1;
      section.classList.remove('tl-is-active');
      rows.forEach(function (row) { row.classList.remove('is-focused'); });
      dots.forEach(function (dot) { dot.classList.remove('is-active'); });
    }

    function updateFill() {
      if (!fill || !dots.length) return;

      var wrapper = fill.parentElement;
      var wRect   = wrapper.getBoundingClientRect();
      var lastDot = dots[dots.length - 1];
      var lastRect = lastDot.getBoundingClientRect();
      var lastDotY = lastRect.top + lastRect.height * 0.5 - wRect.top;

      if (lastDotY <= 0) return;

      var fillPx;
      if (inTimeline && activeIndex >= 0 && dots[activeIndex]) {
        var dRect = dots[activeIndex].getBoundingClientRect();
        fillPx = dRect.top + dRect.height * 0.5 - wRect.top;
      } else {
        fillPx = window.innerHeight * 0.5 - wRect.top;
      }

      fill.style.height = clamp(fillPx, 0, lastDotY) + 'px';

      if (track) track.style.height = lastDotY + 'px';

      if (!inTimeline) {
        dots.forEach(function (dot) {
          var dr = dot.getBoundingClientRect();
          var dotY = dr.top + dr.height * 0.5 - wRect.top;
          dot.classList.toggle('is-reached', dotY <= fillPx + 1);
        });
      }
    }

    function tick() {
      var inside = isInTimelineView();
      if (inside) {
        if (!inTimeline) {
          inTimeline = true;
          section.classList.add('tl-is-active');
        }
        setFocus(focusCandidateIndex());
      } else if (inTimeline) {
        inTimeline = false;
        clearFocus();
      }
      updateFill();
    }

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () { tick(); ticking = false; });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    tick();
  }

  /* ─────────────────────────────────────────────────────────────────
     6. Section-inner parallax
     ───────────────────────────────────────────────────────────────── */

  function initSectionParallax() {
    if (reducedMotion) return;

    var RANGE = 20;
    var SKIP  = new Set(['hero', 'architecture', 'team']);
    var items = [];

    each('section[id]', function (section) {
      if (SKIP.has(section.id)) return;
      var inner = section.querySelector('[class*="max-w-"]');
      if (!inner) return;
      inner.classList.add('ps-parallax-inner');
      items.push({ section: section, inner: inner });
    });

    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.section.getBoundingClientRect();
        var p = clamp((r.top + r.height * 0.5 - vh * 0.5) / (vh * 0.7), -1, 1);
        it.inner.style.setProperty('--ps-py', (p * RANGE) + 'px');
      });
      ticking = false;
    }

    ['scroll', 'resize'].forEach(function (ev) {
      window.addEventListener(ev, function () {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
    });
    update();
  }

  /* ─────────────────────────────────────────────────────────────────
     7. Apply hover presets across the page

     A = tilt (mouse-follow)  — profile cards, about grid, showcase
     B = lean (fixed hinge)   — about feature boxes, arch 2-col
     C = pop (lift + shadow)  — in-view on about / arch / docs
     ───────────────────────────────────────────────────────────────── */

  function initInViewExpandEffects() {
    if (reducedMotion) return;

    each('#about .about-card', function (c) {
      observeExpandCard(c, { lift: 4, scale: 1.02 });
    });
    each('#about .grid.gap-4 > div', function (c) {
      observeExpandCard(c, { lift: 3, scale: 1.015 });
    });
    document.querySelectorAll('#architecture > [class*="max-w-"] > .grid > div').forEach(
      function (c) {
        observeExpandCard(c, { lift: 4, scale: 1.02 });
      }
    );
    each('#docs-catalog .doc-card', function (c) {
      observeExpandCard(c, { lift: 3, scale: 1.012 });
    });
  }

  function initHoverEffects() {
    if (reducedMotion || !canHover) return;

    /* PRESET A — tilt (mouse-follow parallax) */
    each('#team .grid > div', function (c) {
      presetTilt(c, { maxRot: 10, scale: 1.04 });
    });
    var showcase = document.querySelector('#showcase-wrap');
    if (showcase) presetShowcase(showcase);

    /* PRESET B — lean (fixed hinge, no tracking) */
    each('#tech .grid > a', function (c) {
      presetLean(c, { deg: 2, scale: 1.03, origin: 'center', lift: 4 });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     8. Nav active-section highlight
     ───────────────────────────────────────────────────────────────── */

  function initNavHighlight() {
    var links = document.querySelectorAll('nav a[href^="#"]');
    if (!links.length) return;

    each('section[id]', function (s) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('nav-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { threshold: 0.35 }).observe(s);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     9. Bootstrap
     ───────────────────────────────────────────────────────────────── */

  window.ProSlides = {
    initDocCards: initDocCards,
    observeExpandCard: observeExpandCard
  };

  document.addEventListener('DOMContentLoaded', function () {
    classifyHeaders();
    classifyAbout();
    classifyArch();
    classifyShowcase();
    classifyTimeline();
    initDocCards();

    animateTechCards();
    animateTeamCards();
    animateDocsCards();
    watchDocsGrid();

    initShowcaseEntrance();
    initRevealObserver();
    initTimelineScrollFocus();
    initSectionParallax();
    initInViewExpandEffects();
    initHoverEffects();
    initNavHighlight();
  });

})();
