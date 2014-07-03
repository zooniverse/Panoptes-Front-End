#!/usr/bin/env bash

./node_modules/.bin/browserify \
  --verbose \
  --extension ".coffee" \
  --transform coffeeify \
  --outfile ./public/main.js \
  ./app/main.coffee

./node_modules/.bin/stylus \
  --use nib \
  --import nib \
  --out ./public \
  ./css/main.styl

./node_modules/.bin/uglifyjs \
  --screw-ie8 \
  --mangle \
  --compress \
  --output ./public/main.js \
  ./public/main.js
