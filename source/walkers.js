'use strict';

let {
  next,
  reset
} = require('./allocator.js');

let walkers = {};

/**
 * AST Walkers
 */

walkers.ReturnStatement = (node, state, c) => {
  if (node.argument) {
    if (node.argument.type === 'JSXElement') {
      c(node.argument, {
        name: next(),
        parent: null,
        returned: true
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
        name: next(),
        parent: null,
        assignment: node.id.name
      });
    } else {
      c(node.init, state, 'Expression');
    }
  }
}

walkers.JSXElement = (node, state, c) => {
  for(let child of node.children) {
    switch(child.type) {
      case 'Literal':
        let value = child.value.replace('\n', '').trim();

        if (value.length) {
          c(child, {
            name: next(),
            parent: state.name
          });
        }
        break;
      case 'JSXElement':
        c(child, {
          name: next(),
          parent: state.name
        });
        break;
      default:
        c(child, state);
    }
  }

  if(state.parent === null) {
    reset();
  }
}

walkers.JSXExpressionContainer = (node, state, c) => {
  c(node.expression, 'JSXExpression');
}

module.exports = walkers;
