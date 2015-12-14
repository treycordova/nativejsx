function test1() {
    return function () {
        var __a = document.createElement('div');
          __a.setAttribute('class', 'className');
        return __a;
    }();
}
function test2() {
    var hello = function () {
        var __b = document.createElement('div');
          __b.setAttribute('id', 'world');
          var __c = document.createElement('span');
            __c.setAttribute('class', 'warning');
            __c.setAttribute('title', 'wut');
          var __d = document.createElement('div');
            __d.setAttribute('class', 'something');
          var __e = document.createElement('input');
            __e.setAttribute('type', 'text');
            __e.setAttribute('class', 'rawr');
            __e.required = true;
            __e.disabled = true;
        __b.appendChild(__c);
        __b.appendChild(__d);
        __b.appendChild(__e);
        return __b;
    }();
    console.log(hello instanceof HTMLElement);
}
