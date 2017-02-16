'use strict';

require("./softDomMock");

var expect = require('chai').expect;


var appendChildren = require("../../source/prototypal-helpers/appendChildren");

function MockHTMLElement() {
  this.isAppendChildCalled = false;
}

MockHTMLElement.prototype = new HTMLElement();
MockHTMLElement.prototype.constructor = MockHTMLElement;

MockHTMLElement.prototype.appendChild = function (node) {
  this.isAppendChildCalled = true;
};

MockHTMLElement.prototype.reset = function () {
  this.isAppendChildCalled = false;
};


describe("Append children", function () {
  var element = new MockHTMLElement();
  beforeEach(function () {
    element.reset();
  });
  it("Append String child", function () {
    //GIVEN
    var stringToAppend = "toto";
    //WHEN
    appendChildren(element, stringToAppend);
    //THEN
    expect(element.isAppendChildCalled).is.true;
  });
  describe("throw Exception", function() {
    it("Append null", function() {
      //GIVEN
      var nullToAppend = null;
      //WHEN
      var expectFunction = function(){appendChildren(element, nullToAppend)};
      //THEN
      expect(expectFunction).to.throw(DOMException);
    });
    it("Append undefined", function() {
      //GIVEN
      var undefinedToAppend = undefined;
      //WHEN
      var expectFunction = function(){appendChildren(element, undefinedToAppend)};
      //THEN
      expect(expectFunction).to.throw(DOMException);
    });
  });
  describe("Append Number", function() {
    it("Append not 0", function () {
      //GIVEN
      var numberToAppend = 1;
      //WHEN
      appendChildren(element, numberToAppend);
      //THEN
      expect(element.isAppendChildCalled).is.true;
    });
    it("Append 0", function () {
      //GIVEN
      var numberToAppend = 0;
      //WHEN
      appendChildren(element, numberToAppend);
      //THEN
      expect(element.isAppendChildCalled).is.true;
    });
  });
});
