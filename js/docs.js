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
 *    thumb  — preview for type "image" (optional)
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
      items: []
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

  function buildCard(item) {
    var type = TYPE_META[item.type] ? item.type : 'file';
    var url = resolveHref(item.href);
    var uri = uriLabel(item);
    var ext = extensionLabel(item);
    var filename = basename(item.href);
    var typeLabel = TYPE_META[type].label;

    var thumbInner;
    if (type === 'image' && item.thumb) {
      thumbInner =
        '<img class="doc-thumb-img" src="' + esc(resolveHref(item.thumb)) + '" alt="" loading="lazy" />';
    } else {
      thumbInner = ICONS[type] || ICONS.file;
    }

    var card = document.createElement('article');
    card.className = 'doc-card doc-card--' + type;
    card.dataset.resourceType = type;
    card.innerHTML =
      '<div class="doc-card-top">' +
        '<div class="doc-thumb doc-thumb--' + type + '" aria-hidden="true">' + thumbInner + '</div>' +
        '<div class="doc-card-meta min-w-0 flex-1">' +
          '<div class="doc-card-labels">' +
            '<span class="doc-type-badge">' + esc(typeLabel) + '</span>' +
            (ext
              ? '<span class="doc-ext-badge">' + esc(ext) + '</span>'
              : '') +
          '</div>' +
          '<h3 class="doc-card-title">' + esc(item.title) + '</h3>' +
          '<p class="doc-uri" title="' + esc(uri) + '">' + esc(uri) + '</p>' +
        '</div>' +
      '</div>' +
      (item.desc
        ? '<p class="doc-card-desc">' + esc(item.desc) + '</p>'
        : '') +
      '<div class="doc-actions">' + buildActions(item, url, filename) + '</div>';

    card.addEventListener('click', function (e) {
      if (e.target.closest('.doc-action')) return;
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    card.querySelectorAll('.doc-action').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
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
