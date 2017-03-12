module.exports = function setStyles (element, styles) {
  for (var style in styles) element.style[style] = styles[style]
}
