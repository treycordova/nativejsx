function HTMLElement() {

}

global.HTMLElement = global.HTMLElement || Object;

global.document = global.document || {
  createTextNode: function(text) {}
};

function DOMException(message) {
  this.message = message;
}
DOMException.prototype = new Error();
DOMException.prototype.constructor = DOMException;

global.DOMException = global.DOMException || DOMException;
