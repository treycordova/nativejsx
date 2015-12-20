'use strict';

var jsxdom = require('./source/jsxdom');

// Asynchronous, ideal for bulk operations.
jsxdom.parse('./test/jsx/test.jsx').then(function(byPromise) {
  // ==>
  console.log(byPromise);
});

// OR Synchronous, for callback and promise naysayers :).
let bySync = jsxdom.parseSync('./test/jsx/test.jsx');
// ==>
console.log(bySync);

// OR We must go deeper.
let byString = jsxdom.transpile('var something = <div></div>;');
// ==>
console.log(byString);
