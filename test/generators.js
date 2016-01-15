'use strict';

let assert = require('chai').assert;
let escodegen = require('escodegen');
let generators = require('../source/generators.js');

describe('generators', function() {
  describe('identifier', function() {
    it('builds a JavaScript Identifier', function() {
      assert.equal(
        escodegen.generate(generators.identifier('a')),
        'a'
      );
    });
  });

  describe('literal', function() {
    it('builds a JavaScript Literal', function() {
      assert.equal(
        escodegen.generate(generators.literal('hello')),
        "'hello'"
      );
    });
  });

  describe('member', function() {
    it('builds a JavaScript MemberExpression', function() {
      assert.equal(
        escodegen.generate(
          generators.member('hello', 'world')
        ),
        'hello.world'
      );
    });
  });

  describe('expressionStatement', function() {
    it('builds a JavaScript ExpressionStatement', function() {
      assert.equal(
        escodegen.generate(
          generators.expressionStatement(
           generators.member('hello', 'world')
          )
        ),
        'hello.world;'
      )
    });
  });

  describe('callExpression', function() {
    it('builds a JavaScript CallExpression with no arguments', function() {
      assert.equal(
        escodegen.generate(
          generators.callExpression(
            generators.identifier('hello')
          )
        ),
        'hello()'
      );
    });

    it('builds a JavaScript CallExpression with arguments', function() {
      assert.equal(
        escodegen.generate(
          generators.callExpression(
            generators.identifier('hello'),
            [generators.literal('world')]
          )
        ),
        "hello('world')"
      );
    });
  });

  describe('variableDeclaration', function() {
    it('builds a JavaScript VariableDeclaration', function() {
      assert.equal(
        escodegen.generate(
          generators.variableDeclaration(
            'hello',
            generators.identifier('world'),
            [generators.literal('!')]
          )
        ),
        "var hello = world('!');"
      );
    });
  });

  describe('assigns', function() {
    it('builds a JavaScript ExpressionStatement containing an AssignmentExpression', function() {
      assert.equal(
        escodegen.generate(
          generators.assigns(
            generators.identifier('hello'),
            generators.literal('world')
          )
        ),
        "hello = 'world';"
      );
    });
  });

  describe('returns', function() {
    it('builds a JavaScript ReturnStatement', function() {
      assert.equal(
        escodegen.generate(generators.returns(generators.literal('hello'))),
        "return 'hello';"
      );
    });
  });

  describe('closure', function() {
    it('builds a JavaScript FunctionExpression', function() {
      assert.equal(
        escodegen.generate(
          generators.closure(
            [generators.literal('hello')]
          )
        ),
        "function () {\n    'hello'\n}()"
      );
    });
  });

  describe('jsxidentifier', function() {
    it('builds a JSXIdentifier', function() {
      let identifier = generators.jsxidentifier('hello');

      assert.property(identifier, 'type');
      assert.property(identifier, 'name');

      assert.propertyVal(identifier, 'type', 'JSXIdentifier');
      assert.propertyVal(identifier, 'name', 'hello');
    });
  });

  describe('jsx', function() {
    describe('builds a JSXElement', function() {
      it('with no attributes and no children', function() {
        let element = generators.jsxelement('hello');

        assert.property(element, 'children');
        assert.property(element, 'openingElement');
        assert.deepProperty(element, 'openingElement.attributes');
        assert.notProperty(element, 'closingElement');

        assert.deepPropertyVal(element, 'openingElement.name.name', 'hello');
        assert.deepPropertyVal(element, 'openingElement.selfClosing', true);
      });

      it('with attributes and no children', function() {
        let element = generators.jsxelement('hello', ['test']);

        assert.property(element, 'openingElement');
        assert.deepProperty(element, 'openingElement.attributes');
        assert.lengthOf(element.openingElement.attributes, 1);
        assert.deepEqual(element.openingElement.attributes, ['test']);
      });

      it('no attributes and with children', function() {
        let element = generators.jsxelement('hello', null, ['test']);

        assert.property(element, 'children');
        assert.property(element, 'closingElement');
        assert.lengthOf(element.children, 1);
        assert.deepEqual(element.children, ['test']);
      });

      it('with attributes and with children', function() {
        let element = generators.jsxelement('hello', ['attribute'], ['child']);

        assert.property(element, 'openingElement');
        assert.deepProperty(element, 'openingElement.attributes');
        assert.lengthOf(element.openingElement.attributes, 1);
        assert.deepEqual(element.openingElement.attributes, ['attribute']);

        assert.property(element, 'children');
        assert.property(element, 'closingElement');
        assert.lengthOf(element.children, 1);
        assert.deepEqual(element.children, ['child']);
      });
    });
  });
});
