'use strict';

let allocator = require('./allocator.js');
let generators = require('./generators.js');

let walkers = {};

/**
 * AST Walkers
 */

walkers.CallExpression = (node, state, c) => {
  c(node.callee, state, 'Expression');

  if (node.arguments) {
    for(let argument of node.arguments) {
      if (argument.type === 'JSXElement') {
        c(argument, {name: allocator.next(), parent: null});
      } else {
        c(argument, state, 'Expression');
      }
    }
  }
};

walkers.ConditionalExpression = (node, state, c) => {
  for (let branch of [node.consequent, node.alternate]) {
    if (branch.type === 'Literal' && branch.value === null) {
      let jsx = generators.jsxelement('noscript')
      for (let key in branch) delete branch[key];
      for (let key in jsx) branch[key] = jsx[key];
    }

    if (branch.type === 'JSXElement') {
      c(branch, {name: allocator.next(), parent: null});
    } else {
      c(branch, state, 'Expression');
    }
  }
};

walkers.LogicalExpression = (node, state, c) => {
  for (let branch of [node.left, node.right]) {
    if (branch.type === 'JSXElement') {
      c(branch, {name: allocator.next(), parent: null});
    } else {
      c(branch, state, 'Expression');
    }
  }
};

walkers.ReturnStatement = (node, state, c) => {
  if (node.argument) {
    if (node.argument.type === 'JSXElement') {
      c(node.argument, {
        name: allocator.next(),
        parent: null
      });
    } else {
      c(node.argument, state, 'Expression');
    }
  }
}

walkers.VariableDeclarator = (node, state, c) => {
  c(node.id, state, 'Pattern');

  if (node.init) {
    if (node.init.type === 'JSXElement') {
      c(node.init, {
        name: allocator.next(),
        parent: null
      });
    } else {
      c(node.init, state, 'Expression');
    }
  }
}

walkers.JSXElement = (node, state, c) => {
  for(let attribute of node.openingElement.attributes) {
    c(attribute, state);
  }

  for(let child of node.children) {
    switch(child.type) {
      case 'Literal':
        let value = child.value.replace('\n', '').trim();

        if (value.length) {
          c(child, {
            name: allocator.next(),
            parent: state.name
          });
        }
        break;
      case 'JSXExpressionContainer':
      case 'JSXElement':
        c(child, {
          name: allocator.next(),
          parent: state.name
        });
        break;
      default:
        c(child, state);
    }
  }
}

walkers.JSXExpressionContainer = (node, state, c) => {
  c(node.expression, state);
};

walkers.JSXSpreadAttribute = () => {};
walkers.JSXAttribute = () => {};

module.exports = walkers;
