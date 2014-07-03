#!/usr/bin/env bash

jobs=""

./node_modules/.bin/watchify \
  --verbose \
  --extension ".coffee" \
  --transform coffeeify \
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

./node_modules/.bin/serveup \
  --port 3735 \
  ./public \
  & jobs="$jobs $!"

trap 'kill -HUP $jobs' INT TERM HUP

wait
