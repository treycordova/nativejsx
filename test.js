function test1() {
    return function () {
        var __a = document.createElement('div');
        __a.setAttribute('class', 'className');
        return __a;
    }();
}
function test2() {
    var hello = function () {
        var __a = document.createElement('div');
        __a.setAttribute('id', 'world');
        var __b = document.createElement('span');
        __b.setAttribute('class', 'warning');
        __b.setAttribute('title', 'wut');
        __a.appendChild(__b);
        var __c = document.createTextNode('Test');
        __b.appendChild(__c);
        var __d = document.createElement('div');
        __d.setAttribute('class', 'something');
        __a.appendChild(__d);
        var __e = document.createElement('span');
        __d.appendChild(__e);
        var __f = document.createTextNode('Hello, World!');
        __e.appendChild(__f);
        var __g = document.createElement('div');
        __g.setAttribute('class', 'yesm');
        __d.appendChild(__g);
        var __h = document.createElement('input');
        __h.setAttribute('type', 'text');
        __h.setAttribute('class', 'rawr');
        __h.required = true;
        __h.disabled = true;
        __a.appendChild(__h);
        return __a;
    }();
    console.log(hello instanceof HTMLElement);
    return hello;
}
function template() {
    return function () {
        var __a = document.createElement('div');
        __a.setAttribute('class', 'btn-group');
        __a.setAttribute('role', 'group');
        __a.setAttribute('aria-label', 'Basic example');
        var __b = document.createElement('button');
        __b.setAttribute('type', 'button');
        __b.setAttribute('class', 'btn btn-secondary');
        __a.appendChild(__b);
        var __c = document.createTextNode('Left');
        __b.appendChild(__c);
        var __d = document.createElement('button');
        __d.setAttribute('type', 'button');
        __d.setAttribute('class', 'btn btn-secondary');
        __a.appendChild(__d);
        var __e = document.createTextNode('Middle');
        __d.appendChild(__e);
        var __f = document.createElement('button');
        __f.setAttribute('type', 'button');
        __f.setAttribute('class', 'btn btn-secondary');
        __a.appendChild(__f);
        var __g = document.createTextNode('Right');
        __f.appendChild(__g);
        return __a;
    }();
}