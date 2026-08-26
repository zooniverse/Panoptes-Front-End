/**
 * Loaded by mocha before any test files via .mocharc.js `require`.
 *
 * 1. Patches Module._extensions so that extensionless ESM specifiers
 *    (e.g. `ol/View`) can resolve to fully specified files (`ol/View.js`).
 *    This mirrors webpack's `fullySpecified: false` behavior in Mocha.
 *
 * 2. Stubs `navigator` so React DOM can load before jsdom globals are set.
 */

'use strict';

const fs = require('fs');
const Module = require('module');
const path = require('path');

if (typeof global.navigator === 'undefined') {
  global.navigator = { userAgent: 'node.js' };
}

const _orig = Module._extensions['.js'];

function hasKnownExtension(specifier) {
  return /\.(?:[cm]?js|json|node)$/i.test(specifier);
}

function isSkippableSpecifier(specifier) {
  return (
    hasKnownExtension(specifier) ||
    specifier.startsWith('node:') ||
    specifier.startsWith('http:') ||
    specifier.startsWith('https:') ||
    specifier.startsWith('data:') ||
    specifier.startsWith('#')
  );
}

function canResolve(request, fromFile) {
  try {
    require.resolve(request, { paths: [path.dirname(fromFile)] });
    return true;
  } catch (_) {
    return false;
  }
}

function toFullySpecified(specifier, fromFile) {
  if (isSkippableSpecifier(specifier)) return specifier;

  const candidates = specifier.endsWith('/')
    ? [
      `${specifier}index.js`,
      `${specifier}index.mjs`,
      `${specifier}index.cjs`
    ]
    : [
      `${specifier}.js`,
      `${specifier}.mjs`,
      `${specifier}.cjs`,
      `${specifier}/index.js`,
      `${specifier}/index.mjs`,
      `${specifier}/index.cjs`
    ];

  for (const candidate of candidates) {
    if (canResolve(candidate, fromFile)) {
      return candidate;
    }
  }

  return specifier;
}

function rewriteImportSpecifiers(source, filename) {
  let changed = false;

  const rewrite = (specifier) => {
    const next = toFullySpecified(specifier, filename);
    if (next !== specifier) changed = true;
    return next;
  };

  let output = source.replace(/\bfrom\s*(["'])([^"']+)\1/g, (full, quote, spec) => {
    return `from ${quote}${rewrite(spec)}${quote}`;
  });

  output = output.replace(/\bimport\s*(["'])([^"']+)\1/g, (full, quote, spec) => {
    return `import ${quote}${rewrite(spec)}${quote}`;
  });

  output = output.replace(/\bimport\s*\(\s*(["'])([^"']+)\1\s*\)/g, (full, quote, spec) => {
    return `import(${quote}${rewrite(spec)}${quote})`;
  });

  return changed ? output : source;
}

Module._extensions['.js'] = function esmSpecifierFixer(mod, filename) {
  if (!filename.includes('/node_modules/')) {
    _orig(mod, filename);
    return;
  }

  const source = fs.readFileSync(filename, 'utf8');
  if (!source.includes('from') && !source.includes('import')) {
    _orig(mod, filename);
    return;
  }

  const patched = rewriteImportSpecifiers(source, filename);
  if (patched !== source) {
    mod._compile(patched, filename);
    return;
  }

  _orig(mod, filename);
};
