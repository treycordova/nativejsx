const generators = require('./generators.js')
const compositions = {}

/**
 * Document API compositions
 */

const attributes = { 'className': 'class' }
const properties = ['required', 'disabled']

compositions.createElement = (variable, tag) => {
  return generators.variableDeclaration(
    variable,
    generators.member(
      generators.identifier('document'),
      generators.identifier('createElement')
    ),
    [generators.literal(tag)]
  )
}

compositions.createTextNode = (variable, expression) => {
  return generators.variableDeclaration(
    variable,
    generators.member(
      generators.identifier('document'),
      generators.identifier('createTextNode')
    ),
    [expression]
  )
}

compositions.setAttribute = (variable, attribute, assignmentExpression) => {
  let isProperty = properties.indexOf(attribute) !== -1
  let mappedAttribute = attributes[attribute] || attribute

  if (isProperty) {
    return generators.assigns(
      generators.member(
        generators.identifier(variable),
        generators.identifier(mappedAttribute)
      ),
      generators.literal(true)
    )
  } else {
    return generators.expressionStatement(
      generators.callExpression(
        generators.member(
          generators.identifier(variable),
          generators.identifier('setAttribute')
        ),
        [generators.literal(mappedAttribute), assignmentExpression]
      )
    )
  }
}

compositions.setAttributes = (variable, assignmentExpression) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(
        generators.identifier(variable),
        generators.identifier('setAttributes')
      ),
      [assignmentExpression]
    )
  )
}

compositions.setAttributesInline = (varargs) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.identifier('__setAttributes'),
      varargs || []
    )
  )
}

compositions.setStyles = (variable, assignmentExpression) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(
        generators.identifier(variable),
        generators.identifier('setStyles')
      ),
      [assignmentExpression]
    )
  )
}

compositions.setStylesInline = (varargs) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.identifier('__setStyles'),
      varargs || []
    )
  )
}

compositions.addEventListener = (variable, event, expression) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(
        generators.identifier(variable),
        generators.identifier('addEventListener')
      ),
      [generators.literal(event), expression]
    )
  )
}

compositions.appendChild = (parent, child) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(
        generators.identifier(parent),
        generators.identifier('appendChild')
      ),
      [generators.identifier(child)]
    )
  )
}

compositions.appendChildren = (parent, expression) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(
        generators.identifier(parent),
        generators.identifier('appendChildren')
      ),
      [expression]
    )
  )
}

compositions.appendChildrenInline = (varargs) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.identifier('__appendChildren'),
      varargs || []
    )
  )
}

module.exports = compositions
