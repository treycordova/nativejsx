var fs = require('fs');
var acorn = require('acorn');

var setAttributes = require('../source/prototypal-helpers/setAttributes.js');
var appendChildren = require('../source/prototypal-helpers/appendChildren.js');

var __setAttributes = setAttributes.toString().replace('setAttributes', '__setAttributes');
var __appendChildren = appendChildren.toString().replace('appendChildren', '__appendChildren');

fs.writeFileSync(
  './source/prototypal-helpers/setAttributes.ast.json',
  JSON.stringify(acorn.parse(__setAttributes).body.pop(), null, 2)
);

fs.writeFileSync(
  './source/prototypal-helpers/appendChildren.ast.json',
  JSON.stringify(acorn.parse(__appendChildren).body.pop(), null, 2)
);
