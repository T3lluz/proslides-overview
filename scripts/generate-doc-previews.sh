#!/usr/bin/env bash
# Render first-page PNG previews for PDFs in docs/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/docs/previews"
mkdir -p "$OUT"

if ! command -v pdftoppm >/dev/null 2>&1; then
  echo "pdftoppm (poppler) required" >&2
  exit 1
fi

for pdf in "$ROOT"/docs/*.pdf; do
  base=$(basename "$pdf" .pdf)
  pdftoppm -png -singlefile -f 1 -l 1 -r 144 "$pdf" "$OUT/$base"
  echo "→ $OUT/${base}.png"
done

# GitHub repo social preview (front of repository on GitHub)
curl -fsSL "https://opengraph.githubassets.com/1/Baitedr/Bachelor_Gruppe1" \
  -o "$OUT/github-bachelor-gruppe1.png"
echo "→ $OUT/github-bachelor-gruppe1.png"

# Live-app screenshot (from showcase assets)
cp "$ROOT/assets/image-a51f2bef-9624-4586-8928-54ce81f924f8.png" "$OUT/live-app.png"
echo "→ $OUT/live-app.png"
