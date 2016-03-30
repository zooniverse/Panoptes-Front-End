#!/usr/bin/env bash

set -e

source "$(dirname "$0")/config.sh"

pids=""

[[ -f "$DEV_DIR/$VENDOR_JS" ]] && rm "$DEV_DIR/$VENDOR_JS"
[[ -f "$DEV_DIR/$OUT_JS" ]] && rm "$DEV_DIR/$OUT_JS"
[[ -f "$DEV_DIR/$OUT_CSS" ]] && rm "$DEV_DIR/$OUT_CSS"
[[ -f "$DEV_DIR/$OUT_HTML" ]] && rm "$DEV_DIR/$OUT_HTML"

./node_modules/.bin/browserify \
  $([[ -z $DEBUG ]] || echo '--debug') \
  --global-transform envify \
  $(flag_externals require) \
  --outfile "$DEV_DIR/$VENDOR_JS"

echo "$DEV_DIR/$VENDOR_JS:" $(cat "$DEV_DIR/$VENDOR_JS" | wc -c) "bytes"

./node_modules/.bin/watchify \
  --delay 0 \
  --verbose \
  $([[ -z $DEBUG ]] || echo '--debug') \
  $(flag_externals external) \
  --extension .cjsx \
  --extension .coffee \
  --transform coffee-reactify \
  --global-transform envify \
  --entry $SRC_JS \
  --outfile $DEV_DIR/$OUT_JS \
  & pids="$pids $!"

./node_modules/.bin/stylus \
  --watch \
  --sourcemap-inline \
  --use nib \
  --import nib \
  --include-css \
  --out "$DEV_DIR" \
  "$SRC_CSS" \
  & pids="$pids $!"

./bin/serve.js \
  & pids="$pids $!"

trap 'kill -HUP $pids' INT TERM HUP

wait
