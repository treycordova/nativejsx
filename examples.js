'use strict';

var jsxdom = require('./source/jsxdom');

// Asynchronous, ideal for bulk operations.
jsxdom.parse('./test/jsx/spread.jsx', {acorn: {ecmaVersion: 6}}).then(function(byPromise) {
  // ==>
  console.log(byPromise);
});
(function() {
// OR Synchronous, for callback and promise naysayers :).
let bySync = jsxdom.parseSync('./test/jsx/test.jsx');
// ==>
console.log(bySync);

// OR We must go deeper.
let byString = jsxdom.transpile('var something = <div></div>;');
// ==>
console.log(byString);
});
