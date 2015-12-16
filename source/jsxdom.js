'use strict';

let fs = require('fs');
let util = require('util');
let escodegen = require('escodegen');
let acorn = require('acorn-jsx');
let walk = require('../node_modules/acorn-jsx/node_modules/acorn/dist/walk.js');

let jsxdom = {};
let walker = jsxdom.walker = walk.make(require('./walkers.js'));
let transformers = jsxdom.transformers = require('./transformers.js');

jsxdom.parse = (file, options) => {
  let transpilation;
  let ast = acorn.parse(
    fs.readFileSync('test.jsx', 'utf-8'),
    {plugins: {jsx: true}}
  );

  walk.simple(ast, transformers, walker);
  transpilation = escodegen.generate(ast)

  return transpilation;
};

module.exports = jsxdom;
