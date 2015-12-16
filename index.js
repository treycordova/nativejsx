'use strict';

let fs = require('fs');
let jsxdom = require('./source/jsxdom.js');
let transpiled = jsxdom.parse('test.jsx', {
  declarationType: 'var',
  variablePrefix: '__'
});

console.log(transpiled);
fs.writeFileSync('test.js', transpiled);
