'use strict';

let {
  returns,
  identifier,
  closure
} = require('./generators.js');

let {
  createElement,
  createTextNode,
  setAttribute,
  appendChild,
  returnElement
} = require('./compositions.js');

let transformers = {};

/**
 * JSX to DOM transformers
 */

function transformJSXAttributes(state, attributes) {
  let transformed = [];

  for(let attribute of attributes) {
    transformed.push(
      setAttribute(
        state.name,
        attribute.name.name,
        attribute.value
      )
    );
  }

  return transformed;
}

transformers.JSXElement = (node, state) => {
  let body = [
    createElement(state.name, node.openingElement.name.name),
    ...transformJSXAttributes(state, node.openingElement.attributes)
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
}

transformers.Literal = (node, state) => {
  if (state.parent && state.name) {
    node.transform = [
      createTextNode(state.name, node.value),
      appendChild(state.parent, state.name)
    ];
  }
}

module.exports = transformers;
