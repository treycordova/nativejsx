'use strict';

let generators = require('./generators.js');
let compositions = {};

/**
 * Document API compositions
 */

const attributes = { 'className': 'class' };
const properties = ['required', 'disabled'];

compositions.createElement = (variable, tag) => {
  return generators.variableDeclaration(
    variable,
    generators.member('document', 'createElement'),
    [generators.literal(tag)]
  );
};

compositions.createTextNode = (variable, expression) => {
  return generators.variableDeclaration(
    variable,
    generators.member('document', 'createTextNode'),
    [expression]
  );
};

compositions.setAttribute = (variable, attribute, assignmentExpression) => {
  let isProperty = properties.indexOf(attribute) !== -1;
  let mappedAttribute = attributes[attribute] || attribute;

  if (isProperty) {
    return generators.assigns(
      generators.member(variable, mappedAttribute),
      generators.literal(true)
    );
  } else {
    return generators.expressionStatement(
      generators.callExpression(
        generators.member(variable, 'setAttribute'),
        [generators.literal(mappedAttribute), assignmentExpression]
      )
    );
  }
};

compositions.setAttributes = (variable, assignmentExpression) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(variable, 'setAttributes'),
      [assignmentExpression]
    )
  );
};

compositions.setAttributesInline = (variable, varargs) => {
  return generators.callExpression(
    generators.identifier('__setAttributes'),
    varargs || []
  );
};

compositions.addEventListener = (variable, event, expression) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(variable, 'addEventListener'),
      [generators.literal(event), expression]
    )
  );
};

compositions.appendChild = (parent, child) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(parent, 'appendChild'),
      [generators.identifier(child)]
    )
  );
};

compositions.appendChildren = (parent, expression) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.member(parent, 'appendChildren'),
      [expression]
    )
  );
};

compositions.appendChildrenInline = (varargs) => {
  return generators.expressionStatement(
    generators.callExpression(
      generators.identifier('__appendChildren'),
      varargs || []
    )
  );
};

module.exports = compositions;
