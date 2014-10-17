#!/usr/bin/env bash

source "$(dirname "$0")/config.sh"

jobs=""

[[ -f "$DEV_DIR/$OUT_JS" ]] && rm "$DEV_DIR/$OUT_JS"

./node_modules/.bin/watchify \
  --verbose \
  --debug \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
  --transform envify \
  --outfile "$DEV_DIR/$OUT_JS" \
  "$SRC_JS" \
  & jobs="$jobs $!"

[[ -f "$DEV_DIR/$OUT_CSS" ]] && rm "$DEV_DIR/$OUT_CSS"

./node_modules/.bin/stylus \
  --watch \
  --sourcemap-inline \
  --use nib \
  --import nib \
  --out "$DEV_DIR" \
  "$SRC_CSS" \
  & jobs="$jobs $!"

# If these files don't exist, BrowserSync won't detect when they change.
touch "$DEV_DIR/$OUT_JS"
touch "$DEV_DIR/$OUT_CSS"

./node_modules/.bin/browser-sync \
  start \
  --logLevel debug \
  --server "$DEV_DIR" \
  --port "$PORT" \
  --files "$DEV_DIR/*.{html,js,css}" \
  --no-open \
  --no-notify \
  & jobs="$jobs $!"

trap 'kill -HUP $jobs' INT TERM HUP

wait
