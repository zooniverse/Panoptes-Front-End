#!/usr/bin/env bash

jobs=""

[[ -f ./public/main.js ]] && rm ./public/main.js

./node_modules/.bin/watchify \
  --verbose \
  --debug \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
  --transform envify \
  --outfile ./public/main.js \
  ./app/main.cjsx \
  & jobs="$jobs $!"

[[ -f ./public/main.css ]] && rm ./public/main.css

./node_modules/.bin/stylus \
  --watch \
  --use nib \
  --import nib \
  --out ./public \
  ./css/main.styl \
  & jobs="$jobs $!"

./node_modules/.bin/static \
  --port 3735 \
  --headers '{"Cache-Control": "no-cache, must-revalidate"}' \
  ./public \
  & jobs="$jobs $!"

trap 'kill -HUP $jobs' INT TERM HUP

wait
