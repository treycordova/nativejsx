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
        var __d = document.createElement('span');
        __d.setAttribute('class', 'warning');
        __d.setAttribute('title', 'wut');
        __b.appendChild(__d);
        var __e = document.createTextNode('Test');
        __d.appendChild(__e);
        var __g = document.createElement('div');
        __g.setAttribute('class', 'something');
        __b.appendChild(__g);
        var __i = document.createElement('span');
        __g.appendChild(__i);
        var __j = document.createTextNode('Hello, World!');
        __i.appendChild(__j);
        var __l = document.createElement('div');
        __l.setAttribute('class', 'yesm');
        __g.appendChild(__l);
        var __o = document.createElement('input');
        __o.setAttribute('type', 'text');
        __o.setAttribute('class', 'rawr');
        __o.required = true;
        __o.disabled = true;
        __b.appendChild(__o);
        return __b;
    }();
    console.log(hello instanceof HTMLElement);
    return hello;
}