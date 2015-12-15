function test1() {
    return function () {
        var a = document.createElement('div');
        a.setAttribute('class', 'className');
        return a;
    }();
}
function test2() {
    var hello = function () {
        var a = document.createElement('div');
        a.setAttribute('id', 'world');
        var b = document.createElement('span');
        b.setAttribute('class', 'warning');
        b.setAttribute('title', 'wut');
        a.appendChild(b);
        var c = document.createTextNode('Test');
        b.appendChild(c);
        var d = document.createElement('div');
        d.setAttribute('class', 'something');
        a.appendChild(d);
        var e = document.createElement('span');
        d.appendChild(e);
        var f = document.createTextNode('Hello, World!');
        e.appendChild(f);
        var g = document.createElement('div');
        g.setAttribute('class', 'yesm');
        d.appendChild(g);
        var h = document.createElement('input');
        h.setAttribute('type', 'text');
        h.setAttribute('class', 'rawr');
        h.required = true;
        h.disabled = true;
        a.appendChild(h);
        return a;
    }();
    console.log(hello instanceof HTMLElement);
    return hello;
}