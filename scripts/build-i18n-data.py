#!/usr/bin/env python3
"""Build js/i18n-data.js from structured strings."""
import json
from pathlib import Path

def pair(no, en):
    return {"no": no, "en": en}

STRINGS = {
    "meta.title": pair("ProSlides – Prosjektoversikt", "ProSlides – Project Overview"),
    "meta.description": pair(
        "ProSlides – en webbasert WYSIWYG-presentasjonseditor med sanntids publikumsinvolvering. Bachelorprosjekt (BOP3000) ved USN Bø, 2026. Utviklet for RubyNor.",
        "ProSlides – a web-based WYSIWYG presentation editor with real-time audience engagement. Bachelor project (BOP3000) at USN Bø, 2026. Built for RubyNor.",
    ),
    "meta.ogTitle": pair("ProSlides – Interaktiv Presentasjonsplattform", "ProSlides – Interactive Presentation Platform"),
    "meta.ogDescription": pair(
        "WYSIWYG slide-editor med sanntids polls, publikumsspørsmål og live-resultater. Bachelorprosjekt ved USN i samarbeid med RubyNor, 2026.",
        "WYSIWYG slide editor with real-time polls, audience questions and live results. Bachelor project at USN in collaboration with RubyNor, 2026.",
    ),
    "meta.twitterDescription": pair(
        "WYSIWYG slide-editor med sanntids polls, publikumsspørsmål og live-resultater. Bachelorprosjekt USN 2026.",
        "WYSIWYG slide editor with real-time polls, audience questions and live results. USN bachelor project 2026.",
    ),
    "lang.switchToEn": pair("Bytt språk til engelsk", "Switch language to English"),
    "lang.switchToNo": pair("Bytt språk til norsk", "Switch language to Norwegian"),
    "nav.about": pair("Om prosjektet", "About the project"),
    "nav.tech": pair("Teknologi", "Technology"),
    "nav.architecture": pair("Arkitektur", "Architecture"),
    "nav.team": pair("Teamet", "Team"),
    "nav.timeline": pair("Tidslinje", "Timeline"),
    "nav.docs": pair("Ressurser", "Resources"),
    "nav.mobileLabel": pair("Sidemeny", "Site menu"),
    "nav.openMenu": pair("Åpne meny", "Open menu"),
    "nav.closeMenu": pair("Lukk meny", "Close menu"),
    "motion.name": pair("Animasjon", "Animation"),
    "motion.on": pair("På", "On"),
    "motion.off": pair("Av", "Off"),
    "motion.onDetail": pair("Animasjoner på", "Animations on"),
    "motion.offDetail": pair("Animasjoner av", "Animations off"),
    "motion.ariaOff": pair("Slå av animasjoner", "Turn off animations"),
    "motion.ariaOn": pair("Slå på animasjoner", "Turn on animations"),
    "hero.badge": pair("Bachelorprosjekt 2026", "Bachelor project 2026"),
    "hero.desc": pair(
        "En webbasert WYSIWYG-presentasjonseditor med sanntids publikumsinvolvering – polls, publikumsspørsmål og live-resultater. Bygget som bachelorprosjekt (BOP3000) ved USN Bø, våren 2026.",
        "A web-based WYSIWYG presentation editor with real-time audience engagement – polls, audience questions and live results. Built as a bachelor project (BOP3000) at USN Bø, spring 2026.",
    ),
    "hero.liveApp": pair("Se live-appen", "View live app"),
    "hero.source": pair("Se kildekoden", "View source code"),
    "showcase.title": pair("Se appen i aksjon", "See the app in action"),
    "showcase.subtitle": pair("Dashboard · Editor · Live-presentasjon", "Dashboard · Editor · Live presentation"),
    "showcase.light": pair("Lyst", "Light"),
    "showcase.dark": pair("Mørkt", "Dark"),
    "showcase.ariaTheme": pair("Bytt skjermbildetema", "Switch screenshot theme"),
    "showcase.ariaCarousel": pair("Skjermbilder av ProSlides", "ProSlides screenshots"),
    "showcase.prev": pair("Forrige skjermbilde", "Previous screenshot"),
    "showcase.next": pair("Neste skjermbilde", "Next screenshot"),
    "showcase.tab0": pair("Dashboard", "Dashboard"),
    "showcase.tab1": pair("Editor", "Editor"),
    "showcase.tab2": pair("Live-presentasjon", "Live presentation"),
    "showcase.label0": pair("Dashboard", "Dashboard"),
    "showcase.label1": pair("Editor", "Editor"),
    "showcase.label2": pair("Live-presentasjon", "Live presentation"),
    "showcase.ariaLight": pair("Vis lyst skjermbilde", "Show light screenshot"),
    "showcase.ariaDark": pair("Vis mørkt skjermbilde", "Show dark screenshot"),
    "about.title": pair("Om prosjektet", "About the project"),
    "about.desc": pair(
        'RubyNor har i dag løsningen <a href="https://app.spleiselaget.no" target="_blank" class="text-[color:var(--primary)] hover:underline">spleiselaget.no</a> for interaktive presentasjoner, men den er bygget på rigide, forhåndsdefinerte maler. Oppgaven var å utvikle en mer fleksibel WYSIWYG-editor der brukeren fritt kan utforme slides visuelt, samtidig som publikum involveres i sanntid via nettleser eller mobil – uten behov for apper eller brukerkonto.',
        'RubyNor currently uses <a href="https://app.spleiselaget.no" target="_blank" class="text-[color:var(--primary)] hover:underline">spleiselaget.no</a> for interactive presentations, but it is built on rigid, predefined templates. The task was to build a more flexible WYSIWYG editor where users can design slides visually while engaging the audience in real time via browser or mobile – without apps or user accounts.',
    ),
    "about.problemLabel": pair("Problemstilling", "Research question"),
    "about.problemQuote": pair(
        "«Hvordan kan vi utvikle et webbasert presentasjonsverktøy som både gir brukeren full frihet til å utforme slides visuelt og samtidig legger til rette for aktiv publikumsinvolvering under presentasjonen?»",
        '"How can we develop a web-based presentation tool that gives users full freedom to design slides visually while enabling active audience participation during the presentation?"',
    ),
    "about.clientLabel": pair("Oppdragsgiver", "Client"),
    "about.clientValue": pair("RubyNor – Pål Andrè Sundt, CTO", "RubyNor – Pål Andrè Sundt, CTO"),
    "about.advisorLabel": pair("Veileder", "Supervisor"),
    "about.advisorValue": pair("Ingrid Sundbø – USN, campus Bø", "Ingrid Sundbø – USN, campus Bø"),
    "about.monoTitle": pair("Monorepo-struktur", "Monorepo structure"),
    "about.monoDesc": pair("Prosjektet er organisert som en monorepo med to hovedmapper:", "The project is organized as a monorepo with two main folders:"),
    "about.reqTitle": pair("Krav fra oppdragsgiver", "Client requirements"),
    "about.req1": pair("Webbasert WYSIWYG-editor for slides", "Web-based WYSIWYG editor for slides"),
    "about.req2": pair("Dra-og-slipp for elementer (tekst, bilder, bakgrunn)", "Drag-and-drop for elements (text, images, background)"),
    "about.req3": pair("Interaktive elementer (polls, spørsmål)", "Interactive elements (polls, questions)"),
    "about.req4": pair("Sanntidskommunikasjon presentatør ↔ publikum", "Real-time communication presenter ↔ audience"),
    "about.req5": pair("Mobil deltakelse uten app/registrering", "Mobile participation without app/registration"),
    "about.req6": pair("Responsivt grensesnitt (desktop + mobil)", "Responsive UI (desktop + mobile)"),
    "about.req7": pair("Dynamisk bruk av publikumsdata i slides", "Dynamic use of audience data in slides"),
    "about.reqFoot": pair(
        "Elm ble anbefalt som frontend – vi valgte React/TypeScript for økosystem, erfaring og industrirelevans.",
        "Elm was recommended for the frontend – we chose React/TypeScript for ecosystem, experience and industry relevance.",
    ),
    "tech.title": pair("Teknologier", "Technologies"),
    "tech.desc": pair(
        "TypeScript-dominert frontend mot et Ruby on Rails API – med PostgreSQL, Redis og container-deploy.",
        "TypeScript-heavy frontend against a Ruby on Rails API – with PostgreSQL, Redis and container deployment.",
    ),
    "tech.feSubtitle": pair("SPA, editor og styling", "SPA, editor and styling"),
    "tech.beSubtitle": pair("API, sanntid og auth", "API, realtime and auth"),
    "tech.dataSubtitle": pair("Lagring, cache og produksjon", "Storage, cache and production"),
    "tech.langDist": pair("Språkfordeling", "Language distribution"),
    "tech.archLink": pair("Arkitekturutforsker", "Architecture explorer"),
    "arch.title": pair("Arkitektur", "Architecture"),
    "arch.desc": pair("Tredelt webarkitektur med SPA, REST API og sanntidskanal.", "Three-tier web architecture with SPA, REST API and realtime channel."),
    "arch.feTitle": pair("Frontend (SPA)", "Frontend (SPA)"),
    "arch.feDesc": pair(
        "React + TypeScript med Vite. Komponentbasert arkitektur med shadcn/ui og Fabric.js canvas-editor. Tokenbasert auth og reaktiv state.",
        "React + TypeScript with Vite. Component architecture with shadcn/ui and Fabric.js canvas editor. Token-based auth and reactive state.",
    ),
    "arch.beTitle": pair("Backend (API)", "Backend (API)"),
    "arch.beDesc": pair(
        "Ruby on Rails 8.1 i API-modus. Versjonert REST-API, JWT-autentisering, OAuth (Google/GitHub), og Action Cable for WebSocket-sanntid.",
        "Ruby on Rails 8.1 in API mode. Versioned REST API, JWT auth, OAuth (Google/GitHub), and Action Cable for WebSocket realtime.",
    ),
    "arch.dbTitle": pair("Database", "Database"),
    "arch.dbDesc": pair(
        "PostgreSQL via Neon. UUID-primærnøkler, JSONB for fleksible slide-elementer, og relasjonell struktur for brukere, presentasjoner og sessions.",
        "PostgreSQL via Neon. UUID primary keys, JSONB for flexible slide elements, and relational structure for users, presentations and sessions.",
    ),
    "arch.rtTitle": pair("Sanntid & Live Sessions", "Realtime & live sessions"),
    "arch.rt1": pair("WebSocket via Action Cable for live-oppdateringer", "WebSocket via Action Cable for live updates"),
    "arch.rt2": pair("Publikum kobler til via QR-kode, kode eller lenke", "Audience joins via QR code, code or link"),
    "arch.rt3": pair("Polls og spørsmål aktiveres i sanntid fra presentatør", "Polls and questions activated in real time by presenter"),
    "arch.rt4": pair("Resultater visualiseres live (stolpediagram via recharts)", "Results visualized live (bar chart via recharts)"),
    "arch.secTitle": pair("Sikkerhet & Deploy", "Security & deploy"),
    "arch.sec1": pair("JWT-tokens med 24t utløp, bcrypt-passord", "JWT tokens with 24h expiry, bcrypt passwords"),
    "arch.sec2": pair("OAuth 2.0 via Google og GitHub", "OAuth 2.0 via Google and GitHub"),
    "arch.sec3": pair("CORS-kontroll og SSL i produksjon", "CORS control and SSL in production"),
    "arch.sec4": pair("Containerisert med Docker, deployet via Kamal", "Containerized with Docker, deployed via Kamal"),
    "arch.explorerTitle": pair("Arkitekturutforsker", "Architecture explorer"),
    "arch.explorerDesc": pair(
        'Klikk på elementer for forklaring. <span class="text-[color:var(--foreground)] font-medium">Dra</span> med musen for å panorere, <span class="text-[color:var(--foreground)] font-medium">scroll</span> eller knappene for å zoome.',
        'Click elements for details. <span class="text-[color:var(--foreground)] font-medium">Drag</span> to pan, <span class="text-[color:var(--foreground)] font-medium">scroll</span> or use buttons to zoom.',
    ),
    "arch.sourceCode": pair("Kildekode", "Source code"),
    "arch.tabView": pair("Visning", "View"),
    "arch.tabJourney": pair("Flytdiagram", "Flow diagram"),
    "arch.tabEr": pair("Datamodell", "Data model"),
    "arch.tabStructure": pair("Filstruktur", "File structure"),
    "arch.tabApi": pair("API og ruter", "API & routes"),
    "arch.tabApiShort": pair("API & Ruter", "API & routes"),
    "arch.tabMenu": pair("Arkitekturmeny", "Architecture menu"),
    "arch.tabSelect": pair("Velg arkitekturvisning", "Select architecture view"),
    "arch.toolbar": pair("Diagramkontroller", "Diagram controls"),
    "arch.zoomOut": pair("Zoom ut", "Zoom out"),
    "arch.zoomIn": pair("Zoom inn", "Zoom in"),
    "arch.reset": pair("Tilbakestill", "Reset"),
    "arch.fit": pair("Tilpass til skjerm", "Fit to screen"),
    "arch.fitShort": pair("Tilpass", "Fit"),
    "arch.hintDrag": pair("Dra", "Drag"),
    "arch.hintPan": pair("panorer", "pan"),
    "arch.hintPinch": pair("Klyp", "Pinch"),
    "arch.hintZoom": pair("zoom", "zoom"),
    "arch.hintScroll": pair("Scroll", "Scroll"),
    "arch.mermaidAria": pair("Flytdiagram over bruker- og systemflyt", "Flow diagram of user and system flow"),
    "arch.detailDefault": pair("Valgt komponent", "Selected component"),
    "arch.detailJourney": pair("Valgt steg", "Selected step"),
    "arch.detailEr": pair("Valgt entitet", "Selected entity"),
    "arch.detailStructure": pair("Valgt sti", "Selected path"),
    "arch.detailApi": pair("Valgt endepunkt", "Selected endpoint"),
    "arch.detailGh": pair("Kildekode", "Source code"),
    "arch.erGroup1": pair("Brukere & innhold", "Users & content"),
    "arch.erGroup2": pair("Polls (spørsmål · alternativer · stemmer)", "Polls (questions · options · votes)"),
    "arch.erGroup3": pair("Live-sesjoner", "Live sessions"),
    "arch.mermaidLoading": pair("Laster flytdiagram…", "Loading flow diagram…"),
    "arch.mermaidFallback": pair("Åpne referansebilde", "Open reference image"),
    "team.title": pair("Teamet", "Team"),
    "team.desc": pair(
        "Utviklerteamet bak ProSlides – bachelorprosjekt USN våren 2026, i samarbeid med RubyNor.",
        "The development team behind ProSlides – USN bachelor project spring 2026, in collaboration with RubyNor.",
    ),
    "team.primaryFocus": pair("Primærfokus", "Primary focus"),
    "timeline.title": pair("Tidslinje", "Timeline"),
    "timeline.desc": pair("Prosjektet er delt opp i fire sprinter, tilpasset tidsrammen.", "The project is split into four sprints, aligned with the schedule."),
    "docs.title": pair("Ressurser", "Resources"),
    "docs.desc": pair("Oversikt over dokumenter, lenker og media knyttet til prosjektet.", "Overview of documents, links and media related to the project."),
    "docs.hint": pair(
        'Legg til nye poster i <code class="text-[11px] px-1.5 py-0.5 rounded bg-[var(--muted)] font-mono">js/docs.js</code> — støtter filer, eksterne lenker og bilder.',
        'Add new entries in <code class="text-[11px] px-1.5 py-0.5 rounded bg-[var(--muted)] font-mono">js/docs.js</code> — supports files, external links and images.',
    ),
    "docs.empty": pair("Ingen ressurser lagt til ennå.", "No resources added yet."),
    "ai.label": pair("Merknad · Cursor AI", "Notice · Cursor AI"),
    "ai.p1": pair(
        '<strong>Denne prosjektoversikten</strong> (denne nettsiden, ikke ProSlides-appen): UI, layout, kode og animasjoner er utviklet med <a href="https://cursor.com" target="_blank" rel="noopener" class="font-medium text-[color:var(--primary)] hover:underline">Cursor AI</a>.',
        '<strong>This project overview</strong> (this website, not the ProSlides app): UI, layout, code and animations were built with <a href="https://cursor.com" target="_blank" rel="noopener" class="font-medium text-[color:var(--primary)] hover:underline">Cursor AI</a>.',
    ),
    "ai.p2": pair(
        '<strong class="text-[color:var(--foreground)]">Innholdet er ikke AI-generert.</strong> Tekst, data og prosjektinformasjon er skrevet og verifisert av gruppen. Modeller: <span class="font-medium text-[color:var(--foreground)]">Claude Opus 4.6</span>, <span class="font-medium text-[color:var(--foreground)]">Claude Opus 4.7</span>, <span class="font-medium text-[color:var(--foreground)]">Cursor Composer  </span>.',
        '<strong class="text-[color:var(--foreground)]">Content is not AI-generated.</strong> Text, data and project information were written and verified by the team. Models: <span class="font-medium text-[color:var(--foreground)]">Claude Opus 4.6</span>, <span class="font-medium text-[color:var(--foreground)]">Claude Opus 4.7</span>, <span class="font-medium text-[color:var(--foreground)]">Cursor Composer  </span>.',
    ),
    "footer.line": pair("ProSlides – Bachelorprosjekt Gruppe 1, USN 2026", "ProSlides – Bachelor project Group 1, USN 2026"),
    "footer.live": pair("Live-app", "Live app"),
}

