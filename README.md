# ProSlides – Prosjektoversikt

Statisk nettside med oversikt over bachelorprosjektet **ProSlides** (Gruppe 1, USN 2026).

## Kjøre lokalt

Åpne `index.html` i en nettleser – ingen build-steg nødvendig.

## Legge til dokumentasjon

Rediger `docs`-arrayen øverst i `<script>`-blokken i `index.html`:

```js
const docs = [
  { title: "Prosjektrapport", file: "docs/rapport.pdf", desc: "Hovedrapport for bachelorprosjektet" },
  { title: "API Dokumentasjon", file: "docs/api.pdf", desc: "REST API-referanse" },
];
```

Legg PDF-filer i `docs/`-mappen og oppdater arrayen.

## Deploy

Nettsiden hostes via GitHub Pages fra `main`-branchen. Push endringer for å oppdatere.

## Kildekode

Hovedprosjektet: [github.com/Baitedr/Bachelor_Gruppe1](https://github.com/Baitedr/Bachelor_Gruppe1)
