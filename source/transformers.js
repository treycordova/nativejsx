'use strict';

let generators = require('./generators.js');
let compositions = require('./compositions.js');

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
    compositions.addEventListener(state.name, name.substring(2).toLowerCase(), value) :
    compositions.setAttribute(state.name, name, value);

  for(let key in node) delete node[key];
  for(let key in transform) node[key] = transform[key];
};

transformers.JSXSpreadAttribute = (node, state) => {
  let value = node.argument.name;
  let transform = compositions.setAttributes(state.name, generators.identifier(value));

  for(let key in node) delete node[key];
  for(let key in transform) node[key] = transform[key];
};

transformers.JSXElement = (node, state) => {
  let body = [
    compositions.createElement(state.name, node.openingElement.name.name),
    ...node.openingElement.attributes
  ];

  if (state.parent) {
    node.transform = body.concat(
      compositions.appendChild(state.parent, state.name)
    );
  } else {
    (function flatten(node) {
      for(let child of node.children) {
        if (child.transform) body = body.concat(child.transform);
        if (child.children) flatten(child);
      }
    })(node);

    body = generators.closure(
      body.concat(
        generators.returns(generators.identifier(state.name))
      )
    );

    for (let key in body) node[key] = body[key];
  }
};

transformers.JSXExpressionContainer = (node, state) => {
  node.transform = compositions.appendChildren(state.parent, node.expression);
};

transformers.Literal = (node, state) => {
  if (state && state.parent && state.name) {
    node.transform = [
      compositions.createTextNode(state.name, generators.literal(node.value)),
      compositions.appendChild(state.parent, state.name)
    ];
  }
};

module.exports = transformers;
