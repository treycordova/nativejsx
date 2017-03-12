(function () {
  if (typeof HTMLElement.prototype.setStyles !== 'function') {
    HTMLElement.prototype.setStyles = function (styles) {
      return require('./setStyles.js')(this, styles)
    }
  }
})()
