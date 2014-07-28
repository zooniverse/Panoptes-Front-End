#!/usr/bin/env bash

jobs=""

# Bundle big external libs separately to keep recompile time down.
[[ -f ./public/vendor.js ]] && rm ./public/vendor.js
./node_modules/.bin/browserify \
  --verbose \
  --debug \
  --require react \
  --require marked \
  --transform envify \
  --outfile ./public/vendor.js \
  &

[[ -f ./public/main.js ]] && rm ./public/main.js
./node_modules/.bin/watchify \
  --verbose \
  --debug \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
  --transform envify \
  --external react \
  --external marked \
  --outfile ./public/main.js \
  ./app/main.coffee \
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
