const { assert } = require('chai')
const sinon = require('sinon')
const walkers = require('../source/walkers.js')
const generators = require('../source/generators.js')
const allocator = require('../source/allocator.js')

describe('walkers', () => {
  beforeEach(() => {
    allocator.reset()
  })

  describe('AssignmentExpression', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {left: '', right: {type: 'MemberExpression'}}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `left`', () => {
      walkers.AssignmentExpression(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.left, state, 'Expression'))
    })

    it('walks `right`', () => {
      walkers.AssignmentExpression(node, state, recursiveCall)
      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(recursiveCall.calledWith(node.right, state, 'Expression'))
    })

    describe('when `right` is a JSXElement', () => {
      it('walks the JSXElement with initialized state', () => {
        node.right = {type: 'JSXElement'}
        walkers.AssignmentExpression(node, state, recursiveCall)
        assert.isTrue(recursiveCall.calledTwice)
        assert.isTrue(
          recursiveCall.calledWith(
            node.right,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('CallExpression', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {callee: 'callee'}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `callee`', () => {
      walkers.CallExpression(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.callee, state, 'Expression'))
    })

    it('walks `arguments`', () => {
      node.arguments = ['argument1']
      walkers.CallExpression(node, state, recursiveCall)
      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(recursiveCall.calledWith(node.arguments[0], state, 'Expression'))
    })

    describe('when `arguments` has a JSXElement', () => {
      it('walks the JSXElement with initialized state', () => {
        node.arguments = [{type: 'JSXElement'}]
        walkers.CallExpression(node, state, recursiveCall)

        assert.isTrue(recursiveCall.calledTwice)
        assert.isTrue(
          recursiveCall.calledWith(
            node.arguments[0],
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('ConditionalExpression', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {consequent: 'consequent', alternate: 'alternate'}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `consequent` and `alternate', () => {
      walkers.ConditionalExpression(node, state, recursiveCall)

      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(recursiveCall.calledWith(node.consequent, state, 'Expression'))
      assert.isTrue(recursiveCall.calledWith(node.alternate, state, 'Expression'))
    })

    describe('when `consequent` is a JSXElement', () => {
      it('walks `consequent` with initialized state', () => {
        node.consequent = {type: 'JSXElement'}
        walkers.ConditionalExpression(node, state, recursiveCall)
        assert.isTrue(recursiveCall.called)
        assert.isTrue(
          recursiveCall.calledWith(
            node.consequent,
            {name: '$$a', parent: null}
          )
        )
      })
    })

    describe('when `consequent` is a JSXElement', () => {
      it('walks `consequent` with initialized state', () => {
        node.alternate = {type: 'JSXElement'}
        walkers.ConditionalExpression(node, state, recursiveCall)
        assert.isTrue(recursiveCall.called)
        assert.isTrue(
          recursiveCall.calledWith(
            node.alternate,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('LogicalExpression', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {left: 'left', right: 'right'}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `left` and `right`', () => {
      walkers.LogicalExpression(node, state, recursiveCall)
      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(
        recursiveCall.calledWith(
          'left',
          state,
          'Expression'
        )
      )
      assert.isTrue(
        recursiveCall.calledWith(
          'right',
          state,
          'Expression'
        )
      )
    })

    describe('when `left` is a JSXElement', () => {
      it('walks `left` with initialized state', () => {
        node.left = {type: 'JSXElement'}
        walkers.LogicalExpression(node, state, recursiveCall)
        assert.isTrue(recursiveCall.called)
        assert.isTrue(
          recursiveCall.calledWith(
            node.left,
            {name: '$$a', parent: null}
          )
        )
      })
    })

    describe('when `right` is a JSXElement', () => {
      it('walks `right` with initialized state', () => {
        node.right = {type: 'JSXElement'}
        walkers.LogicalExpression(node, state, recursiveCall)
        assert.isTrue(recursiveCall.called)
        assert.isTrue(
          recursiveCall.calledWith(
            node.right,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('ReturnStatement', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `argument`', () => {
      node.argument = {}
      walkers.ReturnStatement(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.argument, state, 'Expression'))
    })

    describe('when `argument` is a JSXElement', () => {
      it('walks `argument` with initialized state', () => {
        node.argument = {type: 'JSXElement'}
        walkers.ReturnStatement(node, state, recursiveCall)
        assert.isTrue(recursiveCall.called)
        assert.isTrue(
          recursiveCall.calledWith(
            node.argument,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('VariableDeclarator', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {id: 'id'}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `id`', () => {
      walkers.VariableDeclarator(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.id, state, 'Pattern'))
    })

    it('walks `init`', () => {
      node.init = 'init'
      walkers.VariableDeclarator(node, state, recursiveCall)
      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(recursiveCall.calledWith(node.init, state, 'Expression'))
    })

    describe('when `init` is a JSXElement', () => {
      it('walks `init` with initialized state', () => {
        node.init = {type: 'JSXElement'}
        walkers.VariableDeclarator(node, state, recursiveCall)
        assert.isTrue(recursiveCall.calledTwice)
        assert.isTrue(
          recursiveCall.calledWith(
            node.init,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('ArrowFunctionExpression', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {id: 'id'}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `id`', () => {
      walkers.ArrowFunctionExpression(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.id, state, 'Pattern'))
    })

    it('walks `body`', () => {
      node.body = 'body'
      walkers.ArrowFunctionExpression(node, state, recursiveCall)
      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(recursiveCall.calledWith(node.body, state, 'Expression'))
    })

    describe('when `body` is a JSXElement', () => {
      it('walks `body` with initialized state', () => {
        node.body = {type: 'JSXElement'}
        walkers.ArrowFunctionExpression(node, state, recursiveCall)
        assert.isTrue(recursiveCall.calledTwice)
        assert.isTrue(
          recursiveCall.calledWith(
            node.body,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('AssignmentPattern', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {left: 'left'}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks `left`', () => {
      walkers.AssignmentPattern(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.left, state, 'Pattern'))
    })

    it('walks `right`', () => {
      node.right = 'right'
      walkers.AssignmentPattern(node, state, recursiveCall)
      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(recursiveCall.calledWith(node.right, state, 'Pattern'))
    })

    describe('when `right` is a JSXElement', () => {
      it('walks `right` with initialized state', () => {
        node.right = {type: 'JSXElement'}
        walkers.AssignmentExpression(node, state, recursiveCall)
        assert.isTrue(recursiveCall.calledTwice)
        assert.isTrue(
          recursiveCall.calledWith(
            node.right,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('Property', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {key: 'key'}
      state = {}
      recursiveCall = sinon.spy()
    })

    it('walks when `key` is a subscripts', () => {
      node.computed = true
      walkers.Property(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.key, state, 'Expression'))
    })

    it('walks `value`', () => {
      node.value = 'value'
      walkers.Property(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(recursiveCall.calledWith(node.value, state, 'Expression'))
    })

    describe('when `value` is a JSXElement', () => {
      it('walks `value` with initialized state', () => {
        node.value = {type: 'JSXElement'}
        walkers.Property(node, state, recursiveCall)
        assert.isTrue(recursiveCall.called)
        assert.isTrue(
          recursiveCall.calledWith(
            node.value,
            {name: '$$a', parent: null}
          )
        )
      })
    })
  })

  describe('JSXElement', () => {
    let node
    let state
    let recursiveCall

    beforeEach(() => {
      node = {openingElement: {attributes: []}, children: []}
      state = {name: 'name'}
      recursiveCall = sinon.spy()
    })

    it('walks `attributes`', () => {
      node.openingElement.attributes = ['attribute1', 'attribute2']
      walkers.JSXElement(node, state, recursiveCall)

      assert.isTrue(recursiveCall.calledTwice)
      assert.isTrue(
        recursiveCall.calledWith(
          node.openingElement.attributes[0],
          state
        )
      )
      assert.isTrue(
        recursiveCall.calledWith(
          node.openingElement.attributes[1],
          state
        )
      )
    })

    describe('walks `children`', () => {
      describe('child is a JSXElement or JSXExpressionContainer', () => {
        it('walks child with initialized state', () => {
          node.children = [{type: 'JSXElement'}, {type: 'JSXExpressionContainer'}]
          walkers.JSXElement(node, state, recursiveCall)

          assert.isTrue(recursiveCall.calledTwice)
          assert.isTrue(
            recursiveCall.calledWith(
              node.children[0],
              {name: '$$a', parent: 'name'}
            )
          )

          assert.isTrue(
            recursiveCall.calledWith(
              node.children[1],
              {name: '$$b', parent: 'name'}
            )
          )
        })
      })

      describe('child is a Literal', () => {
        describe('value is **only** a newline with/without whitespace', () => {
          it('does not walk the child', () => {
            node.children = [generators.literal('\n   ')]
            walkers.JSXElement(node, state, recursiveCall)
            assert.isFalse(recursiveCall.called)
          })
        })

        describe('value is anything else', () => {
          it('walks child with initialized state', () => {
            node.children = [generators.literal('hello, world')]
            walkers.JSXElement(node, state, recursiveCall)
            assert.isTrue(recursiveCall.called)
            assert.isTrue(
              recursiveCall.calledWith(
                node.children[0],
                {name: '$$a', parent: 'name'}
              )
            )
          })
        })
      })

      describe('child is anything else', () => {
        it('walks child', () => {
          node.children = [{type: 'nonsense'}]
          walkers.JSXElement(node, state, recursiveCall)
          assert.isTrue(recursiveCall.called)
          assert.isTrue(
            recursiveCall.calledWith(
              node.children[0],
              state
            )
          )
        })
      })
    })
  })

  describe('JSXExpressionContainer', () => {
    it('walks `expression`', () => {
      const node = {expression: 'expression'}
      const state = {}
      const recursiveCall = sinon.spy()

      walkers.JSXExpressionContainer(node, state, recursiveCall)
      assert.isTrue(recursiveCall.called)
      assert.isTrue(
        recursiveCall.calledWith(
          node.expression,
          state
        )
      )
    })
  })
})
