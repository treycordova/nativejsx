'use strict';

let assert = require('chai').assert;
let escodegen = require('escodegen');
let generators = require('../source/generators.js');
let compositions = require('../source/compositions.js');

describe('compositions', function() {
  describe('createElement', function() {
    it('builds `var hello = document.createElement(\'body\');`', function() {
      assert.equal(
        escodegen.generate(compositions.createElement('hello', 'body')),
        "var hello = document.createElement('body');"
      );
    });
  });

  describe('createTextNode', function() {
    it('builds `var hello = document.createTextNode(\'Hello\');`', function() {
      assert.equal(
        escodegen.generate(
          compositions.createTextNode('hello', generators.literal('Hello'))
        ),
        "var hello = document.createTextNode('Hello');"
      );
    });
  });

  describe('setAttribute', function() {
    it('builds `hello.setAttribute(\'hello\', \'world\');`', function() {
      assert.equal(
        escodegen.generate(
          compositions.setAttribute('hello', 'hello', generators.literal('world'))
        ),
        "hello.setAttribute('hello', 'world');"
      );
    });
  });

  describe('addEventListener', function() {
    it('builds `hello.addEventListener(\'click\', world);`', function() {
      assert.equal(
        escodegen.generate(
          compositions.addEventListener('hello', 'click', generators.identifier('world'))
        ),
        "hello.addEventListener('click', world);"
      );
    });
  });

  describe('appendChild', function() {
    it('builds `hello.appendChild(\'world\');`', function() {
      assert.equal(
        escodegen.generate(compositions.appendChild('hello', 'world')),
        "hello.appendChild(world);"
      );
    });
  });
});
