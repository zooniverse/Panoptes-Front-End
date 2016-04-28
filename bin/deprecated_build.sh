#!/usr/bin/env bash

set -e

source "$(dirname "$0")/config.sh"

[[ -d "$BUILD_DIR" ]] && rm -rf "$BUILD_DIR"

cp -av "$DEV_DIR" "$BUILD_DIR"

[[ -f "$BUILD_DIR/$VENDOR_JS" ]] && rm "$BUILD_DIR/$VENDOR_JS"
[[ -f "$BUILD_DIR/$OUT_JS" ]] && rm "$BUILD_DIR/$OUT_JS"
[[ -f "$BUILD_DIR/$OUT_CSS" ]] && rm "$BUILD_DIR/$OUT_CSS"

./node_modules/.bin/browserify \
  --global-transform envify \
  $(flag_externals require) \
  --outfile "$BUILD_DIR/$VENDOR_JS"

./node_modules/.bin/uglifyjs \
  "$BUILD_DIR/$VENDOR_JS" \
  --mangle \
  --compress \
  --output "$BUILD_DIR/$VENDOR_JS"

vendor_js_original=$VENDOR_JS
VENDOR_JS=$(rename_with_hash "$BUILD_DIR/$VENDOR_JS")
mv -v "$BUILD_DIR/$vendor_js_original" "$BUILD_DIR/$VENDOR_JS"

./node_modules/.bin/browserify \
  $(flag_externals external) \
  --extension .cjsx \
  --extension .coffee \
  --transform coffee-reactify \
  --global-transform envify \
  --entry "$SRC_JS" \
  --outfile "$BUILD_DIR/$OUT_JS"

./node_modules/.bin/uglifyjs \
  "$BUILD_DIR/$OUT_JS" \
  --mangle \
  --compress \
  --output "$BUILD_DIR/$OUT_JS"

out_js_original=$OUT_JS
OUT_JS=$(rename_with_hash "$BUILD_DIR/$OUT_JS")
mv -v "$BUILD_DIR/$out_js_original" "$BUILD_DIR/$OUT_JS"

./node_modules/.bin/stylus \
  --use nib \
  --import nib \
  --include-css \
  --out "$BUILD_DIR" \
  "$SRC_CSS"

./node_modules/.bin/csso \
  "$BUILD_DIR/$OUT_CSS" \
  "$BUILD_DIR/$OUT_CSS"

out_css_original=$OUT_CSS
OUT_CSS=$(rename_with_hash "$BUILD_DIR/$OUT_CSS")
mv -v "$BUILD_DIR/$out_css_original" "$BUILD_DIR/$OUT_CSS"

./bin/compile-ejs.js

echo
echo "$VENDOR_JS:" $(cat "$BUILD_DIR/$VENDOR_JS" | gzip --best | wc -c) "bytes gzipped"
echo "$OUT_JS:" $(cat "$BUILD_DIR/$OUT_JS" | gzip --best | wc -c) "bytes gzipped"
echo "$OUT_CSS:" $(cat "$BUILD_DIR/$OUT_CSS" | gzip --best | wc -c) "bytes gzipped"
