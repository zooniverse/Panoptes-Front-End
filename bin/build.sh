#!/usr/bin/env bash

source "$(dirname "$0")/config.sh"

[[ -d "$BUILD_DIR" ]] && rm -rf "$BUILD_DIR"

cp -av "$DEV_DIR" "$BUILD_DIR"

./node_modules/.bin/browserify \
  --verbose \
  --extension ".coffee" \
  --extension ".cjsx" \
  --transform coffee-reactify \
  --transform envify \
  --plugin bundle-collapser/plugin \
  --outfile "$BUILD_DIR/$OUT_JS" \
  "$SRC_JS"

./node_modules/.bin/uglifyjs \
  --verbose \
  --screw-ie8 \
  --mangle \
  --compress \
  --output "$BUILD_DIR/$OUT_JS" \
  "$BUILD_DIR/$OUT_JS"

./node_modules/.bin/stylus \
  --use nib \
  --import nib \
  --out "$BUILD_DIR" \
  "$SRC_CSS"

./node_modules/.bin/csso \
  "$BUILD_DIR/$OUT_CSS" \
  "$BUILD_DIR/$OUT_CSS"
