const fs = require('fs')
const util = require('util')

const merge = require('merge')
const escodegen = require('escodegen')
const acorn = require('acorn-jsx')
const walk = require('acorn/dist/walk')

const nativejsx = {}

const defaults = {
  encoding: 'utf-8',
  variablePrefix: '$$',
  declarationType: 'var',
  prototypes: true,
  acorn: {
    plugins: {
      jsx: true
    },
    ecmaVersion: 8,
    sourceType: 'module'
  }
}

const allocator = nativejsx.allocator = require('./allocator.js')
const generators = nativejsx.generators = require('./generators.js')
const walker = nativejsx.walker = walk.make(require('./walkers.js'))
const transformers = nativejsx.transformers = require('./transformers.js')
const safeOptions = (options) => {
  let copy = merge(
    {},
    defaults,
    util.isObject(options) ? options : {}
  )

  // Make sure that the JSX plugin isn't clobbered.
  copy.acorn = copy.hasOwnProperty('acorn')
    ? copy.acorn : {}
  copy.acorn.plugins = copy.acorn.hasOwnProperty('plugins')
    ? copy.acorn.plugins : {}
  copy.acorn.plugins.jsx = true

  return copy
}

/**
 * @function setAttributes
 * @description
 * Sets multiple attributes at once using an object. This object
 * must map to HTML-compliant attributes.
 */
nativejsx.setAttributes = require('./prototypal-helpers/setAttributes.js')
const setAttributesAST = require('./prototypal-helpers/setAttributes.ast.json')

/**
 * @function appendChildren
 * @description
 * Appends multiple children at once using an array. Each child
 * should be an HTMLElement or a string. If they're not, the function
 * silently does nothing.
 */
nativejsx.appendChildren = require('./prototypal-helpers/appendChildren.js')
const appendChildrenAST = require('./prototypal-helpers/appendChildren.ast.json')

/**
 * @function setStyles
 * @description
 * Sets CSS-based styles on any valid Element using the
 * .style DOM API.
 */
nativejsx.setStyles = require('./prototypal-helpers/setStyles.js')
const setStylesAST = require('./prototypal-helpers/setStyles.ast.json')

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
const transpile = nativejsx.transpile = (jsx, options) => {
  const safe = safeOptions(options)
  const isValidDeclarationType = generators
    .ALLOWABLE_DECLARATION_TYPES
    .indexOf(safe.declarationType) !== -1

  allocator.reset()
  allocator.VARIABLE_PREFIX = typeof safe.variablePrefix === 'string'
    ? safe.variablePrefix
    : allocator.VARIABLE_PREFIX

  generators.DECLARATION_TYPE = isValidDeclarationType
    ? safe.declarationType
    : generators.DECLARATION_TYPE

  transformers.INLINE_NATIVEJSX_HELPERS = safe.prototypes === 'inline'
  transformers.MODULE_NATIVEJSX_HELPERS = safe.prototypes === 'module'

  const state = {transformed: false}
  const ast = acorn.parse(jsx, safe.acorn)

  walk.simple(ast, transformers, walker, state)

  if (state.transformed) {
    if (transformers.INLINE_NATIVEJSX_HELPERS) {
      ast.body = [
        setAttributesAST,
        setStylesAST,
        appendChildrenAST
      ].concat(ast.body)
    }

    return escodegen.generate(ast)
  } else {
    return jsx
  }
}

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
  const safe = safeOptions(options)

  return new Promise((resolve, reject) => {
    fs.readFile(file, safe.encoding, (error, contents) => {
      if (error) return reject(error)
      resolve(transpile(contents, safe))
    })
  })
}

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
  const safe = safeOptions(options)

  return transpile(
    fs.readFileSync(file, safe.encoding),
    options
  )
}

module.exports = nativejsx
