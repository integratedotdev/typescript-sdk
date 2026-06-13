#!/usr/bin/env bash
# Downloads integration logos into this folder for review before Vercel Blob upload.
# Target base URL after upload: https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/

set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
TMP="$DIR/.tmp"
mkdir -p "$TMP"

# name:simple-icons-slug OR name:domain-for-favicon
SOURCES=(
  "alpaca:alpaca.markets"
  "astronomer:astronomer.io"
  "auth0:auth0"
  "aws:amazonaws"
  "betterstack:betterstack.com"
  "binance:binance"
  "clerk:clerk"
  "convex:convex"
  "etoro:etoro.com"
  "granola:granola.ai"
  "mercury:mercury.com"
  "neon:neondatabase"
  "phantom:phantom"
  "postman:postman"
  "redis:redis"
  "resend:resend"
  "tldraw:tldraw"
  "trello:trello"
  "wix:wix"
  "workos:workos"
)

download_simple_icon() {
  local slug="$1" out="$2"
  if curl -fsSL "https://cdn.simpleicons.org/${slug}" -o "$out"; then
    return 0
  fi
  return 1
}

download_site_icon() {
  local domain="$1" out="$2"
  for url in \
    "https://${domain}/apple-touch-icon.png" \
    "https://${domain}/favicon.ico" \
    "https://www.${domain}/apple-touch-icon.png" \
    "https://www.${domain}/favicon.ico"; do
    if curl -fsSL "$url" -o "$out" && [[ -s "$out" ]]; then
      return 0
    fi
  done
  return 1
}

svg_to_png() {
  local svg="$1" png="$2"
  qlmanage -t -s 512 -o "$(dirname "$svg")" "$svg" >/dev/null 2>&1
  local generated="${svg}.png"
  if [[ -f "$generated" ]]; then
    mv "$generated" "$png"
    return 0
  fi
  return 1
}

for entry in "${SOURCES[@]}"; do
  name="${entry%%:*}"
  source="${entry#*:}"
  png="$DIR/${name}.png"
  raw="$TMP/${name}.raw"

  echo "→ ${name}"

  if download_simple_icon "$source" "$raw" 2>/dev/null; then
    if svg_to_png "$raw" "$png"; then
      rm -f "$raw"
      echo "  ✓ simple-icons (${source})"
      continue
    fi
  fi

  if download_site_icon "$source" "$raw" 2>/dev/null; then
    if file "$raw" | grep -qi 'svg'; then
      if svg_to_png "$raw" "$png"; then
        rm -f "$raw"
        echo "  ✓ site svg (${source})"
        continue
      fi
    elif file "$raw" | grep -qiE 'png|jpeg|image'; then
      sips -s format png "$raw" --out "$png" >/dev/null 2>&1 || cp "$raw" "$png"
      rm -f "$raw"
      echo "  ✓ site raster (${source})"
      continue
    fi
  fi

  echo "  ✗ failed — add ${name}.png manually"
  rm -f "$raw"
done

rm -rf "$TMP"
echo "Done. Review PNGs in: $DIR"
