const allocator = require('./allocator.js')
const walkers = {}

/**
 * AST Walkers
 */

walkers.AssignmentExpression = (node, state, c) => {
  c(node.left, state, 'Expression')

  if (node.right.type === 'JSXElement') {
    state.transformed = true

    c(node.right, {
      name: allocator.next(),
      parent: null
    })
  } else {
    c(node.right, state, 'Expression')
  }
}

walkers.CallExpression = (node, state, c) => {
  c(node.callee, state, 'Expression')

  if (node.arguments) {
    for (let argument of node.arguments) {
      if (argument.type === 'JSXElement') {
        state.transformed = true

        c(argument, {
          name: allocator.next(),
          parent: null
        })
      } else {
        c(argument, state, 'Expression')
      }
    }
  }
}

walkers.ConditionalExpression = (node, state, c) => {
  for (let branch of [node.consequent, node.alternate]) {
    if (branch.type === 'JSXElement') {
      state.transformed = true

      c(branch, {
        name: allocator.next(),
        parent: null
      })
    } else {
      c(branch, state, 'Expression')
    }
  }
}

walkers.LogicalExpression = (node, state, c) => {
  for (let branch of [node.left, node.right]) {
    if (branch.type === 'JSXElement') {
      state.transformed = true

      c(branch, {
        name: allocator.next(),
        parent: null
      })
    } else {
      c(branch, state, 'Expression')
    }
  }
}

walkers.ReturnStatement = (node, state, c) => {
  if (node.argument) {
    if (node.argument.type === 'JSXElement') {
      state.transformed = true

      c(node.argument, {
        name: allocator.next(),
        parent: null
      })
    } else {
      c(node.argument, state, 'Expression')
    }
  }
}

walkers.VariableDeclarator = (node, state, c) => {
  c(node.id, state, 'Pattern')

  if (node.init) {
    if (node.init.type === 'JSXElement') {
      state.transformed = true

      c(node.init, {
        name: allocator.next(),
        parent: null
      })
    } else {
      c(node.init, state, 'Expression')
    }
  }
}

walkers.ArrowFunctionExpression = (node, state, c) => {
  if (node.id) {
    c(node.id, state, 'Pattern')
  }

  if (node.body) {
    if (node.body.type === 'JSXElement') {
      state.transformed = true

      c(node.body, {
        name: allocator.next(),
        parent: null
      })
    } else {
      c(node.body, state, 'Expression')
    }
  }
}

walkers.AssignmentPattern = (node, state, c) => {
  c(node.left, state, 'Pattern')

  if (node.right) {
    if (node.right.type === 'JSXElement') {
      state.transformed = true

      c(node.right, {
        name: allocator.next(),
        parent: null
      })
    } else {
      c(node.right, state, 'Pattern')
    }
  }
}

walkers.Property = (node, state, c) => {
  if (node.computed) {
    c(node.key, state, 'Expression')
  }

  if (node.value) {
    if (node.value.type === 'JSXElement') {
      state.transformed = true

      c(node.value, {
        name: allocator.next(),
        parent: null
      })
    } else {
      c(node.value, state, 'Expression')
    }
  }
}

walkers.JSXElement = (node, state, c) => {
  for (let attribute of node.openingElement.attributes) {
    c(attribute, state)
  }

  for (let child of node.children) {
    switch (child.type) {
      case 'Literal':
        const value = child.value.replace('\n', '').trim()

        if (value.length) {
          c(child, {
            name: allocator.next(),
            parent: state.name
          })
        }
        break
      case 'JSXExpressionContainer':
      case 'JSXElement':
        c(child, {
          name: allocator.next(),
          parent: state.name
        })
        break
      default:
        c(child, state)
    }
  }
}

walkers.JSXExpressionContainer = (node, state, c) => {
  c(node.expression, state)
}

walkers.JSXSpreadAttribute = () => {}
walkers.JSXAttribute = () => {}

module.exports = walkers
