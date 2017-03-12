const fs = require('fs')
const acorn = require('acorn')

const setAttributes = require('../source/prototypal-helpers/setAttributes.js')
const setStyles = require('../source/prototypal-helpers/setStyles.js')
const appendChildren = require('../source/prototypal-helpers/appendChildren.js')

const __setAttributes = setAttributes.toString().replace('setAttributes', '__setAttributes')
const __setStyles = setStyles.toString().replace('setStyles', '__setStyles')
const __appendChildren = appendChildren.toString().replace('appendChildren', '__appendChildren')

fs.writeFileSync(
  './source/prototypal-helpers/setAttributes.ast.json',
  JSON.stringify(acorn.parse(__setAttributes).body.pop(), null, 2)
)

fs.writeFileSync(
  './source/prototypal-helpers/setStyles.ast.json',
  JSON.stringify(acorn.parse(__setStyles).body.pop(), null, 2)
)

fs.writeFileSync(
  './source/prototypal-helpers/appendChildren.ast.json',
  JSON.stringify(acorn.parse(__appendChildren).body.pop(), null, 2)
)
