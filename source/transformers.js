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
  addEventListener,
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
    let name = attribute.name.name;
    let value = attribute.value.expression ?
      attribute.value.expression :
      attribute.value;

    if (name.startsWith('on')) {
      transformed.push(
        addEventListener(
          state.name,
          name.substring(2).toLowerCase(),
          value
        )
      );
    } else {
      transformed.push(
        setAttribute(
          state.name,
          name,
          value
        )
      );
    }
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
  if (state && state.parent && state.name) {
    node.transform = [
      createTextNode(state.name, node.value),
      appendChild(state.parent, state.name)
    ];
  }
}

module.exports = transformers;
