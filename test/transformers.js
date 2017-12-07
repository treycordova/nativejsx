const { assert } = require('chai')
const transformers = require('../source/transformers.js')
const generators = require('../source/generators.js')

describe('transformers', () => {
  describe('JSXAttribute', () => {
    let node
    let state

    beforeEach(() => {
      node = {name: {name: 'name'}, value: generators.literal('value')}
      state = {name: 'name'}
    })

    describe('when attribute is "style"', () => {
      beforeEach(() => {
        node.name.name = 'style'
      })

      it('transforms into a `setStyles` call', () => {
        node.value = { type: 'ObjectExpression', properties: [] }
        transformers.JSXAttribute(node, state)

        assert.deepPropertyVal(
          node,
          'expression.callee.object.name',
          state.name
        )

        assert.deepPropertyVal(
          node,
          'expression.callee.property.name',
          'setStyles'
        )
      })
    })

    describe('when attribute is "ref"', () => {
      beforeEach(() => {
        node.name.name = 'ref'
      })

      it('transforms into a ref callback', () => {
        node.value = generators.functionExpression(null, [], {})
        transformers.JSXAttribute(node, state)

        assert.deepPropertyVal(
          node,
          'expression.type',
          'CallExpression'
        )

        assert.deepPropertyVal(
          node,
          'expression.callee.type',
          'FunctionExpression'
        )

        assert.deepPropertyVal(
          node,
          'expression.arguments[0].name',
          state.name
        )
      })

      it('transforms into a `setAttribute` call', () => {
        transformers.JSXAttribute(node, state)

        assert.deepPropertyVal(
          node,
          'expression.callee.object.name',
          state.name
        )

        assert.deepPropertyVal(
          node,
          'expression.callee.property.name',
          'setAttribute'
        )

        assert.deepPropertyVal(
          node,
          'expression.arguments[1].value',
          'value'
        )
      })
    })

    describe('when attribute is an event', () => {
      beforeEach(() => {
        node.name.name = 'onclick'
      })

      it('transforms into an `addEventListener`, removing "on"', () => {
        transformers.JSXAttribute(node, state)

        assert.deepPropertyVal(
          node,
          'expression.callee.object.name',
          state.name
        )

        assert.deepPropertyVal(
          node,
          'expression.callee.property.name',
          'addEventListener'
        )

        assert.deepPropertyVal(
          node,
          'expression.arguments[0].value',
          'click'
        )

        assert.deepPropertyVal(
          node,
          'expression.arguments[1].value',
          'value'
        )
      })
    })

    describe('when attribute is an HTML attribute and value', () => {
      it('transforms into a `setAttribute`', () => {
        transformers.JSXAttribute(node, state)

        assert.deepPropertyVal(
          node,
          'expression.callee.object.name',
          state.name
        )

        assert.deepPropertyVal(
          node,
          'expression.callee.property.name',
          'setAttribute'
        )

        assert.deepPropertyVal(
          node,
          'expression.arguments[1].value',
          'value'
        )
      })

      describe('when attribute isn\'t mapped', () => {
        beforeEach(() => {
          node.name.name = 'id'
        })

        it('preserves the attribute name', () => {
          transformers.JSXAttribute(node, state)

          assert.deepPropertyVal(
            node,
            'expression.arguments[0].value',
            'id'
          )
        })
      })

      describe('when attribute is mapped', () => {
        beforeEach(() => {
          node.name.name = 'className'
        })

        it('maps the attribute name', () => {
          transformers.JSXAttribute(node, state)

          assert.deepPropertyVal(
            node,
            'expression.arguments[0].value',
            'class'
          )
        })
      })
    })

    describe('when attribute is an HTML property', () => {
      beforeEach(() => {
        node.name.name = 'required'
      })

      it('transforms into a property assignment', () => {
        transformers.JSXAttribute(node, state)

        assert.deepPropertyVal(
          node,
          'expression.operator',
          '='
        )

        assert.deepPropertyVal(
          node,
          'expression.left.object.name',
          state.name
        )

        assert.deepPropertyVal(
          node,
          'expression.left.property.name',
          'required'
        )

        assert.deepPropertyVal(
          node,
          'expression.right.value',
          'value'
        )
      })
    })
  })

  describe('JSXElement', () => {
    let element
    let state

    describe('as a child element', () => {
      beforeEach(() => {
        element = {
          openingElement: {
            name: {
              name: 'div'
            },
            attributes: []
          }
        }

        state = {
          parent: 'parent',
          name: 'name'
        }
      })

      it('adds a new property, "transform"', () => {
        transformers.JSXElement(element, state)
        assert.property(element, 'transform')
      })

      it('assigns transform an Array of length 2', () => {
        transformers.JSXElement(element, state)
        assert.isArray(element.transform)
        assert.lengthOf(element.transform, 2)
      })

      describe('its transform property', () => {
        it('contains a VariableDeclaration at index 0', () => {
          transformers.JSXElement(element, state)

          assert.deepPropertyVal(
            element,
            'transform[0].type',
            'VariableDeclaration'
          )
        })

        it('contains an ExpressionStatement at index 1', () => {
          transformers.JSXElement(element, state)

          assert.deepPropertyVal(
            element,
            'transform[1].type',
            'ExpressionStatement'
          )
        })
      })
    })

    describe('as a root element', () => {
      beforeEach(() => {
        state = {parent: null, name: 'name'}
        element.children = []
      })

      it('creates a closure', () => {
        transformers.JSXElement(element, state)

        assert.deepPropertyVal(
          element,
          'callee.type',
          'MemberExpression'
        )

        assert.deepPropertyVal(
          element,
          'callee.object.type',
          'FunctionExpression'
        )

        assert.deepPropertyVal(
          element,
          'callee.object.body.body[1].type',
          'ReturnStatement'
        )
      })

      describe('with children', () => {
        beforeEach(() => {
          element.children = [
            {transform: 'transform1'},
            {transform: 'transform2', children: [{transform: 'transform3'}]}
          ]
        })

        it('adds children transforms to the body', () => {
          transformers.JSXElement(element, state)

          assert.deepProperty(element, 'callee.object.body.body')
          assert.lengthOf(element.callee.object.body.body, 5)
          assert.include(
            element.callee.object.body.body,
            'transform1',
            'transform2',
            'transform3'
          )
        })
      })
    })
  })

  describe('JSXExpressionContainer', () => {
    describe('using the transform property', () => {
      let element
      let state

      beforeEach(() => {
        element = {expression: 'hello'}
        state = {parent: 'parent'}
      })

      it('builds an `appendChildren` AST', () => {
        transformers.JSXExpressionContainer(element, state)

        assert.deepPropertyVal(
          element,
          'transform.type',
          'ExpressionStatement'
        )

        assert.deepPropertyVal(
          element,
          'transform.expression.callee.object.name',
          state.parent
        )

        assert.deepPropertyVal(
          element,
          'transform.expression.callee.property.name',
          'appendChildren'
        )

        assert.deepPropertyVal(
          element,
          'transform.expression.arguments[0]',
          element.expression
        )
      })
    })
  })

  describe('Literal', () => {
    describe('inside a JSXElement', () => {
      let element
      let state

      beforeEach(() => {
        element = {value: 'hello'}
        state = {parent: 'parent', name: 'name'}
      })

      it('builds a transform property', () => {
        transformers.Literal(element, state)

        assert.property(element, 'transform')
        assert.isArray(element.transform)
        assert.lengthOf(element.transform, 2)
      })

      describe('using the transform property', () => {
        it('builds a `createTextNode` AST', () => {
          transformers.Literal(element, state)

          assert.deepPropertyVal(
            element,
            'transform[0].type',
            'VariableDeclaration'
          )

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].id.name',
            state.name
          )

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].init.callee.object.name',
            'document'
          )

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].init.callee.property.name',
            'createTextNode'
          )

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].init.arguments[0].value',
            element.value
          )
        })

        it('builds an `appendChild` AST', () => {
          transformers.Literal(element, state)

          assert.deepPropertyVal(
            element,
            'transform[1].type',
            'ExpressionStatement'
          )

          assert.deepPropertyVal(
            element,
            'transform[1].expression.type',
            'CallExpression'
          )

          assert.deepPropertyVal(
            element,
            'transform[1].expression.callee.object.name',
            state.parent
          )

          assert.deepPropertyVal(
            element,
            'transform[1].expression.callee.property.name',
            'appendChild'
          )

          assert.deepPropertyVal(
            element,
            'transform[1].expression.arguments[0].name',
            state.name
          )
        })
      })
    })
  })
})
