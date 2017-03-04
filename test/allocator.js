const { assert } = require('chai')
const allocator = require('../source/allocator.js')

function allocate (amount) {
  return [...Array(amount)].map(() => allocator.next())
}

describe('allocator', () => {
  beforeEach(() => {
    allocator.reset()
  })

  describe('next', () => {
    it('should return a letter from the alphabet', () => {
      assert.equal(allocator.next(), '$$a')
    })

    describe('upon exhaustion of the alphabet', () => {
      it('should increase variable length by 1', () => {
        allocate(26)
        assert.equal(allocator.next(), '$$aa')
      })

      it('should increase variable length by 2', () => {
        allocate(26 * 2)
        assert.equal(allocator.next(), '$$aaa')
      })
    })
  })

  describe('reset', () => {
    it('should reset the allocator, producing "$$a"', () => {
      assert.equal(allocator.next(), '$$a')
      assert.equal(allocator.next(), '$$b')
      allocator.reset()
      assert.equal(allocator.next(), '$$a')
    })
  })
})
