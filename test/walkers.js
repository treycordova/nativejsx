'use strict';

let assert = require('chai').assert;
let sinon = require('sinon');
let walkers = require('../dist/walkers.js');
let generators = require('../dist/generators.js');
let allocator = require('../dist/allocator.js');

describe('walkers', function() {
  afterEach(function() {
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
      it('walks `argument with initialized state', function() {
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
