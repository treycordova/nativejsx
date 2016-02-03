'use strict';

let generators = {};

generators.ALLOWABLE_DECLARATION_TYPES = ['var', 'let'];
generators.DECLARATION_TYPE = 'var';

/**
 * JavaScript Node Generators
 */

let identifier = generators.identifier = (name) => {
  return {
    type: 'Identifier',
    name
  };
}

let literal = generators.literal = (value) => {
  return {
    type: 'Literal',
    value
  };
}

let member = generators.member = (object, property) => {
  return {
    type: 'MemberExpression',
    object: identifier(object),
    property: identifier(property)
  };
}

let expressionStatement = generators.expressionStatement = (expression) => {
  return {
    type: 'ExpressionStatement',
    expression
  };
};

let callExpression = generators.callExpression = (callee, varargs) => {
  let callExpression = {
    type: 'CallExpression',
    callee
  };

  callExpression.arguments = varargs || [];

  return callExpression;
}

let variableDeclaration = generators.variableDeclaration = (variable, callee, varargs) => {
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

let assigns = generators.assigns = (assigner, assignee) => {
  return expressionStatement({
    type: 'AssignmentExpression',
    operator: '=',
    left: assigner,
    right: assignee
  });
}

let returns = generators.returns = (argument) => {
  return {
    type: 'ReturnStatement',
    argument
  };
}

let functionExpression = generators.functionExpression = (id, params, body) => {
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

let closure = generators.closure = (body) => {
  return callExpression(
    functionExpression(null, [], body)
  );
}

let jsxidentifier = generators.jsxidentifier = (name) => {
  return {
    type: 'JSXIdentifier',
    name
  };
};

let jsxelement = generators.jsxelement = (name, attributes, children) => {
  let hasChildren = Array.isArray(children) && children.length;
  let hasAttributes = Array.isArray(attributes) && attributes.length;

  let element = {
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
