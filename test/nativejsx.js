const fs = require('fs')
const { assert } = require('chai')
const nativejsx = require('../source/nativejsx')

const compiled = [
  'var hello = function () {',
  "    var $$a = document.createElement('div');",
  '    return $$a;',
  '}.call(this);'
].join('\n')

describe('nativejsx', () => {
  beforeEach(() => {
    nativejsx.allocator.reset()
  })

  describe('transpile', () => {
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
        compiled
      )
    })
  })

  describe('parse', () => {
    it('returns a Promise', () => {
      assert.instanceOf(nativejsx.parse('test.jsx'), Promise)
    })

    it('resolves the promise with a transpiled String', () => {
      return nativejsx.parse('./test/jsx/test.jsx').then((javascript) => {
        assert.equal(javascript, compiled)
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
        compiled
      )
    })
  })
})
