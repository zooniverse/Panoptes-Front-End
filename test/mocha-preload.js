/**
 * Loaded by mocha before any test files via .mocharc.js `require`.
 *
 * 1. Patches Module._extensions so that react-openlayers' extensionless ESM
 *    deep imports (e.g. `ol/View`) resolve to the real files (`ol/View.js`).
 *    This mirrors the `fullySpecified: false` rule already in webpack configs.
 *
 * 2. Stubs `navigator` so React DOM can load before jsdom globals are set.
 */

'use strict';

const fs = require('fs');
const Module = require('module');

if (typeof global.navigator === 'undefined') {
  global.navigator = { userAgent: 'node.js' };
}

const _orig = Module._extensions['.js'];
Module._extensions['.js'] = function olImportFixer(mod, filename) {
  if (filename.endsWith('/node_modules/react-openlayers/dist/index.js')) {
    const src = fs.readFileSync(filename, 'utf8');
    const patched = src.replace(/from"((?:ol|react|react-dom)\/[^"]+?)"/g, (m, s) =>
      s.endsWith('.js') ? m : `from"${s}.js"`
    );
    mod._compile(patched, filename);
    return;
  }
  _orig(mod, filename);
};
