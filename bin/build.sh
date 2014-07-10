#!/usr/bin/env bash

rm -rf ./build

cp -av ./public ./build

./node_modules/.bin/browserify \
  --verbose \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
  --transform envify \
  --outfile ./build/main.js \
  ./app/main.coffee

./node_modules/.bin/uglifyjs \
  --verbose \
  --screw-ie8 \
  --mangle \
  --compress \
  --output ./build/main.js \
  ./build/main.js

./node_modules/.bin/stylus \
  --use nib \
  --import nib \
  --out ./build \
  ./css/main.styl

./node_modules/.bin/csso \
  ./build/main.css \
  ./build/main.css
