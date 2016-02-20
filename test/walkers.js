'use strict';

let assert = require('chai').assert;
let sinon = require('sinon');
let walkers = require('../source/walkers.js');
let generators = require('../source/generators.js');
let allocator = require('../source/allocator.js');

describe('walkers', function() {
  beforeEach(function() {
    allocator.reset();
  });

  describe('CallExpression', function() {
    let node;
    let state;
    let recursiveCall;

    beforeEach(function() {
      node = {callee: 'callee'};
      state = 'state';
      recursiveCall = sinon.spy();
    });

    it('walks `callee`', function() {
      walkers.CallExpression(node, state, recursiveCall);
      assert.isTrue(recursiveCall.called);
      assert.isTrue(recursiveCall.calledWith(node.callee, state, 'Expression'));
    });

    it('walks `arguments`', function() {
      node.arguments = ['argument1'];
      walkers.CallExpression(node, state, recursiveCall);
      assert.isTrue(recursiveCall.calledTwice);
      assert.isTrue(recursiveCall.calledWith(node.arguments[0], state, 'Expression'));
    });

    describe('when `arguments` has a JSXElement', function() {
      it('walks the JSXElement with initialized state', function() {
        node.arguments = [{type: 'JSXElement'}];
        walkers.CallExpression(node, state, recursiveCall);

        assert.isTrue(recursiveCall.calledTwice);
        assert.isTrue(
          recursiveCall.calledWith(
            node.arguments[0],
            {name: '$$a', parent: null}
          )
        );
      });
    });
  });

  describe('ConditionalExpression', function() {
    let node;
    let state;
    let recursiveCall;

    beforeEach(function() {
      node = {consequent: 'consequent', alternate: 'alternate'};
      state = 'state';
      recursiveCall = sinon.spy();
    });

    it('walks `consequent` and `alternate', function() {
      walkers.ConditionalExpression(node, state, recursiveCall);

      assert.isTrue(recursiveCall.calledTwice);
      assert.isTrue(recursiveCall.calledWith(node.consequent, state, 'Expression'));
      assert.isTrue(recursiveCall.calledWith(node.alternate, state, 'Expression'));
    });

    describe('when `consequent` is a JSXElement', function() {
      it('walks `consequent` with initialized state', function() {
        node.consequent = {type: 'JSXElement'};
        walkers.ConditionalExpression(node, state, recursiveCall);
        assert.isTrue(recursiveCall.called);
        assert.isTrue(
          recursiveCall.calledWith(
            node.consequent,
            {name: '$$a', parent: null}
          )
        );
      });
    });

    describe('when `consequent` is a JSXElement', function() {
      it('walks `consequent` with initialized state', function() {
        node.alternate = {type: 'JSXElement'};
        walkers.ConditionalExpression(node, state, recursiveCall);
        assert.isTrue(recursiveCall.called);
        assert.isTrue(
          recursiveCall.calledWith(
            node.alternate,
            {name: '$$a', parent: null}
          )
        );
      });
    });

    describe('when `consequent` is a null Literal', function() {
      it('injects a JSXElement of <noscript> in the null\'s place', function() {
        node.consequent = {type: 'Literal', value: null};
        walkers.ConditionalExpression(node, state, recursiveCall);
        assert.isTrue(recursiveCall.called);
        assert.isTrue(
          recursiveCall.calledWith(
            generators.jsxelement('noscript'),
            {name: '$$a', parent: null}
          )
        );
      });
    });

    describe('when `alternate` is a null Literal', function() {
      it('injects a JSXElement of <noscript> in the null\'s place', function() {
        node.alternate = {type: 'Literal', value: null};
        walkers.ConditionalExpression(node, state, recursiveCall);
        assert.isTrue(recursiveCall.called);
        assert.isTrue(
          recursiveCall.calledWith(
            generators.jsxelement('noscript'),
            {name: '$$a', parent: null}
          )
        );
      });
    });
  });

  describe('LogicalExpression', function() {
    let node;
    let state;
    let recursiveCall;

    beforeEach(function() {
      node = {left: 'left', right: 'right'};
      state = 'state';
      recursiveCall = sinon.spy();
    });

    it('walks `left` and `right`', function() {
      walkers.LogicalExpression(node, state, recursiveCall);
      assert.isTrue(recursiveCall.calledTwice);
      assert.isTrue(
        recursiveCall.calledWith(
          'left',
          state,
          'Expression'
        )
      );
      assert.isTrue(
        recursiveCall.calledWith(
          'right',
          state,
          'Expression'
        )
      );
    });

    describe('when `left` is a JSXElement', function() {
      it('walks `left` with initialized state', function() {
        node.left = {type: 'JSXElement'};
        walkers.LogicalExpression(node, state, recursiveCall);
        assert.isTrue(recursiveCall.called);
        assert.isTrue(
          recursiveCall.calledWith(
            node.left,
            {name: '$$a', parent: null}
          )
        );
      });
    });

    describe('when `right` is a JSXElement', function() {
      it('walks `right` with initialized state', function() {
        node.right = {type: 'JSXElement'};
        walkers.LogicalExpression(node, state, recursiveCall);
        assert.isTrue(recursiveCall.called);
        assert.isTrue(
          recursiveCall.calledWith(
            node.right,
            {name: '$$a', parent: null}
          )
        );
      });
    });
  });

  describe('ReturnStatement', function() {
    let node;
    let state;
    let recursiveCall;

    beforeEach(function() {
      node = {};
      state = 'state';
      recursiveCall = sinon.spy();
    });

    it('walks `argument`', function() {
      node.argument = {};
      walkers.ReturnStatement(node, state, recursiveCall);
      assert.isTrue(recursiveCall.called);
      assert.isTrue(recursiveCall.calledWith(node.argument, state, 'Expression'));
    });

    describe('when `argument` is a JSXElement', function() {
      it('walks `argument` with initialized state', function() {
        node.argument = {type: 'JSXElement'};
        walkers.ReturnStatement(node, state, recursiveCall);
        assert.isTrue(recursiveCall.called);
        assert.isTrue(
          recursiveCall.calledWith(
            node.argument,
            {name: '$$a', parent: null}
          )
        );
      });
    });
  });

  describe('VariableDeclarator', function() {
    let node;
    let state;
    let recursiveCall;

    beforeEach(function() {
      node = {id: 'id'};
      state = 'state';
      recursiveCall = sinon.spy();
    });

    it('walks `id`', function() {
      walkers.VariableDeclarator(node, state, recursiveCall);
      assert.isTrue(recursiveCall.called);
      assert.isTrue(recursiveCall.calledWith(node.id, state, 'Pattern'));
    });

    it('walks `init`', function() {
      node.init = 'init';
      walkers.VariableDeclarator(node, state, recursiveCall);
      assert.isTrue(recursiveCall.calledTwice);
      assert.isTrue(recursiveCall.calledWith(node.init, state, 'Expression'));
    });

    describe('when `init` is a JSXElement', function() {
      it('walks `init` with initialized state', function() {
        node.init = {type: 'JSXElement'};
        walkers.VariableDeclarator(node, state, recursiveCall);
        assert.isTrue(recursiveCall.calledTwice);
        assert.isTrue(
          recursiveCall.calledWith(
            node.init,
            {name: '$$a', parent: null}
          )
        );
      });
    });
  });

  describe('JSXElement', function() {
    let node;
    let state;
    let recursiveCall;

    beforeEach(function() {
      node = {openingElement: {attributes: []}, children: []};
      state = {name: 'name'};
      recursiveCall = sinon.spy();
    });

    it('walks `attributes`', function() {
      node.openingElement.attributes = ['attribute1', 'attribute2'];
      walkers.JSXElement(node, state, recursiveCall);

      assert.isTrue(recursiveCall.calledTwice);
      assert.isTrue(
        recursiveCall.calledWith(
          node.openingElement.attributes[0],
          state
        )
      );
      assert.isTrue(
        recursiveCall.calledWith(
          node.openingElement.attributes[1],
          state
        )
      );
    });

    describe('walks `children`', function() {
      describe('child is a JSXElement or JSXExpressionContainer', function() {
        it('walks child with initialized state', function() {
          node.children = [{type: 'JSXElement'}, {type: 'JSXExpressionContainer'}];
          walkers.JSXElement(node, state, recursiveCall);

          assert.isTrue(recursiveCall.calledTwice);
          assert.isTrue(
            recursiveCall.calledWith(
              node.children[0],
              {name: '$$a', parent: 'name'}
            )
          );

          assert.isTrue(
            recursiveCall.calledWith(
              node.children[1],
              {name: '$$b', parent: 'name'}
            )
          );
        });
      });

      describe('child is a Literal', function() {
        describe('value is **only** a newline with/without whitespace', function() {
          it('does not walk the child', function() {
            node.children = [generators.literal('\n   ')];
            walkers.JSXElement(node, state, recursiveCall);
            assert.isFalse(recursiveCall.called);
          });
        });

        describe('value is anything else', function() {
          it('walks child with initialized state', function() {
            node.children = [generators.literal('hello, world')];
            walkers.JSXElement(node, state, recursiveCall);
            assert.isTrue(recursiveCall.called);
            assert.isTrue(
              recursiveCall.calledWith(
                node.children[0],
                {name: '$$a', parent: 'name'}
              )
            );
          });
        });
      });

      describe('child is anything else', function() {
        it('walks child', function() {
          node.children = [{type: 'nonsense'}];
          walkers.JSXElement(node, state, recursiveCall);
          assert.isTrue(recursiveCall.called);
          assert.isTrue(
            recursiveCall.calledWith(
              node.children[0],
              state
            )
          );
        });
      });
    });
  });

  describe('JSXExpressionContainer', function() {
    it('walks `expression`', function() {
      let node = {expression: 'expression'};
      let state = 'state';
      let recursiveCall = sinon.spy();

      walkers.JSXExpressionContainer(node, state, recursiveCall);
      assert.isTrue(recursiveCall.called);
      assert.isTrue(
        recursiveCall.calledWith(
          node.expression,
          state
        )
      );
    });
  });
});
