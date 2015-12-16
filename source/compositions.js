'use strict';

let {
  identifier,
  literal,
  variableDeclaration,
  assigns,
  member,
  expressionStatement,
  callExpression
} = require('./generators.js')

let compositions = {};

/**
 * Document API compositions
 */

const attributes = { 'className': 'class' };
const properties = ['required', 'disabled'];

compositions.createElement = (variable, tag) => {
  return variableDeclaration(
    variable,
    member('document', 'createElement'),
    [literal(tag)]
  );
}

compositions.createTextNode = (variable, text) => {
  return variableDeclaration(
    variable,
    member('document', 'createTextNode'),
    [literal(text)]
  );
}

compositions.setAttribute = (variable, attribute, assignmentExpression) => {
  let isProperty = properties.indexOf(attribute) !== -1;
  let mappedAttribute = attributes[attribute] || attribute;

  if (isProperty) {
    return assigns(
      member(variable, mappedAttribute),
      literal(true)
    );
  } else {
    return expressionStatement(
      callExpression(
        member(variable, 'setAttribute'),
        [literal(mappedAttribute), assignmentExpression]
      )
    );
  }
}

compositions.appendChild = (parent, child) => {
  return expressionStatement(
    callExpression(
      member(parent, 'appendChild'),
      [identifier(child)]
    )
  );
}

module.exports = compositions;
