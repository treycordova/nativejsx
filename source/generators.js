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

let closure = generators.closure = (body) => {
  return callExpression({
    type: 'FunctionExpression',
    id: null,
    params: [],
    body: {
      type: 'BlockStatement',
      body
    }
  });
}

module.exports = generators;
