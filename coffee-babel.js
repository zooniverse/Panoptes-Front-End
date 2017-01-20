var fs = require('fs');
var coffee = require("coffee-react");
var babel = require("babel-core");

require.extensions['.cjsx'] = function(module, filename) {
  console.log(filename);
    var content = fs.readFileSync(filename, 'utf8');
    console.log('Read file');
    var compiled = coffee.compile(content, {bare: true});
    console.log('Parsed coffeescript');
    compiled = babel.transform(compiled, {presets:["es2015"]}).code;
    console.log('Parsed ES6')
    return module._compile(compiled, filename); // module._compile is not mentioned in the Node docs, what is it? And why is it private-ish?
};