#!/usr/bin/env python3
"""Add data-i18n attributes to index.html (idempotent-ish replacements)."""
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "index.html"
html = p.read_text(encoding="utf-8")

replacements = [
    # head locale boot — insert after animations boot
    (
        "    })();\n  </script>\n  <meta charset",
        "    })();\n  </script>\n  <script>\n    (function () {\n      try {\n        var loc = localStorage.getItem('proslides-overview-locale');\n        if (loc === 'en' || loc === 'no') document.documentElement.setAttribute('data-locale', loc);\n      } catch (e) {}\n    })();\n  </script>\n  <meta charset",
    ),
    # nav controls class + locale toggle
    (
        '      <motion-toggle.js\n        <a href="#about"',
        '      <div class="nav-controls flex items-center gap-2 shrink-0">\n        <button type="button" id="locale-toggle" class="nav-lang-toggle" aria-pressed="false" aria-label="Bytt språk til engelsk">EN</button>\n        <a href="#about"',
    ),
    # fix accidental corruption if any — use actual nav structure
    (
        '      <motion-toggle.js\n        <a href="#about"',
        '      <motion-toggle.js\n        <a href="#about"',
    ),
]

# Real replacements
pairs = [
    ('class="flex items-center gap-2 shrink-0">', 'class="nav-controls flex items-center gap-2 shrink-0">'),
    (
        '<button\n        type="button"\n        id="nav-menu-toggle"',
        '<button type="button" id="locale-toggle" class="nav-lang-toggle" aria-pressed="false" aria-label="Bytt språk til engelsk">EN</button>\n      <button\n        type="button"\n        id="nav-menu-toggle"',
    ),
    ('<a href="#about" class="hover:text', '<a href="#about" data-i18n="nav.about" class="hover:text'),
    ('<a href="#tech" class="hover:text', '<a href="#tech" data-i18n="nav.tech" class="hover:text'),
    ('<a href="#architecture" class="hover:text', '<a href="#architecture" data-i18n="nav.architecture" class="hover:text'),
    ('<a href="#team" class="hover:text', '<a href="#team" data-i18n="nav.team" class="hover:text'),
    ('<a href="#timeline" class="hover:text', '<a href="#timeline" data-i18n="nav.timeline" class="hover:text'),
    ('aria-label="Åpne meny"', 'data-i18n-aria="nav.openMenu" aria-label="Åpne meny"'),
    ('<span class="nav-anim-toggle__name">Animasjon</span>', '<span class="nav-anim-toggle__name" data-i18n="motion.name">Animasjon</span>'),
    ('id="animations-toggle-status">På</span>', 'id="animations-toggle-status" data-i18n="motion.on">På</span>'),
    ('id="animations-toggle-label">Animasjoner på</span>', 'id="animations-toggle-label" data-i18n="motion.onDetail">Animasjoner på</span>'),
    ('aria-label="Slå av animasjoner"', 'data-i18n-aria="motion.ariaOff" aria-label="Slå av animasjoner"'),
    ('<nav class="nav-mobile__links" aria-label="Sidemeny">', '<nav class="nav-mobile__links" data-i18n-aria="nav.mobileLabel" aria-label="Sidemeny">'),
    ('<a href="#about">Om prosjektet</a>', '<a href="#about" data-i18n="nav.about">Om prosjektet</a>'),
    ('<a href="#tech">Teknologi</a>', '<a href="#tech" data-i18n="nav.tech">Teknologi</a>'),
    ('<a href="#architecture">Arkitektur</a>', '<a href="#architecture" data-i18n="nav.architecture">Arkitektur</a>'),
    ('<a href="#team">Teamet</a>', '<a href="#team" data-i18n="nav.team">Teamet</a>'),
    ('<a href="#timeline">Tidslinje</a>', '<a href="#timeline" data-i18n="nav.timeline">Tidslinje</a>'),
    ('<span>Bachelorprosjekt 2026</span>', '<span data-i18n="hero.badge">Bachelorprosjekt 2026</span>'),
    ('<p class="hero-anim-sub section-desc', '<p class="hero-anim-sub section-desc" data-i18n="hero.desc"'),
    ('>Se live-appen\n        </a>', ' data-i18n="hero.liveApp">Se live-appen\n        </a>'),
    ('>Se kildekoden\n        </a>', ' data-i18n="hero.source">Se kildekoden\n        </a>'),
    ('<h2 class="section-title text-2xl sm:text-3xl">Se appen i aksjon</h2>', '<h2 class="section-title text-2xl sm:text-3xl" data-i18n="showcase.title">Se appen i aksjon</h2>'),
    ('<p class="section-desc text-sm sm:text-base mt-1">Dashboard · Editor · Live-presentasjon</p>', '<p class="section-desc text-sm sm:text-base mt-1" data-i18n="showcase.subtitle">Dashboard · Editor · Live-presentasjon</p>'),
    ('id="showcase-label-light" class="text-xs font-medium text-[color:var(--foreground)] showcase-lbl--active">Lyst</span>', 'id="showcase-label-light" class="text-xs font-medium text-[color:var(--foreground)] showcase-lbl--active" data-i18n="showcase.light">Lyst</span>'),
    ('id="showcase-label-dark" class="text-xs font-medium text-[color:var(--muted-foreground)]">Mørkt</span>', 'id="showcase-label-dark" class="text-xs font-medium text-[color:var(--muted-foreground)]" data-i18n="showcase.dark">Mørkt</span>'),
    ('aria-label="Bytt skjermbildetema"', 'data-i18n-aria="showcase.ariaTheme" aria-label="Bytt skjermbildetema"'),
    ('aria-label="Skjermbilder av ProSlides"', 'data-i18n-aria="showcase.ariaCarousel" aria-label="Skjermbilder av ProSlides"'),
    ('aria-label="Forrige skjermbilde"', 'data-i18n-aria="showcase.prev" aria-label="Forrige skjermbilde"'),
    ('aria-label="Neste skjermbilde"', 'data-i18n-aria="showcase.next" aria-label="Neste skjermbilde"'),
    ('data-tab="0">Dashboard</button>', 'data-tab="0" data-i18n="showcase.tab0">Dashboard</button>'),
    ('data-tab="1">Editor</button>', 'data-tab="1" data-i18n="showcase.tab1">Editor</button>'),
    ('data-tab="2">Live-presentasjon</button>', 'data-tab="2" data-i18n="showcase.tab2">Live-presentasjon</button>'),
    ('<h2 class="section-title">Om prosjektet</h2>', '<h2 class="section-title" data-i18n="about.title">Om prosjektet</h2>', 1),
    ('<p class="section-desc leading-relaxed">\n        RubyNor', '<p class="section-desc leading-relaxed" data-i18n-html="about.desc">\n        RubyNor', 1),
    ('>Problemstilling</p>', ' data-i18n="about.problemLabel">Problemstilling</p>', 1),
    ('italic" style="color: color-mix(in oklch, var(--foreground) 85%, var(--muted-foreground));">«Hvordan', 'italic" style="color: color-mix(in oklch, var(--foreground) 85%, var(--muted-foreground));" data-i18n="about.problemQuote">«Hvordan', 1),
    ('>Oppdragsgiver</p>', ' data-i18n="about.clientLabel">Oppdragsgiver</p>', 1),
    ('>RubyNor – Pål Andrè Sundt, CTO</p>', ' data-i18n="about.clientValue">RubyNor – Pål Andrè Sundt, CTO</p>', 1),
    ('>Veileder</p>', ' data-i18n="about.advisorLabel">Veileder</p>', 1),
    ('>Ingrid Sundbø – USN, campus Bø</p>', ' data-i18n="about.advisorValue">Ingrid Sundbø – USN, campus Bø</p>', 1),
    ('>Monorepo-struktur</h3>', ' data-i18n="about.monoTitle">Monorepo-struktur</h3>', 1),
    ('>Prosjektet er organisert som en monorepo med to hovedmapper:</p>', ' data-i18n="about.monoDesc">Prosjektet er organisert som en monorepo med to hovedmapper:</p>', 1),
    ('>Krav fra oppdragsgiver</h3>', ' data-i18n="about.reqTitle">Krav fra oppdragsgiver</h3>', 1),
    ('>Webbasert WYSIWYG-editor for slides</li>', ' data-i18n="about.req1">Webbasert WYSIWYG-editor for slides</li>', 1),
    ('>Dra-og-slipp for elementer (tekst, bilder, bakgrunn)</li>', ' data-i18n="about.req2">Dra-og-slipp for elementer (tekst, bilder, bakgrunn)</li>', 1),
    ('>Interaktive elementer (polls, spørsmål)</li>', ' data-i18n="about.req3">Interaktive elementer (polls, spørsmål)</li>', 1),
    ('>Sanntidskommunikasjon presentatør ↔ publikum</li>', ' data-i18n="about.req4">Sanntidskommunikasjon presentatør ↔ publikum</li>', 1),
    ('>Mobil deltakelse uten app/registrering</li>', ' data-i18n="about.req5">Mobil deltakelse uten app/registrering</li>', 1),
    ('>Responsivt grensesnitt (desktop + mobil)</li>', ' data-i18n="about.req6">Responsivt grensesnitt (desktop + mobil)</li>', 1),
    ('>Dynamisk bruk av publikumsdata i slides</li>', ' data-i18n="about.req7">Dynamisk bruk av publikumsdata i slides</li>', 1),
    ('>Elm ble anbefalt som frontend', ' data-i18n="about.reqFoot">Elm ble anbefalt som frontend', 1),
    ('<h2 class="section-title">Teknologier</h2>', '<h2 class="section-title" data-i18n="tech.title">Teknologier</h2>'),
    ('<p class="section-desc">TypeScript-dominert frontend', '<p class="section-desc" data-i18n="tech.desc">TypeScript-dominert frontend'),
    ('>SPA, editor og styling</p>', ' data-i18n="tech.feSubtitle">SPA, editor og styling</p>'),
    ('>API, sanntid og auth</p>', ' data-i18n="tech.beSubtitle">API, sanntid og auth</p>'),
    ('>Lagring, cache og produksjon</p>', ' data-i18n="tech.dataSubtitle">Lagring, cache og produksjon</p>'),
    ('>Språkfordeling</span>', ' data-i18n="tech.langDist">Språkfordeling</span>'),
    ('>Arkitekturutforsker\n            <svg', ' data-i18n="tech.archLink">Arkitekturutforsker\n            <svg'),
    ('<h2 class="section-title">Arkitektur</h2>', '<h2 class="section-title" data-i18n="arch.title">Arkitektur</h2>'),
    ('<p class="section-desc">Tredelt webarkitektur', '<p class="section-desc" data-i18n="arch.desc">Tredelt webarkitektur'),
    ('>Frontend (SPA)</h3>', ' data-i18n="arch.feTitle">Frontend (SPA)</h3>', 1),
    ('>React + TypeScript med Vite. Komponentbasert', ' data-i18n="arch.feDesc">React + TypeScript med Vite. Komponentbasert', 1),
    ('>Backend (API)</h3>', ' data-i18n="arch.beTitle">Backend (API)</h3>', 1),
    ('>Ruby on Rails 8.1 i API-modus', ' data-i18n="arch.beDesc">Ruby on Rails 8.1 i API-modus', 1),
    ('>Database</h3>', ' data-i18n="arch.dbTitle">Database</h3>', 1),
    ('>PostgreSQL via Neon. UUID-primærnøkler', ' data-i18n="arch.dbDesc">PostgreSQL via Neon. UUID-primærnøkler', 1),
    ('>Sanntid & Live Sessions</h3>', ' data-i18n="arch.rtTitle">Sanntid & Live Sessions</h3>'),
    ('>WebSocket via Action Cable for live-oppdateringer</li>', ' data-i18n="arch.rt1">WebSocket via Action Cable for live-oppdateringer</li>'),
    ('>Publikum kobler til via QR-kode, kode eller lenke</li>', ' data-i18n="arch.rt2">Publikum kobler til via QR-kode, kode eller lenke</li>'),
    ('>Polls og spørsmål aktiveres i sanntid fra presentatør</li>', ' data-i18n="arch.rt3">Polls og spørsmål aktiveres i sanntid fra presentatør</li>'),
    ('>Resultater visualiseres live (stolpediagram via recharts)</li>', ' data-i18n="arch.rt4">Resultater visualiseres live (stolpediagram via recharts)</li>'),
    ('>Sikkerhet & Deploy</h3>', ' data-i18n="arch.secTitle">Sikkerhet & Deploy</h3>'),
    ('>JWT-tokens med 24t utløp, bcrypt-passord</li>', ' data-i18n="arch.sec1">JWT-tokens med 24t utløp, bcrypt-passord</li>'),
    ('>OAuth 2.0 via Google og GitHub</li>', ' data-i18n="arch.sec2">OAuth 2.0 via Google og GitHub</li>'),
    ('>CORS-kontroll og SSL i produksjon</li>', ' data-i18n="arch.sec3">CORS-kontroll og SSL i produksjon</li>'),
    ('>Containerisert med Docker, deployet via Kamal</li>', ' data-i18n="arch.sec4">Containerisert med Docker, deployet via Kamal</li>'),
    ('>Arkitekturutforsker</h3>', ' data-i18n="arch.explorerTitle">Arkitekturutforsker</h3>', 1),
    ('>Klikk på elementer for forklaring.', ' data-i18n-html="arch.explorerDesc">Klikk på elementer for forklaring.', 1),
    ('>Kildekode\n            </a>', ' data-i18n="arch.sourceCode">Kildekode\n            </a>', 1),
    ('<label for="arch-tab-select" class="arch-tab-select-label">Visning</label>', '<label for="arch-tab-select" class="arch-tab-select-label" data-i18n="arch.tabView">Visning</label>'),
    ('<option value="journey">Flytdiagram</option>', '<option value="journey" data-i18n="arch.tabJourney">Flytdiagram</option>'),
    ('<option value="er">Datamodell</option>', '<option value="er" data-i18n="arch.tabEr">Datamodell</option>'),
    ('<option value="structure">Filstruktur</option>', '<option value="structure" data-i18n="arch.tabStructure">Filstruktur</option>'),
    ('<option value="api">API og ruter</option>', '<option value="api" data-i18n="arch.tabApi">API og ruter</option>'),
    ('aria-label="Velg arkitekturvisning"', 'data-i18n-aria="arch.tabSelect" aria-label="Velg arkitekturvisning"'),
    ('role="tablist" aria-label="Arkitekturmeny"', 'role="tablist" data-i18n-aria="arch.tabMenu" aria-label="Arkitekturmeny"'),
    ('data-arch-tab="journey" role="tab"', 'data-arch-tab="journey" data-i18n="arch.tabJourney" role="tab"'),
    ('>Flytdiagram\n            </button>', ' data-i18n="arch.tabJourney">Flytdiagram\n            </button>', 1),
    ('data-arch-tab="er" role="tab"', 'data-arch-tab="er" data-i18n="arch.tabEr" role="tab"'),
    ('>Datamodell\n            </button>', ' data-i18n="arch.tabEr">Datamodell\n            </button>', 1),
    ('data-arch-tab="structure" role="tab"', 'data-arch-tab="structure" data-i18n="arch.tabStructure" role="tab"'),
    ('>Filstruktur\n            </button>', ' data-i18n="arch.tabStructure">Filstruktur\n            </button>', 1),
    ('data-arch-tab="api" role="tab"', 'data-arch-tab="api" data-i18n="arch.tabApiShort" role="tab"'),
    ('>API & Ruter\n            </button>', ' data-i18n="arch.tabApiShort">API & Ruter\n            </button>'),
    ('aria-label="Diagramkontroller"', 'data-i18n-aria="arch.toolbar" aria-label="Diagramkontroller"'),
    ('aria-label="Zoom ut" title="Zoom ut"', 'data-i18n-aria="arch.zoomOut" data-i18n-title="arch.zoomOut" aria-label="Zoom ut" title="Zoom ut"'),
    ('aria-label="Zoom inn" title="Zoom inn"', 'data-i18n-aria="arch.zoomIn" data-i18n-title="arch.zoomIn" aria-label="Zoom inn" title="Zoom inn"'),
    ('aria-label="Tilbakestill" title="Tilbakestill"', 'data-i18n-aria="arch.reset" data-i18n-title="arch.reset" aria-label="Tilbakestill" title="Tilbakestill"'),
    ('aria-label="Tilpass til skjerm" title="Tilpass"', 'data-i18n-aria="arch.fit" data-i18n-title="arch.fitShort" aria-label="Tilpass til skjerm" title="Tilpass"'),
    ('<kbd>Dra</kbd><span>panorer</span>', '<kbd data-i18n="arch.hintDrag">Dra</kbd><span data-i18n="arch.hintPan">panorer</span>'),
    ('<kbd>Klyp</kbd><span>zoom</span>', '<kbd data-i18n="arch.hintPinch">Klyp</kbd><span data-i18n="arch.hintZoom">zoom</span>'),
    ('<kbd>Scroll</kbd><span>zoom</span>', '<kbd data-i18n="arch.hintScroll">Scroll</kbd><span data-i18n="arch.hintZoom">zoom</span>'),
    ('aria-label="Flytdiagram over bruker- og systemflyt"', 'data-i18n-aria="arch.mermaidAria" aria-label="Flytdiagram over bruker- og systemflyt"'),
    ('>Brukere &amp; innhold</text>', ' data-i18n="arch.erGroup1">Brukere &amp; innhold</text>'),
    ('>Polls (spørsmål · alternativer · stemmer)</text>', ' data-i18n="arch.erGroup2">Polls (spørsmål · alternativer · stemmer)</text>'),
    ('>Live-sesjoner</text>', ' data-i18n="arch.erGroup3">Live-sesjoner</text>'),
    ('<p data-arch-detail-label>Valgt komponent</p>', '<p data-arch-detail-label data-i18n="arch.detailDefault">Valgt komponent</p>'),
    ('>Kildekode\n            </a>\n          </aside>', ' data-i18n="arch.detailGh">Kildekode\n            </a>\n          </aside>'),
    ('<h2 class="section-title">Teamet</h2>', '<h2 class="section-title" data-i18n="team.title">Teamet</h2>'),
    ('<p class="section-desc">Utviklerteamet bak ProSlides', '<p class="section-desc" data-i18n="team.desc">Utviklerteamet bak ProSlides'),
    ('<p class="team-card__focus-title">Primærfokus</p>', '<p class="team-card__focus-title" data-i18n="team.primaryFocus">Primærfokus</p>'),
    ('<h2 class="section-title">Tidslinje</h2>', '<h2 class="section-title" data-i18n="timeline.title">Tidslinje</h2>'),
    ('<p class="section-desc">Prosjektet er delt opp i fire sprinter', '<p class="section-desc" data-i18n="timeline.desc">Prosjektet er delt opp i fire sprinter'),
    ('<h2 class="section-title">Ressurser</h2>', '<h2 class="section-title" data-i18n="docs.title">Ressurser</h2>'),
    ('<p class="section-desc">Oversikt over dokumenter', '<p class="section-desc" data-i18n="docs.desc">Oversikt over dokumenter'),
    ('<p class="text-xs text-[color:var(--muted-foreground)]">Legg til nye poster', '<p class="text-xs text-[color:var(--muted-foreground)]" data-i18n-html="docs.hint">Legg til nye poster'),
    ('id="docs-empty" class="hidden text-sm', 'id="docs-empty" data-i18n="docs.empty" class="hidden text-sm'),
    ('>Merknad · Cursor AI</p>', ' data-i18n="ai.label">Merknad · Cursor AI</p>'),
    ('<p class="text-sm leading-snug text-[color:var(--foreground)] mb-1">\n            <strong>Denne prosjektoversikten</strong>', '<p class="text-sm leading-snug text-[color:var(--foreground)] mb-1" data-i18n-html="ai.p1">\n            <strong>Denne prosjektoversikten</strong>'),
    ('<p class="text-xs sm:text-sm leading-snug text-[color:var(--muted-foreground)]">\n            <strong class="text-[color:var(--foreground)]">Innholdet er ikke AI-generert.</strong>', '<p class="text-xs sm:text-sm leading-snug text-[color:var(--muted-foreground)]" data-i18n-html="ai.p2">\n            <strong class="text-[color:var(--foreground)]">Innholdet er ikke AI-generert.</strong>'),
    ('<p>ProSlides – Bachelorprosjekt Gruppe 1, USN 2026</p>', '<p data-i18n="footer.line">ProSlides – Bachelorprosjekt Gruppe 1, USN 2026</p>'),
    ('>Live-app</a>', ' data-i18n="footer.live">Live-app</a>', 1),
    # scripts
    (
        '  <script src="js/journey-meta.js?v=1"></script>',
        '  <script src="js/i18n-data.js?v=1"></script>\n  <script src="js/arch-desc-en.js?v=1"></script>\n  <script src="js/journey-meta-en.js?v=1"></script>\n  <script src="js/i18n.js?v=1"></script>\n  <script src="js/journey-meta.js?v=1"></script>',
    ),
]

