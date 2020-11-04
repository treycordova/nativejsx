const fs = require('fs')
const { assert } = require('chai')
const nativejsx = require('../source/nativejsx')

const compiledTest = [
  'var hello = function () {',
  "    var $$a = document.createElement('div');",
  '    return $$a;',
  '}.call(this);'
].join('\n')

const compiledNodeExpressions = [
  'function test() {',
  "    var hello = 'Hello, World!';",
  '    var listener = function () {',
  '    };',
  '    return function () {',
  "        var $$a = document.createElement('div');",
  "        $$a.setAttribute('class', 'yes');",
  "        $$a.addEventListener('click', listener);",
  '        $$a.appendChildren(hello);',
  "        var $$c = document.createElement('div');",
  '        $$a.appendChild($$c);',
  "        var $$d = document.createTextNode('Hello, World!');",
  '        $$c.appendChild($$d);',
  '        return $$a;',
  '    }.call(this);',
  '}',
  'function test2() {',
  '    return function () {',
  "        var $$e = document.createElement('ul');",
  '        $$e.appendChildren([',
  '            1,',
  '            2,',
  '            3',
  '        ].map(item => {',
  '            return function () {',
  "                var $$g = document.createElement('li');",
  '                $$g.appendChildren(item);',
  '                return $$g;',
  '            }.call(this);',
  '        }));',
  '        return $$e;',
  '    }.call(this);',
  '}'
].join('\n')

describe('nativejsx', () => {
  beforeEach(() => {
    nativejsx.allocator.reset()
  })

  describe('transpile test.jsx', () => {
    let source

    beforeEach(() => {
      source = fs.readFileSync('./test/jsx/test.jsx')
    })

    it('returns a String', () => {
      assert.isString(
        nativejsx.transpile(source)
      )
    })

    it('returns a transpiled String', () => {
      assert.equal(
        nativejsx.transpile(source),
        compiledTest
      )
    })
  })

  describe('transpile node-expressions.jsx', () => {
    let source

    beforeEach(() => {
      source = fs.readFileSync('./test/jsx/node-expressions.jsx')
    })

    it('returns a String', () => {
      assert.isString(
        nativejsx.transpile(source)
      )
    })

    it('returns a transpiled String', () => {
      console.log(nativejsx.transpile(source))
      assert.equal(
        nativejsx.transpile(source),
        compiledNodeExpressions
      )
    })
  })

  describe('parse', () => {
    it('returns a Promise', () => {
      assert.instanceOf(nativejsx.parse('test.jsx'), Promise)
    })

    it('resolves the promise with a transpiled String', () => {
      return nativejsx.parse('./test/jsx/test.jsx').then((javascript) => {
        assert.equal(javascript, compiledTest)
      })
    })

    describe('with options', () => {
      const options = {
        variablePrefix: '__',
        declarationType: 'var'
      }

      it('doesn\'t mutate the options passed in as an argument', () => {
        nativejsx.parse('./test/jsx/test.jsx', options)

        assert.deepEqual(options, {
          variablePrefix: '__',
          declarationType: 'var'
        })
      })

      it('outputs transpiled source with __ variable prefixes', () => {
        assert.match(
          nativejsx.parseSync('./test/jsx/test.jsx', options),
          /var __a/
        )
      })

      it('outputs transpiled source with `let` variable declarations', () => {
        options.declarationType = 'let'

        assert.match(
          nativejsx.parseSync('./test/jsx/test.jsx', options),
          /let __a/
        )
      })
    })
  })

  describe('parseSync', () => {
    it('returns a String', () => {
      assert.isString(nativejsx.parseSync('./test/jsx/test.jsx'))
    })

    it('returns a transpiled String', () => {
      assert.equal(
        nativejsx.parseSync('./test/jsx/test.jsx'),
        compiledTest
      )
    })
  })
})
