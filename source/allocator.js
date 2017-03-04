const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const ALPHABET_LENGTH = ALPHABET.length

let variableIndex = 0

const allocator = {
  VARIABLE_PREFIX: '$$'
}

allocator.next = () => {
  let repetition = Math.ceil(variableIndex / ALPHABET_LENGTH)
  repetition += variableIndex % ALPHABET_LENGTH === 0 ? 1 : 0

  let letter = ALPHABET[variableIndex % ALPHABET_LENGTH]
  let letteredComponent = Array(repetition).fill(letter).join('')

  variableIndex += 1

  return allocator.VARIABLE_PREFIX + letteredComponent
}

allocator.reset = () => {
  variableIndex = 0
}

module.exports = allocator
