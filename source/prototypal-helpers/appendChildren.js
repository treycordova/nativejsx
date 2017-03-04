module.exports = function appendChildren (element, children) {
  children = Array.isArray(children) ? children : [children]
  children.forEach(function (child) {
    if (child instanceof HTMLElement) {
      element.appendChild(child)
    } else if (child || typeof child === 'string') {
      element.appendChild(document.createTextNode(child.toString()))
    }
  })
}
