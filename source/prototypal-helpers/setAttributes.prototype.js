(function () {
  if (typeof HTMLElement.prototype.setAttributes !== 'function') {
    HTMLElement.prototype.setAttributes = function (attributes) {
      return require('./setAttributes.js')(this, attributes)
    }
  }
})()
