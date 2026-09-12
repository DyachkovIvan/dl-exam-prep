#!/usr/bin/env bash
# Скачивает marked и MathJax в assets/vendor/, чтобы страница работала без интернета.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/vendor

curl -fsSL -o assets/vendor/marked.min.js \
  https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js
curl -fsSL -o assets/vendor/tex-svg.js \
  https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js

cat <<'MSG'

Готово. Теперь замените в index.html две строки:

  https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js  →  assets/vendor/marked.min.js
  https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js →  assets/vendor/tex-svg.js

Шрифты подключены с Google Fonts; без интернета подставятся системные — вёрстка не сломается.
MSG
