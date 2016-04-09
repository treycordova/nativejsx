/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  if (typeof HTMLElement.prototype.setAttributes !== 'function') {
	    HTMLElement.prototype.setAttributes = function(attributes) {
	      return __webpack_require__(2)(this, attributes);
	    };
	  }
	})();


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  if (typeof HTMLElement.prototype.appendChildren !== 'function') {
	    HTMLElement.prototype.appendChildren = function(children) {
	      return __webpack_require__(4)(this, children);
	    }
	  }
	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function appendChildren(element, children) {
	  children = Array.isArray(children) ? children : [children];
	  children.forEach(function(child) {
	    if (child instanceof HTMLElement) {
	      element.appendChild(child);
	    } else if (child || typeof child === 'string') {
	      element.appendChild(document.createTextNode(child.toString()));
	    } else {
	      throw new DOMException('Failed to execute \'appendChildren\' on \'Element\': ' + Object.prototype.toString.call(child) + ' is not valid.');
	    }
	  });
	};


/***/ }
/******/ ]);