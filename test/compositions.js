const { assert } = require('chai')
const escodegen = require('escodegen')
const generators = require('../source/generators.js')
const compositions = require('../source/compositions.js')

describe('compositions', () => {
  describe('createElement', () => {
    it('builds `var hello = document.createElement(\'body\')`', () => {
      assert.equal(
        escodegen.generate(compositions.createElement('hello', 'body')),
        'var hello = document.createElement(\'body\');'
      )
    })
  })

  describe('createTextNode', () => {
    it('builds `var hello = document.createTextNode(\'Hello\')`', () => {
      assert.equal(
        escodegen.generate(
          compositions.createTextNode('hello', generators.literal('Hello'))
        ),
        'var hello = document.createTextNode(\'Hello\');'
      )
    })
  })

  describe('setAttribute', () => {
    it('builds `hello.setAttribute(\'hello\', \'world\')`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setAttribute('hello', 'hello', generators.literal('world'))
        ),
        'hello.setAttribute(\'hello\', \'world\');'
      )
    })
  })

  describe('setAttributes', () => {
    it('builds `hello.setAttributes(world)`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setAttributes('hello', generators.identifier('world'))
        ),
        'hello.setAttributes(world);'
      )
    })
  })

  describe('setAttributesInline', () => {
    it('builds `__setAttributes(hello, world)`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setAttributesInline([
            generators.identifier('hello'),
            generators.identifier('world')
          ])
        ),
        '__setAttributes(hello, world);'
      )
    })
  })

  describe('setAttributesModule', () => {
    it('builds `setAttributes(hello, world)`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setAttributesModule([
            generators.identifier('hello'),
            generators.identifier('world')
          ])
        ),
        'setAttributes(hello, world);'
      )
    })
  })

  describe('setReference', () => {
    it('builds `hello.setReference(hello, world)`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setReference('hello', generators.identifier('world'))
        ),
        'world(hello);'
      )
    })
  })

  describe('setStyles', () => {
    it('builds `hello.setStyles({})`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setStyles(
            'hello',
            { type: 'ObjectExpression', properties: [] }
          )
        ),
        'hello.setStyles({});'
      )
    })
  })

  describe('setStylesInline', () => {
    it('builds `__setStyles(hello, {})`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setStylesInline([
            generators.identifier('hello'),
            { type: 'ObjectExpression', properties: [] }
          ])
        ),
        '__setStyles(hello, {});'
      )
    })
  })

  describe('setStylesModule', () => {
    it('builds `setStyles(hello, {})`', () => {
      assert.equal(
        escodegen.generate(
          compositions.setStylesModule([
            generators.identifier('hello'),
            { type: 'ObjectExpression', properties: [] }
          ])
        ),
        'setStyles(hello, {});'
      )
    })
  })

  describe('addEventListener', () => {
    it('builds `hello.addEventListener(\'click\', world)`', () => {
      assert.equal(
        escodegen.generate(
          compositions.addEventListener('hello', 'click', generators.identifier('world'))
        ),
        'hello.addEventListener(\'click\', world);'
      )
    })
  })

  describe('appendChild', () => {
    it('builds `hello.appendChild(\'world\')`', () => {
      assert.equal(
        escodegen.generate(compositions.appendChild('hello', 'world')),
        'hello.appendChild(world);'
      )
    })
  })

  describe('appendChildren', () => {
    it('builds `hello.appendChildren(world)`', () => {
      assert.equal(
        escodegen.generate(
          compositions.appendChildren('hello', generators.identifier('world'))
        ),
        'hello.appendChildren(world);'
      )
    })
  })

  describe('appendChildrenModule', () => {
    it('builds `appendChildren(hello, world)`', () => {
      assert.equal(
        escodegen.generate(
          compositions.appendChildrenModule([
            generators.identifier('hello'),
            generators.identifier('world')
          ])
        ),
        'appendChildren(hello, world);'
      )
    })
  })
})
