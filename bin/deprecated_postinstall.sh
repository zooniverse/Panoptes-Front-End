#!/usr/bin/env bash

set -e

FALLBACK_POLYFILLS_URL="https://cdn.polyfill.io/v1/polyfill.min.js?features=default,es6,Promise,fetch&flags=gated&ua=(MSIE%209.0)"
FONT_AWESOME_URL="https://github.com/FortAwesome/Font-Awesome/archive/v4.6.1.zip"

curl "$FALLBACK_POLYFILLS_URL" > ./public/fallback-polyfills.js

rm -rf ./public/font-awesome
curl --location "$FONT_AWESOME_URL" --output ./.font-awesome.zip
unzip -q ./.font-awesome.zip -d ./.font-awesome.tmp
mkdir ./public/font-awesome
mv ./.font-awesome.tmp/*/{css,fonts} ./public/font-awesome
rm -rf ./.font-awesome.{zip,tmp}

cp ./node_modules/jsplumb/dist/js/jsPlumb-1.7.9-min.js ./public/jsPlumb.min.js