# locale head boot
if "proslides-overview-locale" not in html:
    html = html.replace(
        "    })();\n  </script>\n  <meta charset",
        "    })();\n  </script>\n  <script>\n    (function () {\n      try {\n        var loc = localStorage.getItem('proslides-overview-locale');\n        if (loc === 'en' || loc === 'no') document.documentElement.setAttribute('data-locale', loc);\n      } catch (e) {}\n    })();\n  </script>\n  <meta charset",
        1,
    )

for item in pairs:
    old, new = item[0], item[1]
    count = item[2] if len(item) > 2 else -1
    if count == 1:
        html = html.replace(old, new, 1)
    else:
        html = html.replace(old, new)

# team + timeline via structured inserts
team_map = [
    ("martin", "Prosjektleder · Utvikler", "Live-funksjonalitet og databasearkitektur"),
    ("marcus", "Scrum Master · Utvikler", "Presentasjonseditor, frontend-arkitektur og Scrum"),
    ("fredrik", "Utvikler · UI/UX · Sikkerhet", "Autentisering, UI &amp; UX-design og testing (Playwright E2E)"),
    ("sondre", "Utvikler", "Backend API og forretningslogikk"),
    ("rikke", "Utvikler", "Interaktive elementer"),
]
for slug, badge, spec in team_map:
    html = html.replace(
        f'<p class="team-card__badge">{badge}</p>',
        f'<p class="team-card__badge" data-i18n="team.{slug}.badge">{badge}</p>',
        1,
    )
    html = html.replace(
        f'<p class="team-card__spec">{spec}</p>',
        f'<p class="team-card__spec" data-i18n="team.{slug}.spec">{spec}</p>',
        1,
    )

