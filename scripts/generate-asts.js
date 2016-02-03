var fs = require('fs');
var acorn = require('acorn');
var setAttributes = require('../source/prototypal-helpers/setAttributes.js');
var appendChildren = require('../source/prototypal-helpers/appendChildren.js');

fs.writeFileSync(
  './source/prototypal-helpers/setAttributes.ast.json',
  JSON.stringify(acorn.parse(setAttributes.toString()).body.pop(), null, 2)
);

fs.writeFileSync(
  './source/prototypal-helpers/appendChildren.ast.json',
  JSON.stringify(acorn.parse(appendChildren.toString()).body.pop(), null, 2)
);
