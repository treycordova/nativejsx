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

transformers.JSXElement = (node, state) => {
  let openingElement = node.openingElement;
  let elementAST = createElement(state.name, openingElement.name.name);
  let body = [elementAST];

  for(let attribute of openingElement.attributes) {
    let attributeAST = setAttribute(
      state.name,
      attribute.name.name,
      attribute.value
    );

    body.push(attributeAST);
  }

  if (state.parent) {
    let appendAST = appendChild(state.parent, state.name);
    body.push(appendAST);

    for (let key in node) {
      if (key !== 'children') {
        delete node[key];
      }
    }

    node.transform = body;
  } else {

    (function something(node) {
      for(let child of node.children) {
        if (child.transform) {
          body = body.concat(child.transform);
        }
        if (child.children) {
          something(child);
        }
      }
    })(node);

    let returnElement = returns(identifier(state.name));

    body.push(returnElement);
    body = closure(body);

    for (let key in node) {
      delete node[key];
    }

    for (let key in body) {
      node[key] = body[key];
    }
  }
}

transformers.Literal = (node, state) => {
  if (state.parent && state.name) {
    let textNode = createTextNode(state.name, node.value);
    let appendChildNode = appendChild(state.parent, state.name);

    node.transform = [textNode, appendChildNode];
  }
}

module.exports = transformers;