# Team members
team = [
    ("martin", "Martin M. Hansen", "Prosjektleder · Utvikler", "Project lead · Developer",
     "Live-funksjonalitet og databasearkitektur", "Live functionality and database architecture",
     ["Sanntidskommunikasjon (Action Cable)", "Datamodell (PostgreSQL / Neon)", "Resultattavle (live)"],
     ["Real-time communication (Action Cable)", "Data model (PostgreSQL / Neon)", "Results board (live)"]),
    ("marcus", "Marcus W. H. Einarsen", "Scrum Master · Utvikler", "Scrum Master · Developer",
     "Presentasjonseditor, frontend-arkitektur og Scrum", "Presentation editor, frontend architecture and Scrum",
     ["WYSIWYG-editor (Fabric.js)", "Redigeringsflyt"],
     ["WYSIWYG editor (Fabric.js)", "Editing workflow"]),
    ("fredrik", "Fredrik Stalsberg", "Utvikler · UI/UX · Sikkerhet", "Developer · UI/UX · Security",
     "Autentisering, UI & UX-design og testing (Playwright E2E)", "Authentication, UI & UX design and testing (Playwright E2E)",
     ["Brukerautentisering og sikkerhet", "Designsystem (shadcn/ui)", "E2E-testrutiner"],
     ["User authentication and security", "Design system (shadcn/ui)", "E2E test routines"]),
    ("sondre", "Sondre C. Mogen", "Utvikler", "Developer",
     "Backend API og forretningslogikk", "Backend API and business logic",
     ["API-struktur og endepunkter", "Polls og avstemninger"],
     ["API structure and endpoints", "Polls and voting"]),
    ("rikke", "Rikke H. Larsen", "Utvikler", "Developer",
     "Interaktive elementer", "Interactive elements",
     ["Verktøy og interaksjoner i presentasjons-editor"],
     ["Tools and interactions in the presentation editor"]),
]
for slug, _name, badge_no, badge_en, spec_no, spec_en, focus_no, focus_en in team:
    STRINGS[f"team.{slug}.badge"] = pair(badge_no, badge_en)
    STRINGS[f"team.{slug}.spec"] = pair(spec_no, spec_en)
    for i, (fno, fen) in enumerate(zip(focus_no, focus_en)):
        STRINGS[f"team.{slug}.focus{i}"] = pair(fno, fen)

