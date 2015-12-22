if (typeof HTMLElement.prototype.appendChildren !== 'function') {
  HTMLElement.prototype.appendChildren = function(children) {
    children = Array.isArray(children) ? children : [children];
    children.forEach(function(child) {
      if (child instanceof HTMLElement) {
        this.appendChild(child);
      } else if (child) {
        this.appendChild(document.createTextNode(child.toString()));
      }
    }, this);
  };
}
