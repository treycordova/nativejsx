/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
  if (typeof HTMLElement.prototype.appendChildren !== 'function') {
    HTMLElement.prototype.appendChildren = function (children) {
      return __webpack_require__(3)(this, children)
    }
  }
})()


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
  if (typeof HTMLElement.prototype.setAttributes !== 'function') {
    HTMLElement.prototype.setAttributes = function (attributes) {
      return __webpack_require__(5)(this, attributes)
    }
  }
})()


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
  if (typeof HTMLElement.prototype.setStyles !== 'function') {
    HTMLElement.prototype.setStyles = function (styles) {
      return __webpack_require__(6)(this, styles)
    }
  }
})()


/***/ }),
/* 3 */
/***/ (function(module, exports) {

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)
__webpack_require__(2)
__webpack_require__(0)


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function setAttributes (element, attributes) {
  var isPlainObject = Object.prototype.toString.call(attributes) === '[object Object]' &&
    typeof attributes.constructor === 'function' &&
    Object.prototype.toString.call(attributes.constructor.prototype) === '[object Object]' &&
    attributes.constructor.prototype.hasOwnProperty('isPrototypeOf')

  if (isPlainObject) {
    for (var key in attributes) {
      element.setAttribute(key, attributes[key])
    }
  } else {
    throw new DOMException('Failed to execute \'setAttributes\' on \'Element\': ' + Object.prototype.toString.call(attributes) + ' is not a plain object.')
  }
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function setStyles (element, styles) {
  for (var style in styles) element.style[style] = styles[style]
}


/***/ })
/******/ ]);