#!/usr/bin/env bash
# Regenerer diagrams/flytdiagram.svg fra diagrams/flytdiagram.mmd
set -euo pipefail
cd "$(dirname "$0")/.."
npx -y @mermaid-js/mermaid-cli@11 -i diagrams/flytdiagram.mmd -o diagrams/flytdiagram.svg -b transparent
echo "Wrote diagrams/flytdiagram.svg"
