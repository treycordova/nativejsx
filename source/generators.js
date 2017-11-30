const generators = {}

generators.ALLOWABLE_DECLARATION_TYPES = ['var', 'let', 'const']
generators.DECLARATION_TYPE = 'var'

/**
 * JavaScript Node Generators
 */

generators.identifier = (name) => {
  return {
    type: 'Identifier',
    name
  }
}

generators.literal = (value) => {
  return {
    type: 'Literal',
    value
  }
}

generators.member = (object, property) => {
  return {
    type: 'MemberExpression',
    object,
    property
  }
}

generators.expressionStatement = (expression) => {
  return {
    type: 'ExpressionStatement',
    expression
  }
}

generators.callExpression = (callee, varargs) => {
  const callExpression = {
    type: 'CallExpression',
    callee
  }

  callExpression.arguments = varargs || []

  return callExpression
}

generators.variableDeclaration = (variable, callee, varargs) => {
  return {
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: generators.identifier(variable),
      init: generators.callExpression(callee, varargs)
    }],
    kind: generators.DECLARATION_TYPE
  }
}

generators.assigns = (assigner, assignee) => {
  return generators.expressionStatement({
    type: 'AssignmentExpression',
    operator: '=',
    left: assigner,
    right: assignee
  })
}

generators.returns = (argument) => {
  return {
    type: 'ReturnStatement',
    argument
  }
}

generators.if = (test, consequent, alternate) => {
  return {
    type: 'IfStatement',
    test,
    consequent,
    alternate
  }
}

generators.functionExpression = (id, params, body) => {
  return {
    type: 'FunctionExpression',
    id: id ? generators.identifier(id) : null,
    params: params,
    body: {
      type: 'BlockStatement',
      body
    }
  }
}

generators.thisExpression = () => {
  return {
    type: 'ThisExpression'
  }
}

generators.contextualClosure = (body) => {
  return generators.callExpression(
    generators.member(
      generators.functionExpression(null, [], body),
      generators.identifier('call')
    ),
    [
      generators.thisExpression()
    ]
  )
}

generators.jsxidentifier = (name) => {
  return {
    type: 'JSXIdentifier',
    name
  }
}

generators.jsxelement = (name, attributes, children) => {
  const hasChildren = Array.isArray(children) && children.length
  const hasAttributes = Array.isArray(attributes) && attributes.length

  const element = {
    type: 'JSXElement',
    openingElement: {
      type: 'JSXOpeningElement',
      attributes: hasAttributes ? attributes : [],
      name: generators.jsxidentifier(name),
      selfClosing: !hasChildren
    },
    children: hasChildren ? children : []
  }

  if (hasChildren) {
    element.closingElement = {
      type: 'JSXClosingElement',
      name: generators.jsxidentifier(name)
    }
  }

  return element
}

module.exports = generators
