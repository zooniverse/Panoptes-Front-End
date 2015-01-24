#!/usr/bin/env bash

source "$(dirname "$0")/config.sh"

[[ -d "$BUILD_DIR" ]] && rm -rf "$BUILD_DIR"

cp -av "$DEV_DIR" "$BUILD_DIR"

[[ -f "$BUILD_DIR/$VENDOR_JS" ]] && rm "$BUILD_DIR/$VENDOR_JS"
[[ -f "$BUILD_DIR/$OUT_JS" ]] && rm "$BUILD_DIR/$OUT_JS"
[[ -f "$BUILD_DIR/$OUT_CSS" ]] && rm "$BUILD_DIR/$OUT_CSS"

./node_modules/.bin/browserify \
  --transform envify \
  $(flag_externals require) \
  --outfile "$BUILD_DIR/$VENDOR_JS"

./node_modules/.bin/uglifyjs \
  "$BUILD_DIR/$VENDOR_JS" \
  --mangle \
  --compress \
  --output "$BUILD_DIR/$VENDOR_JS"

./node_modules/.bin/browserify \
  $(flag_externals external) \
  --extension .cjsx \
  --extension .coffee \
  --ignore-transform coffeeify \
  --transform coffee-reactify \
  --transform envify \
  --entry "$SRC_JS" \
  --outfile "$BUILD_DIR/$OUT_JS"

./node_modules/.bin/uglifyjs \
  "$BUILD_DIR/$OUT_JS" \
  --mangle \
  --compress \
  --output "$BUILD_DIR/$OUT_JS"

./node_modules/.bin/stylus \
  --use nib \
  --import nib \
  --out "$BUILD_DIR" \
  "$SRC_CSS"

./node_modules/.bin/csso \
  "$BUILD_DIR/$OUT_CSS" \
  "$BUILD_DIR/$OUT_CSS"

echo
echo "$BUILD_DIR/$VENDOR_JS:" $(cat "$BUILD_DIR/$VENDOR_JS" | gzip --best | wc -c) "bytes gzipped"
echo "$BUILD_DIR/$OUT_JS:" $(cat "$BUILD_DIR/$OUT_JS" | gzip --best | wc -c) "bytes gzipped"
echo "$BUILD_DIR/$OUT_CSS:" $(cat "$BUILD_DIR/$OUT_CSS" | gzip --best | wc -c) "bytes gzipped"
