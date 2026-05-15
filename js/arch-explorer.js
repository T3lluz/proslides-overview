/* Architecture Explorer — pan / zoom, tab switching, node detail panel */
(function () {
  var explorer = document.getElementById('architecture-explorer');
  if (!explorer) return;

  var tabButtons  = Array.prototype.slice.call(explorer.querySelectorAll('[data-arch-tab]'));
  var panels      = Array.prototype.slice.call(explorer.querySelectorAll('[data-arch-panel]'));
  var toolbar     = explorer.querySelector('.arch-toolbar');
  var hint        = explorer.querySelector('[data-arch-hint]');
  var zoomLabel   = explorer.querySelector('[data-zoom-label]');
  var detailTitle = explorer.querySelector('[data-arch-detail-title]');
  var detailDesc  = explorer.querySelector('[data-arch-detail-desc]');
  var detailMeta  = explorer.querySelector('[data-arch-detail-meta]');
  var detailLabel = explorer.querySelector('[data-arch-detail-label]');
  var detailLink  = explorer.querySelector('[data-arch-detail-link]');

  var MIN_SCALE = 0.4;
  var MAX_SCALE = 3;

  function getInteractives(panel) {
    return Array.prototype.slice.call(panel.querySelectorAll('.diagram-node, .tree-row, .api-row'));
  }

  /* Per-panel pan/zoom state */
  var panelStates = new WeakMap();
  function getState(panel) {
    var s = panelStates.get(panel);
    if (!s) { s = { scale: 1, tx: 0, ty: 0 }; panelStates.set(panel, s); }
    return s;
  }

  function applyTransform(panel) {
    var svg      = panel.querySelector('.arch-svg');
    if (!svg) return;
    var viewport = svg.querySelector('.arch-viewport');
    if (!viewport) return;
    var s = getState(panel);
    viewport.setAttribute('transform', 'translate(' + s.tx + ' ' + s.ty + ') scale(' + s.scale + ')');
    if (zoomLabel) zoomLabel.textContent = Math.round(s.scale * 100) + '%';
  }

  function activePanel() {
    return explorer.querySelector('.arch-panel.is-active');
  }

  function panelLabelFor(panel) {
    if (!panel) return 'Valgt komponent';
    return ({
      system:    'Valgt komponent',
      flow:      'Valgt steg',
      er:        'Valgt entitet',
      structure: 'Valgt sti',
      api:       'Valgt endepunkt'
    })[panel.getAttribute('data-arch-panel')] || 'Valgt komponent';
  }

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function activateNode(node) {
    var panel = node.closest('.arch-panel');
    if (!panel) return;
    getInteractives(panel).forEach(function (n) { n.classList.toggle('is-active', n === node); });

    if (detailLabel) detailLabel.textContent = panelLabelFor(panel);
    if (detailTitle) detailTitle.textContent  = node.getAttribute('data-node-title') || '';
    if (detailDesc)  detailDesc.textContent   = node.getAttribute('data-node-desc')  || '';

    if (detailMeta) {
      detailMeta.innerHTML = '';
      var raw = node.getAttribute('data-node-meta');
      var meta = null;
      if (raw) { try { meta = JSON.parse(raw); } catch (_) { meta = null; } }
      if (meta && typeof meta === 'object') {
        Object.keys(meta).forEach(function (key) {
          var row = document.createElement('div');
          row.innerHTML = '<dt>' + esc(key) + '</dt><dd>' + esc(meta[key]) + '</dd>';
          detailMeta.appendChild(row);
        });
      }
      /* Fallback for browsers without :has() support */
      detailMeta.parentElement && detailMeta.parentElement.classList.toggle(
        'detail-meta-empty', !meta || !Object.keys(meta).length
      );
    }

    if (detailLink) {
      var href = node.getAttribute('data-node-href') || '';
      if (href) {
        detailLink.href = href;
        detailLink.classList.add('is-visible');
      } else {
        detailLink.href = '#';
        detailLink.classList.remove('is-visible');
      }
    }
  }

  function activateFirstNode(panel) {
    if (!panel) return;
    var first =
      panel.querySelector('.diagram-node.is-active, .tree-row.is-active, .api-row.is-active') ||
      panel.querySelector('.diagram-node, .tree-row[data-tree-leaf], .tree-row, .api-row');
    if (first) activateNode(first);
  }

  function activateTab(tabName) {
    tabButtons.forEach(function (btn) {
      var active = btn.getAttribute('data-arch-tab') === tabName;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-arch-panel') === tabName);
    });

    var panel  = activePanel();
    var hasSvg = !!(panel && panel.querySelector('.arch-svg'));
    if (toolbar) toolbar.style.display = hasSvg ? '' : 'none';
    if (hint)    hint.style.display    = hasSvg ? '' : 'none';
    if (hint)    hint.classList.remove('is-dismissed');

    if (panel) applyTransform(panel);
    activateFirstNode(panel);
  }

  /* Tab button events */
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { activateTab(btn.getAttribute('data-arch-tab')); });
    btn.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      var idx  = tabButtons.indexOf(btn);
      var next = event.key === 'ArrowRight' ? idx + 1 : idx - 1;
      if (next < 0) next = tabButtons.length - 1;
      if (next >= tabButtons.length) next = 0;
      tabButtons[next].focus();
      activateTab(tabButtons[next].getAttribute('data-arch-tab'));
    });
  });

  /* Wire interactive elements */
  explorer.querySelectorAll('.diagram-node, .tree-row, .api-row').forEach(function (el) {
    if (el.tagName !== 'BUTTON') {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
    }
    el.addEventListener('click', function (event) {
      /* Let GH links inside api-rows bubble out without activating the node */
      if (event.target.closest('.api-gh')) return;
      if (el._suppressClick) { el._suppressClick = false; return; }
      if (el.hasAttribute('data-tree-toggle')) {
        var node = el.parentElement;
        if (node) {
          var open = node.classList.toggle('is-open');
          el.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
      }
      activateNode(el);
    });
    el.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); el.click();
      } else if (el.hasAttribute('data-tree-toggle') && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault();
        var node = el.parentElement;
        if (!node) return;
        if (event.key === 'ArrowRight') node.classList.add('is-open');
        else node.classList.remove('is-open');
        el.setAttribute('aria-expanded', node.classList.contains('is-open') ? 'true' : 'false');
      }
    });
    if (el.hasAttribute('data-tree-toggle')) {
      var node = el.parentElement;
      el.setAttribute('aria-expanded', node && node.classList.contains('is-open') ? 'true' : 'false');
    }
  });

  /* "Fold ut alt" / "Fold sammen" */
  explorer.querySelectorAll('[data-tree-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var action = btn.getAttribute('data-tree-action');
      var sp = explorer.querySelector('.arch-panel[data-arch-panel="structure"]');
      if (!sp) return;
      sp.querySelectorAll('.tree-node').forEach(function (node) {
        var toggle = node.querySelector(':scope > .tree-row[data-tree-toggle]');
        if (!toggle) return;
        if (action === 'expand') node.classList.add('is-open');
        else node.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', node.classList.contains('is-open') ? 'true' : 'false');
      });
    });
  });

  /* Pan / zoom for SVG panels */
  function setupPanZoom(panel) {
    var svg = panel.querySelector('.arch-svg');
    if (!svg) return;
    var state  = getState(panel);
    var drag   = false;
    var moved  = false;
    var startX = 0, startY = 0, startTx = 0, startTy = 0;
    var ptrId  = null;

    function px2user(dx, dy) {
      var rect = svg.getBoundingClientRect();
      var vb   = svg.viewBox.baseVal;
      if (!rect.width || !vb.width) return [0, 0];
      return [dx * vb.width / rect.width, dy * vb.height / rect.height];
    }

    svg.addEventListener('pointerdown', function (e) {
      if (e.button && e.button !== 0) return;
      if (e.target.closest('.diagram-node')) return;
      drag  = true; moved = false;
      startX = e.clientX; startY = e.clientY;
      startTx = state.tx; startTy = state.ty;
      ptrId = e.pointerId;
      svg.classList.add('is-panning');
      if (hint) hint.classList.add('is-dismissed');
      try { svg.setPointerCapture(ptrId); } catch (_) {}
    });

    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      var u = px2user(dx, dy);
      state.tx = startTx + u[0];
      state.ty = startTy + u[1];
      applyTransform(panel);
    });

    function endDrag(e) {
      if (!drag) return;
      drag = false;
      svg.classList.remove('is-panning');
      try { if (ptrId !== null) svg.releasePointerCapture(ptrId); } catch (_) {}
      ptrId = null;
      if (moved) {
        var t = e.target.closest('.diagram-node');
        if (t) t._suppressClick = true;
      }
    }
    svg.addEventListener('pointerup',     endDrag);
    svg.addEventListener('pointercancel', endDrag);
    svg.addEventListener('pointerleave',  function (e) { if (drag) endDrag(e); });

    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor   = Math.exp(-e.deltaY * 0.0018);
      var newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, state.scale * factor));
      if (newScale === state.scale) return;
      var rect = svg.getBoundingClientRect();
      var vb   = svg.viewBox.baseVal;
      var mx   = (e.clientX - rect.left) * vb.width  / rect.width;
      var my   = (e.clientY - rect.top)  * vb.height / rect.height;
      state.tx = mx - (mx - state.tx) * (newScale / state.scale);
      state.ty = my - (my - state.ty) * (newScale / state.scale);
      state.scale = newScale;
      applyTransform(panel);
      if (hint) hint.classList.add('is-dismissed');
    }, { passive: false });
  }

  panels.forEach(setupPanZoom);

  function zoomCentered(panel, factor) {
    var svg = panel.querySelector('.arch-svg');
    if (!svg) return;
    var s        = getState(panel);
    var newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s.scale * factor));
    if (newScale === s.scale) return;
    var vb = svg.viewBox.baseVal;
    var cx = vb.width / 2, cy = vb.height / 2;
    s.tx = cx - (cx - s.tx) * (newScale / s.scale);
    s.ty = cy - (cy - s.ty) * (newScale / s.scale);
    s.scale = newScale;
    applyTransform(panel);
  }

  function resetView(panel) {
    var s = getState(panel);
    s.scale = 1; s.tx = 0; s.ty = 0;
    applyTransform(panel);
  }

  if (toolbar) {
    toolbar.querySelectorAll('[data-pan-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel  = activePanel();
        if (!panel) return;
        var action = btn.getAttribute('data-pan-action');
        if (action === 'zoom-in')           zoomCentered(panel, 1.25);
        else if (action === 'zoom-out')     zoomCentered(panel, 1 / 1.25);
        else if (action === 'reset' || action === 'fit') resetView(panel);
      });
    });
  }

  /* Init */
  var initialBtn = explorer.querySelector('.arch-tab-btn.is-active');
  activateTab(initialBtn ? initialBtn.getAttribute('data-arch-tab') : 'system');
})();
