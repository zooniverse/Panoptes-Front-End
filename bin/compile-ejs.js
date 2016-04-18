#!/usr/bin/env node

var fs = require('fs');
var ejs = require('ejs');
var path = require('path');

var sourceHTML = fs.readFileSync(process.env.SRC_HTML).toString();
var outputHTML = ejs.render(sourceHTML);

var outputPath = path.resolve(process.env.BUILD_DIR, process.env.OUT_HTML);
fs.writeFileSync(outputPath, outputHTML);

console.log('Compiled EJS:', process.env.SRC_HTML, '->', outputPath);
