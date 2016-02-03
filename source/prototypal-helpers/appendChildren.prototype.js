(function() {
  if (typeof HTMLElement.prototype.appendChildren !== 'function') {
    HTMLElement.prototype.appendChildren = function(children) {
      return require('./appendChildren.js')(this, children);
    }
  }
})();