# Timeline
timeline = [
    ("s1", "Foranalyse", "Discovery", "Uke 5–7", "Week 5–7",
     "Sette i gang med prosjektet. Oppsett av IDE, rammeverk og utviklingsmiljø. Sette seg inn i Ruby og Rails.",
     "Kick off the project. Set up IDE, frameworks and dev environment. Learn Ruby and Rails.",
     ["Oppsett av Rails 8 API + React/Vite monorepo", "PostgreSQL-database med migrasjoner", "Git-flyt og prosjektstruktur definert", "Læringsperiode for Ruby og Rails"],
     ["Rails 8 API + React/Vite monorepo setup", "PostgreSQL database with migrations", "Git workflow and project structure defined", "Learning period for Ruby and Rails"]),
    ("s2", "UI, UX og datastrukturer", "UI, UX and data structures", "Uke 8–10", "Week 8–10",
     "Etablere fast UI-struktur. Sikre interaktiv og intuitiv UX med universell utforming. Definere datastrukturer og modeller.",
     "Establish solid UI structure. Ensure interactive, intuitive UX with accessibility. Define data structures and models.",
     ["Komponentbibliotek med shadcn/ui + Tailwind", "Databasemodeller: User, Presentation, Slide, Poll", "Ruting og navigasjonsstruktur", "Universell utforming (WCAG)"],
     ["Component library with shadcn/ui + Tailwind", "Database models: User, Presentation, Slide, Poll", "Routing and navigation structure", "Accessibility (WCAG)"]),
    ("s3", "Editor, interaktivitet og sanntid", "Editor, interactivity and realtime", "Uke 11–17", "Week 11–17",
     "Editoren er kjernen i prosjektet. All funksjonalitet på plass: verktøylinje, polls, publikumsspørsmål, slides og sanntidsvisning.",
     "The editor is the core. Full functionality: toolbar, polls, audience questions, slides and realtime display.",
     ["Visuell slide-editor med Fabric.js-canvas", "Drag-and-drop slide-organisering (dnd-kit)", "Sanntids polls og publikumsspørsmål via Action Cable", "OAuth-innlogging (Google, GitHub)", "JWT-autentisering og sessions", "Live presentasjonsmodus med deltaker-kobling"],
     ["Visual slide editor with Fabric.js canvas", "Drag-and-drop slide organization (dnd-kit)", "Real-time polls and audience questions via Action Cable", "OAuth login (Google, GitHub)", "JWT authentication and sessions", "Live presentation mode with participant join"]),
    ("s4", "Feilretting og stabilisering", "Bug fixing and stabilization", "Uke 18–20", "Week 18–20",
     "Brukertesting av nettsiden, brukerhistorier og selvtesting. Feil og mangler fikses fortløpende.",
     "User testing, user stories and self-testing. Bugs fixed continuously.",
     ["E2E-testing med Playwright", "Brukertesting med reelle testpersoner", "Testing basert på brukerhistorier", "Feilretting og ytelsesforbedring", "Deploy-testing med Docker + Kamal"],
     ["E2E testing with Playwright", "User testing with real participants", "Testing based on user stories", "Bug fixes and performance improvements", "Deploy testing with Docker + Kamal"]),
    ("report", "Rapportskriving", "Report writing", "Uke 5–21", "Week 5–21",
     "Gjøres gjennom hele prosjektets levetid, parallelt med utvikling. Dokumenterer prosess, metode, resultater og refleksjon.",
     "Done throughout the project, parallel to development. Documents process, method, results and reflection.", [], []),
    ("delivery", "Endelig produkt", "Final delivery", "19. mai", "19 May",
     "Siste optimalisering, feilretting og endringer. Levering av ferdig produkt, rapport og prosjektoversikt.",
     "Final optimization, fixes and changes. Delivery of finished product, report and project overview.", [], []),
]
for slug, title_no, title_en, week_no, week_en, desc_no, desc_en, items_no, items_en in timeline:
    STRINGS[f"timeline.{slug}.title"] = pair(title_no, title_en)
    STRINGS[f"timeline.{slug}.week"] = pair(week_no, week_en)
    STRINGS[f"timeline.{slug}.desc"] = pair(desc_no, desc_en)
    for i, (ino, ien) in enumerate(zip(items_no, items_en)):
        STRINGS[f"timeline.{slug}.item{i}"] = pair(ino, ien)

