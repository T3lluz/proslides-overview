/*
 * ============================================================
 *  RESOURCE CATALOG
 *  Add sections and items in `sections` below.
 *
 *  Item fields:
 *    type   — "file" | "link" | "image"
 *    title  — display name
 *    href   — path (files/images) or full URL (links)
 *    desc   — short description (optional)
 *    thumb    — preview for type "image" (optional; defaults to href)
 *    featured — wide preview card with in-page zoom viewer (images only)
 * ============================================================
 */
(function () {
  var sections = [
    {
      id: 'documents',
      label: 'Dokumenter',
      hint: 'PDF-er, rapporter og kontrakter',
      items: [
        {
          type: 'file',
          title: 'Bacheloroppgave 2026',
          href: 'docs/bacheloroppgave-2026.pdf',
          desc: 'Full bacheloroppgave — hovedkilde for prosjektet'
        },
        {
          type: 'file',
          title: 'BOP 2026',
          href: 'docs/bop2026.pdf',
          desc: 'Bacheloroppgave – prosjektbeskrivelse og plan'
        },
        {
          type: 'file',
          title: 'Samarbeidskontrakt',
          href: 'docs/samarbeidskontrakt.pdf',
          desc: 'Avtale om samarbeid og ansvarsfordeling i gruppen'
        }
      ]
    },
    {
      id: 'links',
      label: 'Lenker',
      hint: 'Eksterne ressurser og verktøy',
      items: [
        {
          type: 'link',
          title: 'GitHub — prosjektrepo',
          href: 'https://github.com/Baitedr/Bachelor_Gruppe1',
          desc: 'Kildekode, issues og prosjektstruktur'
        },
        {
          type: 'link',
          title: 'Live-app',
          href: 'https://slides.rubynor.com/',
          desc: 'Deployet demonstrasjon av ProSlides'
        }
      ]
    },
    {
      id: 'media',
      label: 'Bilder & media',
      hint: 'Skjermbilder, diagrammer og illustrasjoner',
      items: [
        {
          type: 'image',
          featured: true,
          title: 'Applikasjonsflyt — kilde',
          href: 'assets/flytdiagram-proslides.png?v=2',
          desc: 'Flytdiagram over autentisering, dashboard, live-sesjon og deltakerflyt. Utviklet som referansekilde for implementasjon.'
        }
      ]
    }
  ];

  var TYPE_META = {
    file:  { label: 'Fil' },
    link:  { label: 'Lenke' },
    image: { label: 'Bilde' }
  };

  var ICONS = {
    file:
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />' +
      '</svg>',
    link:
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86 2.121a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757" />' +
      '</svg>',
    image:
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />' +
      '</svg>'
  };

  var BTN =
    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition ';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function basename(path) {
    try {
      var u = new URL(path, window.location.href);
      var p = u.pathname.split('/').filter(Boolean);
      return p[p.length - 1] || path;
    } catch (e) {
      var parts = path.split('/');
      return parts[parts.length - 1] || path;
    }
  }

  function resolveHref(href) {
    return new URL(href, window.location.href).href;
  }

  function uriLabel(item) {
    if (item.type === 'link') {
      try {
        return new URL(item.href).hostname.replace(/^www\./, '');
      } catch (e) {
        return item.href;
      }
    }
    return basename(item.href);
  }

  function extensionLabel(item) {
    var name = basename(item.href);
    var dot = name.lastIndexOf('.');
    if (dot === -1) return '';
    return name.slice(dot + 1).toUpperCase();
  }

  function buildActions(item, url, filename) {
    var html = '';

    if (item.type === 'file' || item.type === 'image') {
      html +=
        '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" ' +
        'class="doc-action doc-open-btn ' + BTN +
        'text-[color:var(--secondary-foreground)] bg-[var(--secondary)] hover:opacity-90">Åpne</a>';
      html +=
        '<a href="' + esc(url) + '" download="' + esc(filename) + '" ' +
        'class="doc-action doc-download-btn ' + BTN +
        'text-[color:var(--primary)] bg-[var(--accent)] hover:opacity-90">Last ned</a>';
    } else {
      html +=
        '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" ' +
        'class="doc-action doc-open-btn ' + BTN +
        'text-[color:var(--primary)] bg-[var(--accent)] hover:opacity-90">Besøk lenke</a>';
    }

    return html;
  }

  var imageViewer = null;

  function ensureImageViewer() {
    if (imageViewer) return imageViewer;

    var root = document.createElement('div');
    root.id = 'doc-image-viewer';
    root.className = 'doc-image-viewer';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Bildevisning');
    root.innerHTML =
      '<button type="button" class="doc-image-viewer__backdrop" data-viewer-close aria-label="Lukk"></button>' +
      '<div class="doc-image-viewer__panel">' +
        '<header class="doc-image-viewer__bar">' +
          '<p class="doc-image-viewer__title" data-viewer-title></p>' +
          '<div class="doc-image-viewer__tools">' +
            '<button type="button" class="doc-image-viewer__btn" data-viewer-action="zoom-out" aria-label="Zoom ut" title="Zoom ut">' +
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M5 12h14"/></svg>' +
            '</button>' +
            '<span class="doc-image-viewer__zoom" data-viewer-zoom>100%</span>' +
            '<button type="button" class="doc-image-viewer__btn" data-viewer-action="zoom-in" aria-label="Zoom inn" title="Zoom inn">' +
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>' +
            '</button>' +
            '<button type="button" class="doc-image-viewer__btn" data-viewer-action="reset" aria-label="Tilpass vindu" title="Tilpass vindu">' +
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5M20.25 20.25v-4.5m0 4.5h-4.5M3.75 20.25h4.5m-4.5 0v-4.5M20.25 3.75h-4.5m4.5 0v4.5"/></svg>' +
            '</button>' +
            '<button type="button" class="doc-image-viewer__btn doc-image-viewer__btn--close" data-viewer-close aria-label="Lukk" title="Lukk (Esc)">' +
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M6 18 18 6M6 6l12 12"/></svg>' +
            '</button>' +
          '</div>' +
        '</header>' +
        '<div class="doc-image-viewer__viewport" data-viewer-viewport tabindex="-1">' +
          '<img class="doc-image-viewer__img" data-viewer-img alt="" draggable="false" />' +
        '</div>' +
        '<p class="doc-image-viewer__hint">Scroll for zoom · dra for å panore · Esc for å lukke</p>' +
      '</div>';

    document.body.appendChild(root);

    var viewport = root.querySelector('[data-viewer-viewport]');
    var img      = root.querySelector('[data-viewer-img]');
    var zoomEl   = root.querySelector('[data-viewer-zoom]');
    var titleEl  = root.querySelector('[data-viewer-title]');
    var state    = { scale: 1, tx: 0, ty: 0, minScale: 0.2, maxScale: 6 };
    var dragging = false;
    var dragStart = { x: 0, y: 0, tx: 0, ty: 0 };
    var lastFocus = null;

    function applyTransform() {
      img.style.transform = 'translate(' + state.tx + 'px,' + state.ty + 'px) scale(' + state.scale + ')';
      if (zoomEl) zoomEl.textContent = Math.round(state.scale * 100) + '%';
    }

    function fitImage() {
      if (!img.naturalWidth) return;
      var vw = viewport.clientWidth;
      var vh = viewport.clientHeight;
      var s = Math.min(vw / img.naturalWidth, vh / img.naturalHeight, 1);
      state.scale = s;
      state.tx = (vw - img.naturalWidth * s) / 2;
      state.ty = (vh - img.naturalHeight * s) / 2;
      applyTransform();
    }

    function zoomAt(factor, cx, cy) {
      var rect = viewport.getBoundingClientRect();
      var mx = (cx != null ? cx : rect.left + rect.width / 2) - rect.left;
      var my = (cy != null ? cy : rect.top + rect.height / 2) - rect.top;
      var next = Math.min(state.maxScale, Math.max(state.minScale, state.scale * factor));
      var ratio = next / state.scale;
      state.tx = mx - (mx - state.tx) * ratio;
      state.ty = my - (my - state.ty) * ratio;
      state.scale = next;
      applyTransform();
    }

    function closeViewer() {
      root.hidden = true;
      root.classList.remove('is-open');
      document.body.classList.remove('doc-image-viewer-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    }

    function openViewer(src, title) {
      lastFocus = document.activeElement;
      titleEl.textContent = title || '';
      img.onload = function () {
        fitImage();
        viewport.focus({ preventScroll: true });
      };
      img.src = src;
      if (img.complete) img.onload();
      root.hidden = false;
      root.classList.add('is-open');
      document.body.classList.add('doc-image-viewer-open');
    }

    root.querySelectorAll('[data-viewer-close]').forEach(function (btn) {
      btn.addEventListener('click', closeViewer);
    });

    root.querySelectorAll('[data-viewer-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-viewer-action');
        if (action === 'zoom-in') zoomAt(1.25);
        else if (action === 'zoom-out') zoomAt(1 / 1.25);
        else if (action === 'reset') fitImage();
      });
    });

    viewport.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoomAt(factor, e.clientX, e.clientY);
    }, { passive: false });

    viewport.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      dragStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add('is-dragging');
    });

    viewport.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      state.tx = dragStart.tx + (e.clientX - dragStart.x);
      state.ty = dragStart.ty + (e.clientY - dragStart.y);
      applyTransform();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      try { viewport.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    document.addEventListener('keydown', function (e) {
      if (root.hidden) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeViewer();
      }
    });

    imageViewer = { open: openViewer, close: closeViewer };
    return imageViewer;
  }

  function openImageViewer(url, title) {
    ensureImageViewer().open(url, title);
  }

  function imageThumbSrc(item) {
    return resolveHref(item.thumb || item.href);
  }

  function buildCard(item) {
    var type = TYPE_META[item.type] ? item.type : 'file';
    var url = resolveHref(item.href);
    var uri = uriLabel(item);
    var ext = extensionLabel(item);
    var filename = basename(item.href);
    var typeLabel = TYPE_META[type].label;
    var featured = type === 'image' && item.featured;
    var thumbSrc = type === 'image' ? imageThumbSrc(item) : '';

    var card = document.createElement('article');
    card.className = 'doc-card doc-card--' + type + (featured ? ' doc-card--featured' : '');
    card.dataset.resourceType = type;

    if (featured) {
      card.innerHTML =
        '<div class="doc-card-featured-top">' +
          '<div class="doc-card-labels">' +
            '<span class="doc-type-badge doc-type-badge--source">Kilde</span>' +
            '<span class="doc-type-badge">' + esc(typeLabel) + '</span>' +
            (ext ? '<span class="doc-ext-badge">' + esc(ext) + '</span>' : '') +
          '</div>' +
          '<h3 class="doc-card-title">' + esc(item.title) + '</h3>' +
        '</div>' +
        '<button type="button" class="doc-card-featured-preview" data-image-open aria-label="Åpne ' + esc(item.title) + ' i fullskjerm">' +
          '<img src="' + esc(thumbSrc) + '" alt="" loading="lazy" class="doc-featured-img" />' +
          '<span class="doc-preview-hint">' +
            '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"/></svg>' +
            'Fullskjerm' +
          '</span>' +
        '</button>' +
        '<div class="doc-card-featured-body">' +
          (item.desc ? '<p class="doc-card-desc">' + esc(item.desc) + '</p>' : '') +
          '<p class="doc-uri" title="' + esc(uri) + '">' + esc(uri) + '</p>' +
          '<div class="doc-actions">' + buildActions(item, url, filename) + '</div>' +
        '</div>';
    } else {
      var thumbInner;
      if (type === 'image') {
        thumbInner =
          '<img class="doc-thumb-img" src="' + esc(thumbSrc) + '" alt="" loading="lazy" />';
      } else {
        thumbInner = ICONS[type] || ICONS.file;
      }

      card.innerHTML =
        '<div class="doc-card-top">' +
          '<div class="doc-thumb doc-thumb--' + type + '" aria-hidden="true">' + thumbInner + '</div>' +
          '<div class="doc-card-meta min-w-0 flex-1">' +
            '<div class="doc-card-labels">' +
              '<span class="doc-type-badge">' + esc(typeLabel) + '</span>' +
              (ext ? '<span class="doc-ext-badge">' + esc(ext) + '</span>' : '') +
            '</div>' +
            '<h3 class="doc-card-title">' + esc(item.title) + '</h3>' +
            '<p class="doc-uri" title="' + esc(uri) + '">' + esc(uri) + '</p>' +
          '</div>' +
        '</div>' +
        (item.desc ? '<p class="doc-card-desc">' + esc(item.desc) + '</p>' : '') +
        '<div class="doc-actions">' + buildActions(item, url, filename) + '</div>';
    }

    card.addEventListener('click', function (e) {
      if (e.target.closest('.doc-action')) return;
      if (type === 'image') {
        openImageViewer(url, item.title);
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    card.querySelectorAll('[data-image-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openImageViewer(url, item.title);
      });
    });

    card.querySelectorAll('.doc-action').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (type === 'image' && btn.classList.contains('doc-open-btn')) {
          e.preventDefault();
          openImageViewer(url, item.title);
        }
      });
    });

    return card;
  }

  var catalog = document.getElementById('docs-catalog');
  var empty   = document.getElementById('docs-empty');
  if (!catalog) return;

  var totalItems = 0;

  sections.forEach(function (section) {
    if (!section.items || !section.items.length) return;
    totalItems += section.items.length;

    var block = document.createElement('section');
    block.className = 'doc-section';
    block.id = 'doc-section-' + section.id;
    block.innerHTML =
      '<header class="doc-section-head">' +
        '<div class="doc-section-head-text">' +
          '<h3 class="doc-section-title">' + esc(section.label) + '</h3>' +
          (section.hint
            ? '<p class="doc-section-hint">' + esc(section.hint) + '</p>'
            : '') +
        '</div>' +
        '<span class="doc-section-count">' + section.items.length + '</span>' +
      '</header>' +
      '<div class="doc-section-grid"></div>';

    var grid = block.querySelector('.doc-section-grid');
    section.items.forEach(function (item) {
      grid.appendChild(buildCard(item));
    });

    catalog.appendChild(block);
  });

  if (totalItems === 0) {
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');

  if (window.ProSlides && window.ProSlides.initDocCards) {
    window.ProSlides.initDocCards();
  }
})();
