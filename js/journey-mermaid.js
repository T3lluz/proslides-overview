/* Flytdiagram — pre-rendered SVG fra diagrams/flytdiagram.mmd + app-tema */
(function () {
  var container = document.getElementById('journey-mermaid');
  if (!container) return;

  var META = window.JOURNEY_NODE_META || {};
  var LINE = '#6b6b72';
  var LINE_WS = '#7c5cc4';
  var CLUSTER_FILL = 'rgba(235, 235, 236, 0.45)';
  var CLUSTER_FILL_PART = 'rgba(235, 233, 245, 0.55)';

  function themeColors() {
    return {
      line: LINE,
      lineWs: LINE_WS,
      card: '#ffffff',
      muted: '#6b6b72',
      clusterFill: CLUSTER_FILL,
      clusterFillPart: CLUSTER_FILL_PART
    };
  }

  function applyEdgeGraphics(svg, colors) {
    svg.querySelectorAll('path.flowchart-link').forEach(function (p) {
      var dotted = p.classList.contains('edge-pattern-dotted');
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', dotted ? colors.lineWs : colors.line);
      p.setAttribute('stroke-width', '1.6');
      p.style.stroke = dotted ? colors.lineWs : colors.line;
      p.style.fill = 'none';
      if (dotted) {
        p.setAttribute('stroke-dasharray', '7 5');
        p.style.strokeDasharray = '7 5';
      }
    });

    svg.querySelectorAll('.arrowheadPath, .arrowMarkerPath').forEach(function (p) {
      p.setAttribute('fill', colors.line);
      p.setAttribute('stroke', colors.line);
    });

    svg.querySelectorAll('.edgeLabel span, .edgeLabel p, .edgeLabel text').forEach(function (el) {
      el.style.color = colors.muted;
      el.style.fill = colors.muted;
    });
    svg.querySelectorAll('.edgeLabel rect').forEach(function (r) {
      r.setAttribute('fill', colors.card);
      r.setAttribute('opacity', '0.95');
    });
  }

  function styleClusters(svg, colors) {
    var padX = 16;
    var padY = 20;
    svg.querySelectorAll('g.cluster').forEach(function (cluster) {
      var rect = cluster.querySelector(':scope > rect');
      var label = cluster.querySelector(':scope > g.cluster-label');
      if (!rect) return;

      var x = parseFloat(rect.getAttribute('x') || '0');
      var y = parseFloat(rect.getAttribute('y') || '0');

      var isPart = (cluster.id || '').indexOf('PART') !== -1;
      var fill = isPart ? colors.clusterFillPart : colors.clusterFill;
      rect.setAttribute('fill', fill);
      rect.setAttribute('stroke', colors.lineWs);
      rect.setAttribute('stroke-width', '1.4');
      rect.setAttribute('stroke-dasharray', '7 5');
      rect.style.fill = fill;
      rect.style.stroke = colors.lineWs;
      rect.style.strokeDasharray = '7 5';

      if (label) {
        label.setAttribute('transform', 'translate(' + (x + padX) + ' ' + (y + padY) + ')');
        var fo = label.querySelector('foreignObject');
        var div = fo && fo.querySelector('div');
        if (fo) {
          var text = (fo.textContent || '').trim();
          var minW = Math.max(200, text.length * 8);
          fo.setAttribute('width', String(minW));
          fo.setAttribute('height', '28');
          fo.style.overflow = 'visible';
        }
        if (div) {
          div.style.textAlign = 'left';
          div.style.display = 'block';
          div.style.overflow = 'visible';
          div.style.whiteSpace = 'nowrap';
        }
      }
    });
  }

  function reorderEdgeLayers(svg) {
    var root = svg.querySelector('g.root');
    if (!root) return;
    var edgePaths = root.querySelector('g.edgePaths');
    var edgeLabels = root.querySelector('g.edgeLabels');
    if (edgePaths) root.appendChild(edgePaths);
    if (edgeLabels) root.appendChild(edgeLabels);
  }

  function findNodeGroup(svg, id) {
    var exact = svg.querySelector('#flowchart-' + id + '-0, #flowchart-' + id);
    if (exact) return exact;
    return Array.prototype.find.call(svg.querySelectorAll('g.node'), function (g) {
      return g.id && (g.id.indexOf('flowchart-' + id + '-') === 0 || g.id.indexOf('-' + id + '-') !== -1);
    }) || null;
  }

  function decorateNodes(svg) {
    Object.keys(META).forEach(function (id) {
      var info = META[id];
      var g = findNodeGroup(svg, id);
      if (!g) return;

      g.classList.add('diagram-node');
      if (info.active) g.classList.add('is-active');
      if (id === 'visit' || id === 'part_open' || id === 'part_out' || id === 'term_login') {
        g.classList.add('diagram-node-terminal');
      } else if (['has', 'valid', 'login_m', 'creds', 'oauth_ok', 'action', 'profil', 'poll', 'part_auth'].indexOf(id) !== -1) {
        g.classList.add('diagram-node-decision');
      }

      g.setAttribute('data-node-title', info.title || id);
      g.setAttribute('data-node-desc', info.desc || '');
      if (info.meta) g.setAttribute('data-node-meta', JSON.stringify(info.meta));
      if (info.href) g.setAttribute('data-node-href', info.href);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.style.cursor = 'pointer';
    });
  }

  function prepareSvg(svg) {
    var colors = themeColors();
    svg.classList.add('arch-svg', 'arch-svg-journey', 'arch-svg-mermaid');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.setProperty('--journey-line', colors.line);
    svg.style.setProperty('--journey-line-ws', colors.lineWs);
    svg.style.setProperty('--journey-label', colors.muted);

    var viewport = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    viewport.classList.add('arch-viewport');

    Array.from(svg.childNodes).forEach(function (child) {
      if (child.nodeType !== 1) return;
      var tag = child.tagName.toLowerCase();
      if (tag === 'style' || tag === 'defs') return;
      viewport.appendChild(child);
    });
    svg.appendChild(viewport);

    reorderEdgeLayers(svg);
    styleClusters(svg, colors);
    applyEdgeGraphics(svg, colors);
    decorateNodes(svg);
    return svg;
  }

  function showError(msg) {
    container.innerHTML =
      '<div class="arch-mermaid-fallback">' +
      '<p class="arch-mermaid-fallback-title">Kunne ikke laste flytdiagram</p>' +
      '<p class="arch-mermaid-fallback-desc">' + msg + '</p>' +
      '<a class="arch-mermaid-fallback-link" href="assets/flytdiagram-proslides.png" target="_blank" rel="noopener">Åpne referansebilde</a>' +
      '</div>';
  }

  container.setAttribute('aria-busy', 'true');
  container.innerHTML = '<p class="arch-mermaid-loading">Laster flytdiagram…</p>';

  fetch('diagrams/flytdiagram.svg')
    .then(function (r) {
      if (!r.ok) throw new Error('diagrams/flytdiagram.svg (' + r.status + ')');
      return r.text();
    })
    .then(function (svgText) {
      container.innerHTML = svgText;
      container.removeAttribute('aria-busy');
      var svg = container.querySelector('svg');
      if (!svg) throw new Error('Tom SVG');
      prepareSvg(svg);
      document.dispatchEvent(new CustomEvent('arch-journey-rendered', {
        detail: { panel: container.closest('[data-arch-panel]') }
      }));
    })
    .catch(function (err) {
      container.removeAttribute('aria-busy');
      showError(err && err.message ? err.message : 'Ukjent feil');
      console.error('[journey-mermaid]', err);
    });
})();
