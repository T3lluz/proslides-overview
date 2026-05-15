/*
 * ============================================================
 *  DOCUMENTATION LIST
 *  Add or remove documents by editing this array.
 *  Each entry needs: title, file (path relative to index.html), desc.
 *  Icons are optional (default: document icon).
 * ============================================================
 */
(function () {
  var docs = [
    // { title: "Prosjektrapport", file: "docs/rapport.pdf", desc: "Hovedrapport for bachelorprosjektet" },
    // { title: "API Dokumentasjon", file: "docs/api.pdf", desc: "REST API-referanse for backend" },
    // { title: "Brukerveiledning", file: "docs/brukerveiledning.pdf", desc: "Guide for sluttbrukere" },
  ];

  var grid  = document.getElementById('docs-grid');
  var empty = document.getElementById('docs-empty');
  if (!grid) return;

  if (docs.length === 0) {
    if (empty) empty.classList.remove('hidden');
    return;
  }

  docs.forEach(function (doc) {
    var card = document.createElement('a');
    card.href = doc.file;
    card.target = '_blank';
    card.className = 'group rounded-xl border border-[color:var(--border)] bg-[var(--card)] p-6 hover:shadow-md hover:border-[color:var(--primary)] transition flex flex-col';
    card.innerHTML =
      '<div class="flex items-center gap-3 mb-3">' +
        '<svg class="w-8 h-8 text-[color:var(--primary)] shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">' +
          '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />' +
        '</svg>' +
        '<h3 class="font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition">' + doc.title + '</h3>' +
      '</div>' +
      '<p class="text-sm text-[color:var(--muted-foreground)]">' + doc.desc + '</p>';
    grid.appendChild(card);
  });
})();
