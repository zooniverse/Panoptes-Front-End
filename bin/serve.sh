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
  --use nib \
  --import nib \
  --out "$DEV_DIR" \
  ./css/main.styl \
  & jobs="$jobs $!"

./node_modules/.bin/static \
  --port "$PORT" \
  --headers '{"Cache-Control": "no-cache, must-revalidate"}' \
  "$DEV_DIR" \
  & jobs="$jobs $!"

trap 'kill -HUP $jobs' INT TERM HUP

wait