focus_items = {
    "martin": [
        "Sanntidskommunikasjon (Action Cable)",
        "Datamodell (PostgreSQL / Neon)",
        "Resultattavle (live)",
    ],
    "marcus": ["WYSIWYG-editor (Fabric.js)", "Redigeringsflyt"],
    "fredrik": [
        "Brukerautentisering og sikkerhet",
        "Designsystem (shadcn/ui)",
        "E2E-testrutiner",
    ],
    "sondre": ["API-struktur og endepunkter", "Polls og avstemninger"],
    "rikke": ["Verktøy og interaksjoner i presentasjons-editor"],
}
for slug, items in focus_items.items():
    for i, text in enumerate(items):
        html = html.replace(
            f"<li>{text}</li>",
            f'<li data-i18n="team.{slug}.focus{i}">{text}</li>',
            1,
        )

tl = [
    ("s1", "Foranalyse", "Uke 5–7"),
    ("s2", "UI, UX og datastrukturer", "Uke 8–10"),
    ("s3", "Editor, interaktivitet og sanntid", "Uke 11–17"),
    ("s4", "Feilretting og stabilisering", "Uke 18–20"),
    ("report", "Rapportskriving", "Uke 5–21"),
    ("delivery", "Endelig produkt", "19. mai"),
]
for slug, title, week in tl:
    html = html.replace(
        f'<h3 class="text-lg font-semibold text-[color:var(--foreground)]">{title}</h3>',
        f'<h3 class="text-lg font-semibold text-[color:var(--foreground)]" data-i18n="timeline.{slug}.title">{title}</h3>',
        1,
    )
    html = html.replace(
        f'>{week}</span>',
        f' data-i18n="timeline.{slug}.week">{week}</span>',
        1,
    )

p.write_text(html, encoding="utf-8")
print("Patched index.html")
