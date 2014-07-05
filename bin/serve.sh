#!/usr/bin/env bash

jobs=""

./node_modules/.bin/watchify \
  --verbose \
  --debug \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
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
