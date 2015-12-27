'use strict';

let {
  returns,
  identifier,
  literal,
  closure
} = require('./generators.js');

let {
  createElement,
  createTextNode,
  setAttribute,
  addEventListener,
  appendChild,
  appendChildren,
  returnElement
} = require('./compositions.js');

let transformers = {};

/**
 * JSX to DOM transformers
 */

transformers.JSXAttribute = (node, state) => {
  let name = node.name.name;
  let value = node.value.expression ?
    node.value.expression :
    node.value;
  let transform = name.startsWith('on') ?
    addEventListener(state.name, name.substring(2).toLowerCase(), value) :
    setAttribute(state.name, name, value);

  for(let key in node) delete node[key];
  for(let key in transform) node[key] = transform[key];
};

transformers.JSXElement = (node, state) => {
  let body = [
    createElement(state.name, node.openingElement.name.name),
    ...node.openingElement.attributes
  ];

  if (state.parent) {
    node.transform = body.concat(
      appendChild(state.parent, state.name)
    );
  } else {
    (function flatten(node) {
      for(let child of node.children) {
        if (child.transform) body = body.concat(child.transform);
        if (child.children) flatten(child);
      }
    })(node);

    body = closure(
      body.concat(
        returns(identifier(state.name))
      )
    );

    for (let key in body) node[key] = body[key];
  }
};

transformers.JSXExpressionContainer = (node, state) => {
  node.transform = appendChildren(state.parent, node.expression);
};

transformers.Literal = (node, state) => {
  if (state && state.parent && state.name) {
    node.transform = [
      createTextNode(state.name, literal(node.value)),
      appendChild(state.parent, state.name)
    ];
  }
};

module.exports = transformers;
