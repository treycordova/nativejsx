const { assert } = require('chai')
const escodegen = require('escodegen')
const generators = require('../source/generators.js')

describe('generators', () => {
  describe('identifier', () => {
    it('builds a JavaScript Identifier', () => {
      assert.equal(
        escodegen.generate(generators.identifier('a')),
        'a'
      )
    })
  })

  describe('literal', () => {
    it('builds a JavaScript Literal', () => {
      assert.equal(
        escodegen.generate(generators.literal('hello')),
        "'hello'"
      )
    })
  })

  describe('member', () => {
    it('builds a JavaScript MemberExpression', () => {
      assert.equal(
        escodegen.generate(
          generators.member(
            generators.identifier('hello'),
            generators.identifier('world')
          )
        ),
        'hello.world'
      )
    })
  })

  describe('expressionStatement', () => {
    it('builds a JavaScript ExpressionStatement', () => {
      assert.equal(
        escodegen.generate(
          generators.expressionStatement(
            generators.member(
              generators.identifier('hello'),
              generators.identifier('world')
            )
          )
        ),
        'hello.world;'
      )
    })
  })

  describe('callExpression', () => {
    it('builds a JavaScript CallExpression with no arguments', () => {
      assert.equal(
        escodegen.generate(
          generators.callExpression(
            generators.identifier('hello')
          )
        ),
        'hello()'
      )
    })

    it('builds a JavaScript CallExpression with arguments', () => {
      assert.equal(
        escodegen.generate(
          generators.callExpression(
            generators.identifier('hello'),
            [generators.literal('world')]
          )
        ),
        "hello('world')"
      )
    })
  })

  describe('variableDeclaration', () => {
    it('builds a JavaScript VariableDeclaration', () => {
      assert.equal(
        escodegen.generate(
          generators.variableDeclaration(
            'hello',
            generators.identifier('world'),
            [generators.literal('!')]
          )
        ),
        "var hello = world('!');"
      )
    })
  })

  describe('assigns', () => {
    it('builds a JavaScript ExpressionStatement containing an AssignmentExpression', () => {
      assert.equal(
        escodegen.generate(
          generators.assigns(
            generators.identifier('hello'),
            generators.literal('world')
          )
        ),
        "hello = 'world';"
      )
    })
  })

  describe('returns', () => {
    it('builds a JavaScript ReturnStatement', () => {
      assert.equal(
        escodegen.generate(generators.returns(generators.literal('hello'))),
        "return 'hello';"
      )
    })
  })

  describe('if', () => {
    it('builds a JavaScript IfStatement', () => {
      assert.equal(
        escodegen.generate(generators.if(
          generators.identifier('true'),
          generators.literal('hello'),
          generators.literal('world'))
        ),
        "if (true)\n    'hello'\nelse\n    'world'"
      )
    })
  })

  describe('contextualClosure', () => {
    it('builds a JavaScript .call-enabled closure', () => {
      assert.equal(
        escodegen.generate(
          generators.contextualClosure(
            [generators.literal('hello')]
          )
        ),
        "function () {\n    'hello'\n}.call(this)"
      )
    })
  })

  describe('jsxidentifier', () => {
    it('builds a JSXIdentifier', () => {
      const identifier = generators.jsxidentifier('hello')

      assert.property(identifier, 'type')
      assert.property(identifier, 'name')

      assert.propertyVal(identifier, 'type', 'JSXIdentifier')
      assert.propertyVal(identifier, 'name', 'hello')
    })
  })

  describe('jsx', () => {
    describe('builds a JSXElement', () => {
      it('with no attributes and no children', () => {
        const element = generators.jsxelement('hello')

        assert.property(element, 'children')
        assert.property(element, 'openingElement')
        assert.deepProperty(element, 'openingElement.attributes')
        assert.notProperty(element, 'closingElement')

        assert.deepPropertyVal(element, 'openingElement.name.name', 'hello')
        assert.deepPropertyVal(element, 'openingElement.selfClosing', true)
      })

      it('with attributes and no children', () => {
        const element = generators.jsxelement('hello', ['test'])

        assert.property(element, 'openingElement')
        assert.deepProperty(element, 'openingElement.attributes')
        assert.lengthOf(element.openingElement.attributes, 1)
        assert.deepEqual(element.openingElement.attributes, ['test'])
      })

      it('no attributes and with children', () => {
        const element = generators.jsxelement('hello', null, ['test'])

        assert.property(element, 'children')
        assert.property(element, 'closingElement')
        assert.lengthOf(element.children, 1)
        assert.deepEqual(element.children, ['test'])
      })

      it('with attributes and with children', () => {
        const element = generators.jsxelement('hello', ['attribute'], ['child'])

        assert.property(element, 'openingElement')
        assert.deepProperty(element, 'openingElement.attributes')
        assert.lengthOf(element.openingElement.attributes, 1)
        assert.deepEqual(element.openingElement.attributes, ['attribute'])

        assert.property(element, 'children')
        assert.property(element, 'closingElement')
        assert.lengthOf(element.children, 1)
        assert.deepEqual(element.children, ['child'])
      })
    })
  })
})
