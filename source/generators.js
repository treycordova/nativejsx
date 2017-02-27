const generators = {};

generators.ALLOWABLE_DECLARATION_TYPES = ['var', 'let', 'const'];
generators.DECLARATION_TYPE = 'var';

/**
 * JavaScript Node Generators
 */

const identifier = generators.identifier = (name) => {
  return {
    type: 'Identifier',
    name
  };
}

const literal = generators.literal = (value) => {
  return {
    type: 'Literal',
    value
  };
}

const member = generators.member = (object, property) => {
  return {
    type: 'MemberExpression',
    object: identifier(object),
    property: identifier(property)
  };
}

const expressionStatement = generators.expressionStatement = (expression) => {
  return {
    type: 'ExpressionStatement',
    expression
  };
};

const callExpression = generators.callExpression = (callee, varargs) => {
  const callExpression = {
    type: 'CallExpression',
    callee
  };

  callExpression.arguments = varargs || [];

  return callExpression;
}

const variableDeclaration = generators.variableDeclaration = (variable, callee, varargs) => {
  return {
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: identifier(variable),
      init: callExpression(callee, varargs)
    }],
    kind: generators.DECLARATION_TYPE
  };
}

const assigns = generators.assigns = (assigner, assignee) => {
  return expressionStatement({
    type: 'AssignmentExpression',
    operator: '=',
    left: assigner,
    right: assignee
  });
}

const returns = generators.returns = (argument) => {
  return {
    type: 'ReturnStatement',
    argument
  };
}

const functionExpression = generators.functionExpression = (id, params, body) => {
  return {
    type: 'FunctionExpression',
    id: id ? identifier(id) : null,
    params: params,
    body: {
      type: 'BlockStatement',
      body
    }
  };
};

const closure = generators.closure = (body) => {
  return callExpression(
    functionExpression(null, [], body)
  );
}

const jsxidentifier = generators.jsxidentifier = (name) => {
  return {
    type: 'JSXIdentifier',
    name
  };
};

const jsxelement = generators.jsxelement = (name, attributes, children) => {
  const hasChildren = Array.isArray(children) && children.length;
  const hasAttributes = Array.isArray(attributes) && attributes.length;

  const element = {
    type: 'JSXElement',
    openingElement: {
      type: 'JSXOpeningElement',
      attributes: hasAttributes ? attributes : [],
      name: jsxidentifier(name),
      selfClosing: !hasChildren
    },
    children: hasChildren ? children : []
  };

  if (hasChildren) {
    element.closingElement = {
      type: 'JSXClosingElement',
      name: jsxidentifier(name)
    };
  }

  return element;
};

module.exports = generators;
