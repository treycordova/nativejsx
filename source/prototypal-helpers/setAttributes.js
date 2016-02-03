module.exports = function setAttributes(element, attributes) {
  var isPlainObject = Object.prototype.toString.call(attributes) === '[object Object]' &&
    typeof attributes.constructor === 'function' &&
    Object.prototype.toString.call(attributes.constructor.prototype) === '[object Object]' &&
    attributes.constructor.prototype.hasOwnProperty('isPrototypeOf');

  if (isPlainObject) {
    for (var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  } else {
    throw new DOMException('Failed to execute \'setAttributes\' on \'Element\': ' + Object.prototype.toString.call(attributes) + ' is not a plain object.');
  }
};
