#!/usr/bin/env bash

set -e

FALLBACK_POLYFILLS_URL="https://cdn.polyfill.io/v1/polyfill.min.js?features=default,es6,Promise,fetch&flags=gated&ua=(MSIE%209.0)"
FONT_AWESOME_URL="https://github.com/FortAwesome/Font-Awesome/blob/8027c940b6/assets/font-awesome-4.2.0.zip?raw=true"

curl "$FALLBACK_POLYFILLS_URL" > ./public/fallback-polyfills.js

rm -rf ./public/font-awesome
curl --location "$FONT_AWESOME_URL" --output ./.font-awesome.zip
unzip -q ./.font-awesome.zip -d ./.font-awesome.tmp
mkdir ./public/font-awesome
mv ./.font-awesome.tmp/*/{css,fonts} ./public/font-awesome
rm -rf ./.font-awesome.{zip,tmp}
