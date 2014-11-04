#!/usr/bin/env bash

source "$(dirname "$0")/config.sh"

[[ -d "$BUILD_DIR" ]] && rm -rf "$BUILD_DIR"

cp -av "$DEV_DIR" "$BUILD_DIR"
[[ -f "$BUILD_DIR/$OUT_JS" ]] && rm "$BUILD_DIR/$OUT_JS"
[[ -f "$BUILD_DIR/$OUT_CSS" ]] && rm "$BUILD_DIR/$OUT_CSS"

./node_modules/.bin/webpack --production --progress --config webpack.build.config.js

./node_modules/.bin/uglifyjs \
  --verbose \
  --screw-ie8 \
  --mangle \
  --compress drop_console \
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
