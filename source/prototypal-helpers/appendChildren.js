module.exports = function appendChildren(element, children) {
  children = Array.isArray(children) ? children : [children];
  children.forEach(function (child) {
    if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (child === null) {
      throw new DOMException('Failed to execute \'appendChildren\' on \'null child\'.')
    } else if (typeof child === "undefined") {
      throw new DOMException('Failed to execute \'appendChildren\' on \'undefined child\'.')
    } else if (typeof child.toString === 'function' || typeof child === 'string') {
      element.appendChild(document.createTextNode(child.toString()));
    } else {
      throw new DOMException('Failed to execute \'appendChildren\' on \'Element\': ' + child + ' is not valid.');
    }
  });
};
