'use strict';

let fs = require('fs');
let util = require('util');

let merge = require('merge');
let escodegen = require('escodegen');
let acorn = require('acorn-jsx');
let walk = require('acorn/dist/walk');

let nativejsx = {};

const defaults = {
  encoding: 'utf-8',
  variablePrefix: '$$',
  declarationType: 'var',
  prototypes: true,
  acorn: {
    plugins: {
      jsx: true
    },
    ecmaVersion: 6
  }
};

let allocator = nativejsx.allocator = require('./allocator.js');
let generators = nativejsx.generators = require('./generators.js');
let walker = nativejsx.walker = walk.make(require('./walkers.js'));
let transformers = nativejsx.transformers = require('./transformers.js');
let safeOptions = (options) => {
  let copy = merge(
    {},
    defaults,
    util.isObject(options) ? options : {}
  );

  // Make sure that the JSX plugin isn't clobbered.
  copy.acorn = copy.hasOwnProperty('acorn') ?
    copy.acorn : {};
  copy.acorn.plugins = copy.acorn.hasOwnProperty('plugins') ?
    copy.acorn.plugins : {};
  copy.acorn.plugins.jsx = true;

  return copy;
};

/**
 * @function transpile
 * @description
 * Transpiles a String containing JSX source code to JavaScript
 * enhanced with native DOM API calls that reflect the original JSX.
 *
 * @param {String} jsx - JSX source code in String format.
 * @param {JSXOptions} options - User-defined compilation options.
 * @returns {String} - A String representing JSX transpiled to JavaScript.
 */
let transpile = nativejsx.transpile = (jsx, options) => {
  let safe = safeOptions(options);
  let isValidDeclarationType = generators.
    ALLOWABLE_DECLARATION_TYPES.
    indexOf(safe.declarationType) !== -1;

  allocator.reset();
  allocator.VARIABLE_PREFIX = typeof safe.variablePrefix === 'string' ?
    safe.variablePrefix :
    allocator.VARIABLE_PREFIX;

  generators.DECLARATION_TYPE = isValidDeclarationType ?
    safe.declarationType :
    generators.DECLARATION_TYPE;

  transformers.INLINE_NATIVEJSX_HELPERS = safe.prototypes === 'inline';

  let ast = acorn.parse(jsx, safe.acorn);
  walk.simple(ast, transformers, walker);

  if (transformers.INLINE_NATIVEJSX_HELPERS) {
    ast.body = [
      require('./prototypal-helpers/setAttributes.ast.json'),
      require('./prototypal-helpers/appendChildren.ast.json'),
    ].concat(ast.body);
  }
  return escodegen.generate(ast);
};

/**
 * @function parse
 * @description
 * Transforms the JSX AST by reading the specified file and using nativejsx to
 * transpile it to valid JavaScript. This function operates asynchronously
 * and resolves through the Promise API.
 * @param {String} file - A path to and including the JSX file.
 * @param {JSXOptions} options - User-defined compilation options.
 * @returns {Promise} - A Promise that resolves when the file is read and transpiled.
 */
nativejsx.parse = (file, options) => {
  let safe = safeOptions(options);

  return new Promise((resolve, reject) => {
    fs.readFile(file, safe.encoding, function(error, contents) {
      if (error) return reject(error);
      resolve(transpile(contents, safe));
    });
  });
};

/**
 * @function parseSync
 * @description
 * Transforms the JSX AST by reading the specified file and using nativejsx to
 * transpile it to valid JavaScript. This function operates synchronously
 * (much like readFileSync in node.js).
 * @param {String} file - A path to and including the JSX file.
 * @param {JSXOptions} options - User-defined compilation options.
 * @returns {String} - A String containing valid JavaScript.
 */
nativejsx.parseSync = (file, options) => {
  let safe = safeOptions(options);

  return transpile(
    fs.readFileSync(file, safe.encoding),
    options
  );
};

module.exports = nativejsx;
