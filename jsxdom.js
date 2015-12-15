'use strict';

let util = require('util');
let escodegen = require('escodegen');
let acorn = require('acorn-jsx');

const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const ALPHABET_LENGTH = ALPHABET.length;
const VARIABLE_PREFIX = '__';
const attributes = { 'className': 'class' };
const properties = ['required', 'disabled'];

let variableIndex = 0;

function next() {
  let repetition = Math.ceil(variableIndex / ALPHABET_LENGTH);
  repetition += variableIndex % ALPHABET_LENGTH === 0 ? 1 : 0;

  let letter = ALPHABET[variableIndex % ALPHABET_LENGTH];
  let letteredComponent = Array(repetition).fill(letter).join('');

  variableIndex += 1;

  return VARIABLE_PREFIX + letteredComponent;
}

function closure(body) {
  return {
    type: 'CallExpression',
    arguments: [],
    callee: {
      type: 'FunctionExpression',
      id: null,
      params: [],
      body: {
        type: 'BlockStatement',
        body
      }
    }
  };
}

function variableDeclaration(variable, callee, varargs) {
  return {
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
        name: variable
      },
      init: {
        type: 'CallExpression',
        callee,
        arguments: varargs
      }
    }],
    kind: 'var'
  };
}

function createElement(variable, tag) {
  return variableDeclaration(
    variable,
    member('document', 'createElement'),
    [{type: 'Literal', value: tag}]
  );
}

function createTextNode(variable, text) {
  return variableDeclaration(
    variable,
    member('document', 'createTextNode'),
    [{type: 'Literal', value: text}]
  );
}

function setAttribute(variable, attribute, assignmentExpression) {
  let isProperty = properties.indexOf(attribute) !== -1;
  let mappedAttribute = attributes[attribute] || attribute;

  if (isProperty) {
    return assigns(
      member(variable, mappedAttribute),
      { type: 'Literal', value: true }
    );
  } else {
    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: member(variable, 'setAttribute'),
        arguments: [{
            type: 'Literal',
            value: mappedAttribute
          },
          assignmentExpression
        ]
      }
    };
  }
}

function appendChild(parent, child) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: member(parent, 'appendChild'),
      arguments: [{
        type: 'Identifier',
        name: child
      }]
    }
  };
}

function member(object, property) {
  return {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: object
    },
    property: {
      type: 'Identifier',
      name: property
    }
  };
}

function assigns(assigner, assignee) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: assigner,
      right: assignee
    }
  };
}

function returns(argument) {
  return {
    type: 'ReturnStatement',
    argument
  };
}

let walk = require('./node_modules/acorn-jsx/node_modules/acorn/dist/walk.js');

let jsxBase = walk.make({
  'ReturnStatement': (node, state, c) => {
    if (node.argument) {
      if (node.argument.type === 'JSXElement') {
        c(node.argument, {
          name: next(),
          parent: null,
          returned: true
        });
      } else {
        c(node.argument, state, "Expression");
      }
    }
  },
  'VariableDeclarator': (node, state, c) => {
    c(node.id, state, "Pattern");

    if (node.init) {
      if (node.init.type === 'JSXElement') {
        c(node.init, {
          name: next(),
          parent: null,
          assignment: node.id.name
        });
      } else {
        c(node.init, state, "Expression");
      }
    }
  },
  'JSXElement': (node, state, c) => {
    for(let child of node.children) {
      switch(child.type) {
        case 'Literal':
          c(child, {
            parent: state.name
          });
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
  },
  'JSXExpressionContainer': (node, state, c) => {
    c(node.expression, 'JSXExpression');
  }
});

/** Testing **/

let fs = require('fs');
let ast = acorn.parse(fs.readFileSync('test.jsx', 'utf-8'), {
  plugins: {jsx: true}
});

walk.simple(ast, {
  'JSXElement': (node, state) => {
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

      let returnElement = returns({
        type: 'Identifier',
        name: state.name
      });

      body.push(returnElement);
      body = closure(body);

      for (let key in node) {
        delete node[key];
      }

      for (let key in body) {
        node[key] = body[key];
      }
    }
  },
  'Literal': (node, state) => {
    if (state.parent) {
      let name = next();
      let value = node.value.replace('\n', '').trim();

      if (value.length) {
        let textNode = createTextNode(name, node.value);
        let appendChildNode = appendChild(state.parent, name);

        node.transform = [textNode, appendChildNode];
      }
    }
  },
  'BinaryExpression': (node, state) => {
    if (state === 'JSXExpression') {
    }
  }
}, jsxBase);

//console.log(util.inspect(ast, {depth: null}));
console.log(escodegen.generate(ast));
fs.writeFileSync('test.js', escodegen.generate(ast));

