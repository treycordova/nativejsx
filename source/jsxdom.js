'use strict';

let fs = require('fs');
let util = require('util');
let escodegen = require('escodegen');
let acorn = require('acorn-jsx');
let walk = require('acorn/dist/walk');

let jsxdom = {};

let allocator = jsxdom.allocator = require('./allocator.js');
let generators = jsxdom.generators = require('./generators.js');
let walker = jsxdom.walker = walk.make(require('./walkers.js'));
let transformers = jsxdom.transformers = require('./transformers.js');

jsxdom.parse = (file, options) => {
  let transpilation;
  let ast = acorn.parse(
    fs.readFileSync('test.jsx', 'utf-8'),
    {plugins: {jsx: true}}
  );

  options = options || {};

  allocator.VARIABLE_PREFIX = typeof options.variablePrefix === 'string' ?
    options.variablePrefix :
    allocator.VARIABLE_PREFIX;

  generators.DECLARATION_TYPE = generators.ALLOWABLE_DECLARATION_TYPES.indexOf(options.declarationType) !== -1 ?
    options.declarationType :
    generators.DECLARATION_TYPE;

  walk.simple(ast, transformers, walker);
  transpilation = escodegen.generate(ast)

  return transpilation;
};

module.exports = jsxdom;
