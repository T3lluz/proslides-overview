/* =====================================================================
   ProSlides – Scroll & entrance animations  |  animations.js  v6
   ===================================================================== */

(function () {
  'use strict';

  function motionReduced() {
    return (
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      document.documentElement.classList.contains('animations-off')
    );
  }

  var canHover =
    window.matchMedia && window.matchMedia('(hover: hover)').matches;

  function each(sel, cb) {
    document.querySelectorAll(sel).forEach(cb);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  /* ── shared transition curves ─────────────────────────────────── */

  var EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

  var SHADOW = '0 14px 40px -8px rgba(0,0,0,0.18), 0 4px 14px -4px rgba(0,0,0,0.08)';

  function shadow() { return SHADOW; }

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
    var hoverRect = null;

    function updateHoverRect() {
      var r = card.getBoundingClientRect();
      hoverRect = {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height
      };
    }

    function getHoverRect() {
      if (!hoverRect) updateHoverRect();
      return hoverRect;
    }

    function applyTilt(e) {
      var r  = getHoverRect();
      var dx = clamp((e.clientX - r.left - r.width  * 0.5) / (r.width  * 0.5), -1, 1);
      var dy = clamp((e.clientY - r.top  - r.height * 0.5) / (r.height * 0.5), -1, 1);

      card.style.transition = 'box-shadow 80ms linear';
      card.style.transform  =
        'rotateX(' + (-dy * maxRot) + 'deg) rotateY(' +
        (dx * maxRot) + 'deg) scale(' + sc + ')';
      card.style.boxShadow = shadow();
    }

    card.addEventListener('mouseenter', function (e) {
      clearTimeout(card._psClear);
      updateHoverRect();
      card.style.willChange = 'transform';
      applyTilt(e);
    });

    card.addEventListener('mousemove', applyTilt);

    card.addEventListener('mouseleave', function () {
      card.style.transition =
        'transform 0.40s ' + EASE_OUT + ', box-shadow 0.35s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      hoverRect = null;
      clearLater(card, 450);
    });

    function refreshHoverRect() {
      if (!card.matches(':hover')) return;
      updateHoverRect();
    }

    window.addEventListener('resize', refreshHoverRect, { passive: true });
    window.addEventListener('scroll', refreshHoverRect, { passive: true });
  }

  function unwrapTiltInner(card) {
    var inner = card.querySelector(':scope > .ps-tilt-inner');
    if (!inner) return;
    while (inner.firstChild) card.insertBefore(inner.firstChild, inner);
    inner.remove();
  }

  function normalizeTeamCard(card) {
    card.querySelectorAll('.team-card__foil, .team-card__glare').forEach(function (el) {
      el.remove();
    });
    var legacy = card.querySelector(':scope > .team-card__tilt');
    if (legacy) {
      legacy.classList.remove('team-card__tilt');
      legacy.classList.add('team-card__scene');
    }
  }

  function ensureTeamCardScene(card) {
    normalizeTeamCard(card);
    var scene = card.querySelector(':scope > .team-card__scene');
    if (scene) return scene;
    scene = document.createElement('div');
    scene.className = 'team-card__scene';
    while (card.firstChild) scene.appendChild(card.firstChild);
    card.appendChild(scene);
    return scene;
  }

  function presetTeamCard(card) {
    ensureTeamCardScene(card);

    var popLayers = [
      { sel: '.team-card__photo-frame', hoverZ: 14, parallaxX: 4.5, parallaxY: 4, rotX: 1.2, rotY: 1.4 },
      { sel: '.team-card__identity', hoverZ: 8, parallaxX: 2.5, parallaxY: 2, rotX: 0.7, rotY: 0.9 },
      { sel: '.team-card__badge', hoverZ: 6, parallaxX: 1.7, parallaxY: 1.2, rotX: 0.45, rotY: 0.7 },
      { sel: '.team-card__focus', hoverZ: 1, parallaxX: -0.9, parallaxY: -0.6, rotX: 0.32, rotY: 0.38, scale: 0.987 },
      { sel: '.team-card__actions', hoverZ: 6, parallaxX: 1.6, parallaxY: 1.2, rotX: 0.32, rotY: 0.38 }
    ];
    var layerEls = popLayers
      .map(function (layer) {
        return { cfg: layer, el: card.querySelector(layer.sel) };
      })
      .filter(function (item) {
        return item.el;
      });
    var maxRot = 6.4;
    var cardLift = 14;
    var easeSmooth = 'cubic-bezier(0.22, 1, 0.36, 1)';
    var durIn = '0.5s';
    var durMove = '0.28s';
    var durOut = '0.65s';
    var hoverRect = null;

    function updateHoverRect() {
      var r = card.getBoundingClientRect();
      hoverRect = {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height
      };
    }

    function getHoverRect() {
      if (!hoverRect) updateHoverRect();
      return hoverRect;
    }

    function getTilt(e) {
      var r = getHoverRect();
      var dx = (e.clientX - r.left - r.width * 0.5) / (r.width * 0.5);
      var dy = (e.clientY - r.top - r.height * 0.5) / (r.height * 0.5);
      dx = clamp(dx, -1, 1);
      dy = clamp(dy, -1, 1);
      var dist = Math.sqrt(dx * dx + dy * dy);
      var dead = 0.12;

      if (dist <= dead) {
        return { dx: 0, dy: 0, flat: true };
      }

      var amount = (dist - dead) / (1 - dead);
      amount = Math.min(amount, 1);
      var nx = dx / dist;
      var ny = dy / dist;

      return {
        dx: clamp(nx * amount, -1, 1),
        dy: clamp(ny * amount, -1, 1),
        flat: false
      };
    }

    function cardTransform(t) {
      if (t.flat) {
        return 'translate3d(0, 0, ' + cardLift + 'px) rotateX(0deg) rotateY(0deg)';
      }
      return (
        'translate3d(0, 0, ' +
        cardLift +
        'px) rotateX(' +
        (-t.dy * maxRot) +
        'deg) rotateY(' +
        (t.dx * maxRot) +
        'deg)'
      );
    }

    function setLight(e, t) {
      var r = getHoverRect();
      var mx = ((e.clientX - r.left) / r.width) * 100;
      var my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--lx', mx + '%');
      card.style.setProperty('--ly', my + '%');
      card.style.setProperty('--light-angle', 120 + (mx - 50) * 0.9 + 'deg');
      card.style.setProperty('--shine-strength', String(t.flat ? 0.58 : 0.58 + Math.min(Math.sqrt(t.dx * t.dx + t.dy * t.dy), 1) * 0.42));
    }

    function layerTransform(t, layer, active) {
      if (!active) return '';
      var dx = t.flat ? 0 : t.dx;
      var dy = t.flat ? 0 : t.dy;
      var z = t.flat ? 0 : (layer.hoverZ || 0);
      var tx = dx * (layer.parallaxX || 0);
      var ty = dy * (layer.parallaxY || 0);
      var rx = -dy * (layer.rotX || 0);
      var ry = dx * (layer.rotY || 0);
      var sc = t.flat ? 1 : (layer.scale || 1);
      return (
        'translate3d(' + tx + 'px, ' + ty + 'px, ' + z + 'px) ' +
        'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(' + sc + ')'
      );
    }

    function applyDepth(e, dur, active) {
      var trans = 'transform ' + dur + ' ' + easeSmooth;
      var t = active && e ? getTilt(e) : { dx: 0, dy: 0, flat: true };

      if (active && e) setLight(e, t);

      card.style.transition = trans + ', box-shadow ' + dur + ' ease';

      if (active) {
        card.classList.add('team-card--lift');
        card.style.transform = cardTransform(t);
      } else {
        card.classList.remove('team-card--lift');
        card.style.transform = '';
      }

      layerEls.forEach(function (item) {
        item.el.style.transition = trans;
        item.el.style.transform = active ? layerTransform(t, item.cfg, active) : '';
      });
    }

    card.addEventListener('mouseenter', function (e) {
      clearTimeout(card._psClear);
      updateHoverRect();
      card.style.willChange = 'transform';
      card.style.zIndex = '8';
      applyDepth(e, durIn, true);
    });

    card.addEventListener('mousemove', function (e) {
      applyDepth(e, durMove, true);
    });

    card.addEventListener('mouseleave', function () {
      applyDepth(null, durOut, false);
      card.style.zIndex = '';
      hoverRect = null;
      card.style.removeProperty('--lx');
      card.style.removeProperty('--ly');
      card.style.removeProperty('--light-angle');
      card.style.removeProperty('--shine-strength');
      clearLater(card, 700);
      layerEls.forEach(function (item) {
        clearLater(item.el, 700);
      });
    });

    function refreshHoverRect() {
      if (!card.matches(':hover')) return;
      updateHoverRect();
    }

    window.addEventListener('resize', refreshHoverRect, { passive: true });
    window.addEventListener('scroll', refreshHoverRect, { passive: true });
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
    if (motionReduced() || !card) return;

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
      card.style.boxShadow =
        '0 18px 50px -10px rgba(0,0,0,0.16), 0 0 0 1px color-mix(in oklch, var(--primary) 12%, transparent)';
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
    each('section[id] .section-title', function (h) {
      h.classList.add('reveal', 'reveal-up');
    });
    each('section[id] .section-header .section-desc', function (p) {
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
    document.querySelectorAll('#architecture .section-inner > .grid > div').forEach(
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
    if (!container || motionReduced()) return;

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
    if (!container || motionReduced()) return;

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

  function animateTechCards() { animateGrid('#tech .tech-stack', '.tech-chip'); }

  /* Opacity-only entrance — team cards use inline transform for tilt hover */
  function animateTeamCards() {
    var container = document.querySelector('#team .team-grid');
    if (!container || motionReduced()) return;

    var items = container.querySelectorAll(':scope > .team-card');
    items.forEach(function (el) {
      unwrapTiltInner(el);
      el.style.opacity = '0';
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        entry.target.querySelectorAll(':scope > .team-card').forEach(function (el, i) {
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
    if (!grid || motionReduced()) return;

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
    if (!wrap || motionReduced()) return;

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
    if (motionReduced()) {
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
    var MOBILE_FOCUS_ANCHOR = 0.5;
    var MOBILE_FOCUS_ZONE = 0.2;

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
      if (window.innerWidth <= 768) {
        return r.top < window.innerHeight * 0.85 && r.bottom > window.innerHeight * 0.15;
      }
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
      if (window.innerWidth <= 768) {
        var centerMobile = window.innerHeight * MOBILE_FOCUS_ANCHOR;
        var zoneMobile = window.innerHeight * MOBILE_FOCUS_ZONE;
        var bestMobile = 0;
        var bestDistMobile = Infinity;

        dots.forEach(function (dot, i) {
          var r = dot.getBoundingClientRect();
          var dotCenter = r.top + r.height * 0.5;
          var dist = Math.abs(dotCenter - centerMobile);
          if (dist <= zoneMobile && dist < bestDistMobile) {
            bestDistMobile = dist;
            bestMobile = i;
          }
        });

        if (bestDistMobile !== Infinity) return bestMobile;

        dots.forEach(function (dot, i) {
          var r = dot.getBoundingClientRect();
          var dotCenter = r.top + r.height * 0.5;
          if (dotCenter <= centerMobile) bestMobile = i;
        });
        return clamp(bestMobile, 0, rows.length - 1);
      }

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
      if (activeIndex >= 0 && dots[activeIndex]) {
        var dRect = dots[activeIndex].getBoundingClientRect();
        fillPx = dRect.top + dRect.height * 0.5 - wRect.top;
      } else {
        var anchor = window.innerWidth <= 768 ? window.innerHeight * MOBILE_FOCUS_ANCHOR : window.innerHeight * 0.5;
        fillPx = anchor - wRect.top;
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
    if (motionReduced()) return;

    var RANGE = 20;
    var SKIP  = new Set(['hero', 'architecture', 'team']);
    var items = [];

    each('section[id]', function (section) {
      if (SKIP.has(section.id)) return;
      var inner = section.querySelector('.section-inner');
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
    if (motionReduced()) return;

    each('#about .about-card', function (c) {
      observeExpandCard(c, { lift: 4, scale: 1.02 });
    });
    each('#about .grid.gap-4 > div', function (c) {
      observeExpandCard(c, { lift: 3, scale: 1.015 });
    });
    document.querySelectorAll('#architecture .section-inner > .grid > div').forEach(
      function (c) {
        observeExpandCard(c, { lift: 4, scale: 1.02 });
      }
    );
    each('#docs-catalog .doc-card', function (c) {
      observeExpandCard(c, { lift: 3, scale: 1.012 });
    });
  }

  function initHoverEffects() {
    if (motionReduced() || !canHover) return;

    /* PRESET A — tilt (mouse-follow parallax) */
    each('#team .team-card', function (c) {
      unwrapTiltInner(c);
      presetTeamCard(c);
    });
    var showcase = document.querySelector('#showcase-wrap');
    if (showcase) presetShowcase(showcase);

    /* PRESET B — lean (fixed hinge, no tracking) */
    each('#tech .tech-chip', function (c) {
      presetLean(c, { deg: 2, scale: 1.04, origin: 'center', lift: 2 });
    });
  }

  function initMobileTeamScrollTilt() {
    if (motionReduced()) return;
    var coarse =
      window.matchMedia &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (!coarse) return;

    var cards = Array.from(document.querySelectorAll('#team .team-card'));
    if (!cards.length) return;
    var focusedCard = null;

    function reset(card) {
      card.style.transform = '';
      card.classList.remove('is-mobile-tilting', 'is-mobile-focus', 'team-card--lift');
      card.style.removeProperty('--lx');
      card.style.removeProperty('--ly');
      card.style.removeProperty('--light-angle');
      card.style.removeProperty('--shine-strength');
    }

    var ticking = false;
    function update() {
      var vh = window.innerHeight || 1;
      var centerY = vh * 0.5;
      var visibleCards = [];
      var nearestCard = null;
      var nearestDist = Infinity;

      cards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        var isVisible = r.bottom > vh * 0.04 && r.top < vh * 0.96;
        if (!isVisible) {
          reset(card);
          return;
        }
        visibleCards.push(card);
        var dist = Math.abs((r.top + r.height * 0.5) - centerY);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestCard = card;
        }
      });

      if (!visibleCards.length) {
        focusedCard = null;
        ticking = false;
        return;
      }

      if (focusedCard && visibleCards.indexOf(focusedCard) === -1) {
        focusedCard = null;
      }

      if (!focusedCard) {
        focusedCard = nearestCard;
      } else if (nearestCard && nearestCard !== focusedCard) {
        var focusedRect = focusedCard.getBoundingClientRect();
        var focusedDist = Math.abs((focusedRect.top + focusedRect.height * 0.5) - centerY);
        var switchThreshold = vh * 0.035;
        if (nearestDist + switchThreshold < focusedDist) focusedCard = nearestCard;
      }

      visibleCards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        var center = r.top + r.height * 0.5;
        var offset = clamp((center - vh * 0.5) / (vh * 0.42), -1, 1);
        var absOffset = Math.abs(offset);
        var focusStrength = clamp(1 - absOffset * 1.6, 0, 1);
        var tiltAmount = clamp(absOffset * 8.5, 0, 5.5);
        var rotateX = offset < 0 ? -tiltAmount : tiltAmount;
        var scale = card === focusedCard ? 1.018 : (0.998 - absOffset * 0.015);
        var rise = card === focusedCard ? -5 : (absOffset * 1.2);

        card.style.transform =
          'perspective(980px) rotateX(' + rotateX + 'deg) rotateY(0deg) translateY(' +
          rise + 'px) scale(' + scale + ')';

        card.style.setProperty('--lx', clamp(50 + (-offset * 16), 28, 72) + '%');
        card.style.setProperty('--ly', (36 + focusStrength * 7) + '%');
        card.style.setProperty('--light-angle', (136 + offset * 12) + 'deg');
        card.style.setProperty('--shine-strength', String(0.28 + focusStrength * 0.42));
        card.classList.add('is-mobile-tilting');
        card.classList.toggle('team-card--lift', card === focusedCard);
        card.classList.toggle('is-mobile-focus', card === focusedCard);
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
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

  function initMobileNav() {
    var btn = document.getElementById('nav-menu-toggle');
    var panel = document.getElementById('nav-mobile');
    if (!btn || !panel) return;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
      panel.hidden = !open;
    }

    btn.addEventListener('click', function () {
      setOpen(panel.hidden);
    });

    panel.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) setOpen(false);
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
    initMobileTeamScrollTilt();
    initNavHighlight();
    initMobileNav();
  });

})();
