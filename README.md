### jsxdom
#### JSX to native DOM API transpilation.
Want all the goodness of JSX without the React dependency?
**Wait**, not quite _all_ of the goodness, but a well-rounded feature set that makes sense within the realm of JavaScript's native DOM API.

I know. "Why all the words?" Just show you something.

Here's the scenario capitan:
```jsx
function template() {
  return (
    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-secondary">Left</button>
      <button type="button" class="btn btn-secondary">Middle</button>
      <button type="button" class="btn btn-secondary">Right</button>
    </div>
  );
}
```
That looks sexy, right? Yeah.
Now we bake it in `jsxdom` using `jsxdom.parse`:
```javascript
var jsxdom = require('jsxdom');

var transpiledGoodness = jsxdom.parse('dat-btn-group.js', {
  variableDeclaration: 'var',
  prefix: '$$'
});

console.log(transpiledGoodness);
```
That `console.log` hussles to show you the amazing native DOM API output.
```javascript
function template() {
    return function () {
        var a = document.createElement('div');
          a.setAttribute('class', 'btn-group');
          a.setAttribute('role', 'group');
          a.setAttribute('aria-label', 'Basic example');
        var b = document.createElement('button');
          b.setAttribute('type', 'button');
          b.setAttribute('class', 'btn btn-secondary');
          a.appendChild(b);
          var c = document.createTextNode('Left');
            b.appendChild(c);
        var d = document.createElement('button');
          d.setAttribute('type', 'button');
          d.setAttribute('class', 'btn btn-secondary');
          a.appendChild(d);
          var e = document.createTextNode('Middle');
            d.appendChild(e);
        var f = document.createElement('button');
          f.setAttribute('type', 'button');
          f.setAttribute('class', 'btn btn-secondary');
          a.appendChild(f);
          var g = document.createTextNode('Right');
            f.appendChild(g);
        return a;
    }();
}
```
