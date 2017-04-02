const generators = require('./generators.js')
const compositions = require('./compositions.js')

const transformers = {
  INLINE_NATIVEJSX_HELPERS: false,
  MODULE_NATIVEJSX_HELPERS: false
}

/**
 * JSX to DOM transformers
 */

transformers.JSXAttribute = (node, state) => {
  let transform
  const name = node.name.name
  const value = node.value.expression
    ? node.value.expression
    : node.value

  if (name.startsWith('on')) {
    transform = compositions.addEventListener(state.name, name.substring(2).toLowerCase(), value)
  } else if (name === 'style') {
    if (transformers.INLINE_NATIVEJSX_HELPERS) {
      transform = compositions.setStylesInline([
        generators.identifier(state.name),
        value
      ])
    } else if (transformers.MODULE_NATIVEJSX_HELPERS) {
      transform = compositions.setStylesModule([
        generators.identifier(state.name),
        value
      ])
    } else {
      transform = compositions.setStyles(state.name, value)
    }
  } else if (name === 'ref' && value.type !== generators.literal('').type) {
    transform = compositions.setReference(state.name, value)
  } else {
    transform = compositions.setAttribute(state.name, name, value)
  }

  for (let key in node) delete node[key]
  for (let key in transform) node[key] = transform[key]
}

transformers.JSXSpreadAttribute = (node, state) => {
  let transform
  const value = node.argument.name

  if (transformers.INLINE_NATIVEJSX_HELPERS) {
    transform = compositions.setAttributesInline([
      generators.identifier(state.name),
      generators.identifier(value)
    ])
  } else if (transformers.MODULE_NATIVEJSX_HELPERS) {
    transform = compositions.setAttributesModule([
      generators.identifier(state.name),
      generators.identifier(value)
    ])
  } else {
    transform = compositions.setAttributes(
      state.name,
      generators.identifier(value)
    )
  }

  for (let key in node) delete node[key]
  for (let key in transform) node[key] = transform[key]
}

transformers.JSXElement = (node, state) => {
  let body = [
    compositions.createElement(state.name, node.openingElement.name.name)
  ].concat(node.openingElement.attributes)

  if (state.parent) {
    node.transform = body.concat(
      compositions.appendChild(state.parent, state.name)
    )
  } else {
    (function flatten (node) {
      for (let child of node.children) {
        if (child.transform) body = body.concat(child.transform)
        if (child.children) flatten(child)
      }
    })(node)

    body = generators.contextualClosure(
      body.concat(
        generators.returns(generators.identifier(state.name))
      )
    )

    for (let key in body) node[key] = body[key]
  }
}

transformers.JSXExpressionContainer = (node, state) => {
  if (transformers.INLINE_NATIVEJSX_HELPERS) {
    node.transform = compositions.appendChildrenInline([
      generators.identifier(state.parent),
      node.expression
    ])
  } else if (transformers.MODULE_NATIVEJSX_HELPERS) {
    node.transform = compositions.appendChildrenModule([
      generators.identifier(state.parent),
      node.expression
    ])
  } else {
    node.transform = compositions.appendChildren(
      state.parent,
      node.expression
    )
  }
}

transformers.Literal = (node, state) => {
  if (state && state.parent && state.name) {
    node.transform = [
      compositions.createTextNode(state.name, generators.literal(node.value)),
      compositions.appendChild(state.parent, state.name)
    ]
  }
}

module.exports = transformers
