'use strict';

let assert = require('chai').assert;
let escodegen = require('escodegen');
let generators = require('../dist/generators.js');

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
});
