const nativejsx = require('./source/nativejsx')

// Asynchronous, ideal for bulk operations.
nativejsx.parse('./test/jsx/test.jsx')
  .then((byPromise) => {
    // ==>
    console.log(byPromise)
  })
  .catch((error) => {
    console.error(error)
  })

// OR Synchronous, for callback and promise naysayers :).
const bySync = nativejsx.parseSync('./test/jsx/node-expressions.jsx', {prototypes: 'inline'})
// ==>
console.log(bySync)

// OR We must go deeper.
const byString = nativejsx.transpile('var something = <div></div>')
// ==>
console.log(byString)
