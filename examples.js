'use strict';

var nativejsx = require('./source/nativejsx');

// Asynchronous, ideal for bulk operations.
nativejsx.parse('./test/jsx/test.jsx', {acorn: {ecmaVersion: 6}}).then(function(byPromise) {
  // ==>
  console.log(byPromise);
});

// OR Synchronous, for callback and promise naysayers :).
let bySync = nativejsx.parseSync('./test/jsx/node-expressions.jsx', {prototypes: 'inline'});
// ==>
console.log(bySync);

// OR We must go deeper.
let byString = nativejsx.transpile('var something = <div></div>;');
// ==>
console.log(byString);
