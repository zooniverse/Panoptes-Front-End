#!/usr/bin/env bash

[[ -d ./build ]] && rm -rf ./build

cp -av ./public ./build

./node_modules/.bin/browserify \
  --verbose \
  --require react \
  --require marked \
  --transform envify \
  --outfile ./build/vendor.js

./node_modules/.bin/uglifyjs \
  --verbose \
  --screw-ie8 \
  --mangle \
  --compress \
  --output ./build/vendor.js \
  ./build/vendor.js

./node_modules/.bin/browserify \
  --verbose \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
  --transform envify \
  --external react \
  --external marked \
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