# Docs catalog (from docs.js)
STRINGS["docs.section.documents"] = pair("Dokumenter", "Documents")
STRINGS["docs.section.documentsHint"] = pair("PDF-er, rapporter og kontrakter", "PDFs, reports and contracts")
STRINGS["docs.item.report.title"] = pair("Prosjektrapport", "Project report")
STRINGS["docs.item.report.desc"] = pair(
    "Sluttrapport for bachelorprosjektet — dokumentasjon av utvikling, testing og leveranse",
    "Final report for the bachelor project — documentation of development, testing and delivery",
)
STRINGS["docs.item.thesis.title"] = pair("Oppgavebeskrivelse Rubynor", "RubyNor assignment description")
STRINGS["docs.item.thesis.desc"] = pair("Full bacheloroppgave — hovedkilde for prosjektet", "Full bachelor thesis — main project source")
STRINGS["docs.item.bop.title"] = pair("Prosjektskisse", "Project sketch")
STRINGS["docs.item.bop.desc"] = pair("Bacheloroppgave – prosjektbeskrivelse og plan", "Bachelor project – description and plan")
STRINGS["docs.item.contract.title"] = pair("Arbeidskontrakt", "Employment contract")
STRINGS["docs.item.contract.desc"] = pair("Avtale om samarbeid og ansvarsfordeling i gruppen", "Agreement on collaboration and responsibilities in the group")
STRINGS["docs.section.links"] = pair("Lenker", "Links")
STRINGS["docs.section.linksHint"] = pair("Eksterne ressurser og verktøy", "External resources and tools")
STRINGS["docs.item.github.title"] = pair("GitHub — prosjektrepo", "GitHub — project repo")
STRINGS["docs.item.github.desc"] = pair("Kildekode, issues og prosjektstruktur", "Source code, issues and project structure")
STRINGS["docs.item.live.title"] = pair("Live-app", "Live app")
STRINGS["docs.item.live.desc"] = pair("Deployet demonstrasjon av ProSlides", "Deployed demonstration of ProSlides")
STRINGS["docs.section.media"] = pair("Bilder & media", "Images & media")
STRINGS["docs.section.mediaHint"] = pair("Skjermbilder, diagrammer og illustrasjoner", "Screenshots, diagrams and illustrations")
STRINGS["docs.item.flow.title"] = pair("Applikasjonsflyt — kilde", "Application flow — source")
STRINGS["docs.item.flow.desc"] = pair(
    "Flytdiagram over autentisering, dashboard, live-sesjon og deltakerflyt. Utviklet som referansekilde for implementasjon.",
    "Flow diagram of authentication, dashboard, live session and participant flow. Developed as implementation reference.",
)
STRINGS["docs.type.file"] = pair("Fil", "File")
STRINGS["docs.type.link"] = pair("Lenke", "Link")
STRINGS["docs.type.image"] = pair("Bilde", "Image")
STRINGS["docs.open"] = pair("Åpne", "Open")
STRINGS["docs.visitLink"] = pair("Besøk lenke", "Visit link")
STRINGS["docs.download"] = pair("Last ned", "Download")
STRINGS["docs.sourceBadge"] = pair("Kilde", "Source")
STRINGS["docs.fullscreen"] = pair("Fullskjerm", "Fullscreen")
STRINGS["docs.viewerHint"] = pair(
    "Scroll for zoom · dra for å panore · Esc for å lukke",
    "Scroll to zoom · drag to pan · Esc to close",
)
STRINGS["docs.viewer"] = pair("Bildevisning", "Image viewer")
STRINGS["docs.viewerClose"] = pair("Lukk", "Close")
STRINGS["docs.zoomOut"] = pair("Zoom ut", "Zoom out")
STRINGS["docs.zoomIn"] = pair("Zoom inn", "Zoom in")
STRINGS["docs.fit"] = pair("Tilpass vindu", "Fit window")
STRINGS["docs.openFullscreen"] = pair("Åpne {title} i fullskjerm", "Open {title} in fullscreen")

no = {k: v["no"] for k, v in STRINGS.items()}
en = {k: v["en"] for k, v in STRINGS.items()}

out = Path(__file__).resolve().parents[1] / "js" / "i18n-data.js"
out.write_text(
    "/* Generated by scripts/build-i18n-data.py — do not edit by hand unless intentional */\n"
    "window.ProSlidesI18nData = "
    + json.dumps({"no": no, "en": en}, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(f"Wrote {out} ({len(STRINGS)} keys)")
