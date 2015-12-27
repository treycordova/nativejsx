'use strict';

let assert = require('chai').assert;
let transformers = require('../source/transformers.js');
let generators = require('../source/generators.js');

describe('transformers', function() {
  describe('JSXAttribute', function() {
    let node;
    let state;

    beforeEach(function() {
      node = {name: {name: 'name'}, value: generators.literal('value')};
      state = {name: 'name'};
    });

    describe('when attribute is an event', function() {
      beforeEach(function() {
        node.name.name = 'onclick';
      });

      it('transforms into an `addEventListener`, removing "on"', function() {
        transformers.JSXAttribute(node, state);

        assert.deepPropertyVal(
          node,
          'expression.callee.object.name',
          state.name
        );

        assert.deepPropertyVal(
          node,
          'expression.callee.property.name',
          'addEventListener'
        );

        assert.deepPropertyVal(
          node,
          'expression.arguments[0].value',
          'click'
        );

        assert.deepPropertyVal(
          node,
          'expression.arguments[1].value',
          'value'
        );
      });
    });

    describe('when attribute is an HTML attribute and value', function() {

      it('transforms into a `setAttribute`', function() {
        transformers.JSXAttribute(node, state);

        assert.deepPropertyVal(
          node,
          'expression.callee.object.name',
          state.name
        );

        assert.deepPropertyVal(
          node,
          'expression.callee.property.name',
          'setAttribute'
        );

        assert.deepPropertyVal(
          node,
          'expression.arguments[1].value',
          'value'
        );
      });

      describe('when attribute isn\'t mapped', function() {
        beforeEach(function() {
          node.name.name = 'id';
        });

        it('preserves the attribute name', function() {
          transformers.JSXAttribute(node, state);

          assert.deepPropertyVal(
            node,
            'expression.arguments[0].value',
            'id'
          );
        });
      });

      describe('when attribute is mapped', function() {
        beforeEach(function() {
          node.name.name = 'className';
        });

        it('maps the attribute name', function() {
          transformers.JSXAttribute(node, state);

          assert.deepPropertyVal(
            node,
            'expression.arguments[0].value',
            'class'
          );
        });
      });
    });

    describe('when attribute is an HTML property', function() {
      beforeEach(function() {
        node.name.name = 'required';
      });

      it('transforms into a property assignment', function() {
        transformers.JSXAttribute(node, state);

        assert.deepPropertyVal(
          node,
          'expression.operator',
          '='
        );

        assert.deepPropertyVal(
          node,
          'expression.left.object.name',
          state.name
        );

        assert.deepPropertyVal(
          node,
          'expression.left.property.name',
          'required'
        );

        assert.deepPropertyVal(
          node,
          'expression.right.value',
          true
        );
      });
    });
  });

  describe('JSXElement', function() {
    let element;
    let state;

    describe('as a child element', function() {
      beforeEach(function() {
        element = {
          openingElement: {
            name: {
              name: 'div'
            },
            attributes: []
          }
        };

        state = {
          parent: 'parent',
          name: 'name'
        };
      });

      it('adds a new property, "transform"', function() {
        transformers.JSXElement(element, state);
        assert.property(element, 'transform');
      });

      it('assigns transform an Array of length 2', function() {
        transformers.JSXElement(element, state);
        assert.isArray(element.transform);
        assert.lengthOf(element.transform, 2);
      });

      describe('its transform property', function() {
        it('contains a VariableDeclaration at index 0', function() {
          transformers.JSXElement(element, state);

          assert.deepPropertyVal(
            element,
            'transform[0].type',
            'VariableDeclaration'
          );
        });

        it('contains an ExpressionStatement at index 1', function() {
          transformers.JSXElement(element, state);

          assert.deepPropertyVal(
            element,
            'transform[1].type',
            'ExpressionStatement'
          );
        });
      });
    });

    describe('as a root element', function() {
      beforeEach(function() {
        state = {parent: null, name: 'name'};
        element.children = [];
      });

      it('creates a closure', function() {
        transformers.JSXElement(element, state);

        assert.deepPropertyVal(
          element,
          'callee.type',
          'FunctionExpression'
        );

        assert.deepPropertyVal(
          element,
          'callee.body.body[1].type',
          'ReturnStatement'
        );
      });

      describe('with children', function() {
        beforeEach(function() {
          element.children = [
            {transform: 'transform1'},
            {transform: 'transform2', children: [{transform: 'transform3'}]}
          ];
        });

        it('adds chidren transforms to the body', function() {
          transformers.JSXElement(element, state);

          assert.deepProperty(element, 'callee.body.body');
          assert.lengthOf(element.callee.body.body, 5);
          assert.include(
            element.callee.body.body,
            'transform1',
            'transform2',
            'transform3'
          );
        });
      });
    });
  });

  describe('JSXExpressionContainer', function() {
    describe('using the transform property', function() {
      let element;
      let state;

      beforeEach(function() {
        element = {expression: 'hello'};
        state = {parent: 'parent'};
      });

      it('builds an `appendChildren` AST', function() {
        transformers.JSXExpressionContainer(element, state);

        assert.deepPropertyVal(
          element,
          'transform.type',
          'ExpressionStatement'
        );

        assert.deepPropertyVal(
          element,
          'transform.expression.callee.object.name',
          state.parent
        );

        assert.deepPropertyVal(
          element,
          'transform.expression.callee.property.name',
          'appendChildren'
        );

        assert.deepPropertyVal(
          element,
          'transform.expression.arguments[0]',
          element.expression
        );
      });
    });
  });

  describe('Literal', function() {
    describe('inside a JSXElement', function() {
      let element;
      let state;

      beforeEach(function() {
        element = {value: 'hello'};
        state = {parent: 'parent', name: 'name'};
      });

      it('builds a transform property', function() {
        transformers.Literal(element, state);

        assert.property(element, 'transform');
        assert.isArray(element.transform);
        assert.lengthOf(element.transform, 2);
      });

      describe('using the transform property', function() {
        it('builds a `createTextNode` AST', function() {
          transformers.Literal(element, state);

          assert.deepPropertyVal(
            element,
            'transform[0].type',
            'VariableDeclaration'
          );

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].id.name',
            state.name
          );

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].init.callee.object.name',
            'document'
          );

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].init.callee.property.name',
            'createTextNode'
          );

          assert.deepPropertyVal(
            element,
            'transform[0].declarations[0].init.arguments[0].value',
            element.value
          );
        });

        it('builds an `appendChild` AST', function() {
          transformers.Literal(element, state);

          assert.deepPropertyVal(
            element,
            'transform[1].type',
            'ExpressionStatement'
          );

          assert.deepPropertyVal(
            element,
            'transform[1].expression.type',
            'CallExpression'
          );

          assert.deepPropertyVal(
            element,
            'transform[1].expression.callee.object.name',
            state.parent
          );

          assert.deepPropertyVal(
            element,
            'transform[1].expression.callee.property.name',
            'appendChild'
          );

          assert.deepPropertyVal(
            element,
            'transform[1].expression.arguments[0].name',
            state.name
          );
        });
      });
    });
  });
});
