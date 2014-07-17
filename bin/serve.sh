#!/usr/bin/env bash

jobs=""

# TODO: Bundle external libs separately.
# ./node_modules/.bin/browserify \
#   --verbose \
#   --debug \
#   --require react \
#   --transform envify \
#   --outfile ./public/vendor.js \
#   &

# TODO: Prevent React from being bundled. Currently broken (#828).
# --external react
# --no-bundle-external
# Then include "vendor.js" in index.html

./node_modules/.bin/watchify \
  --verbose \
  --debug \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
  --transform envify \
  --outfile ./public/main.js \
  ./app/main.coffee \
  & jobs="$jobs $!"

./node_modules/.bin/stylus \
  --use nib \
  --import nib \
  --out ./public \
  --watch \
  ./css/main.styl \
  & jobs="$jobs $!"

./node_modules/.bin/static \
  --port 3735 \
  --headers '{"Cache-Control": "no-cache, must-revalidate"}' \
  ./public \
  & jobs="$jobs $!"

trap 'kill -HUP $jobs' INT TERM HUP

wait
