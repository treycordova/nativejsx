'use strict';

let assert = require('chai').assert;
let allocator = require('../source/allocator.js');

function allocate(amount) {
  let allocations = [];

  for(let i = 0; i < amount; i++) {
    allocations.push(allocator.next());
  }

  return allocations;
};

describe('allocator', function() {
  beforeEach(function() {
    allocator.reset();
  });

  describe('next', function() {
    it('should return a letter from the alphabet', function() {
      assert.equal(allocator.next(), '$$a');
    });

    describe('upon exhaustion of the alphabet', function() {
      it('should increase variable length by 1', function() {
        allocate(26);
        assert.equal(allocator.next(), '$$aa');
      });

      it('should increase variable length by 2', function() {
        allocate(26 * 2);
        assert.equal(allocator.next(), '$$aaa');
      });
    });
  });

  describe('reset', function() {
    it('should reset the allocator, producing "$$a"', function() {
      assert.equal(allocator.next(), '$$a');
      assert.equal(allocator.next(), '$$b');
      allocator.reset();
      assert.equal(allocator.next(), '$$a');
    });
  });
});
