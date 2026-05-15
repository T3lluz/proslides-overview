# ProSlides Overview

Dette repoet inneholder den statiske prosjekt-siden for bachelorprosjektet **ProSlides** (Gruppe 1, USN 2026).  
Siden viser prosjektets mål, teknologi, arkitektur, team, tidslinje og lenker til dokumentasjon.

## Viktige lenker

- Live prosjekt-side (overview): [t3lluz.github.io/proslides-overview](https://t3lluz.github.io/proslides-overview/)
- ProSlides app (prosjekt-side): [slides.rubynor.com](https://slides.rubynor.com/)
- Hovedrepo for applikasjonen (frontend/backend): [github.com/Baitedr/Bachelor_Gruppe1](https://github.com/Baitedr/Bachelor_Gruppe1)

## Innhold i dette repoet

- `index.html` - hovedsiden med seksjoner og innhold.
- `css/styles.css` - hovedstilark for layout/tema.
- `css/animations.css` - animasjoner og motion-regler.
- `js/` - interaktivitet (showcase, arkitektur-utforsker, animasjonstoggle, docs, team).
- `docs/` - prosjektdokumenter (PDF-er), f.eks. `bop2026.pdf` og `samarbeidskontrakt.pdf`.

## Kjoring lokalt

Ingen build er nodvendig. Aapne `index.html` direkte i nettleser.

Tips: bruk en enkel lokal server hvis du vil teste oppforing mer lik deploy:

```bash
python -m http.server 8080
```

Deretter: `http://localhost:8080`

## Oppdatere dokumentlisten pa siden

Dokumentkortene styres fra `js/docs.js`.  
Legg nye PDF-filer i `docs/` og oppdater listen i `js/docs.js`.

## Deploy

Overview-siden publiseres via GitHub Pages fra `main`-branch i dette repoet.

## Relaterte repoer

- **Denne siden (overview):** `proslides-overview`
- **Selve ProSlides-applikasjonen:** [Bachelor_Gruppe1](https://github.com/Baitedr/Bachelor_Gruppe1)
