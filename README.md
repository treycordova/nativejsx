## jsxdom
#### JSX to native DOM API transpilation.
Want all the goodness of JSX without the React dependency?
**Wait**, not quite _all_ of the goodness, but a well-rounded feature set that makes sense within the realm of JavaScript's native DOM API.

I know. "Why all the words?" Just show you something.
##### IMPORTANT NOTE:
All compilation **requires** node 5.2 or greater _including_ the `--harmony_destructuring` flag. For example:
```
$ node --harmony_destructuring my-jsxdom-script.js
```

#### Example

Here's the scenario, Capitan:
```jsx
function template() {
  return (
    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-secondary" onclick={eventListener}>Left</button>
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
  declarationType: 'var',
  variablePrefix: '$$'
});

console.log(transpiledGoodness);
```
That `console.log` hussles to show you the amazing native DOM API output.
```javascript
function template() {
  return function () {
    var $$a = document.createElement('div');
      $$a.setAttribute('class', 'btn-group');
      $$a.setAttribute('role', 'group');
      $$a.setAttribute('aria-label', 'Basic example');
      var $$b = document.createElement('button');
        $$b.setAttribute('type', 'button');
        $$b.setAttribute('class', 'btn btn-secondary');
        $$b.addEventListener('click', eventListener);
        $$a.appendChild($$b);
        var $$c = document.createTextNode('Left');
          $$b.appendChild($$c);
      var $$d = document.createElement('button');
        $$d.setAttribute('type', 'button');
        $$d.setAttribute('class', 'btn btn-secondary');
        $$a.appendChild($$d);
        var $$e = document.createTextNode('Middle');
          $$d.appendChild($$e);
      var $$f = document.createElement('button');
        $$f.setAttribute('type', 'button');
        $$f.setAttribute('class', 'btn btn-secondary');
        $$a.appendChild($$f);
        var $$g = document.createTextNode('Right');
          $$f.appendChild($$g);
    return $$a;
  }();
}
```
#### Options
##### declarationType
Either `var` or `let`.

Defaults to `var`.
##### variablePrefix
Any string you can conjure up that produces a _valid_ JavaScript variable (Nice try, ;)).

Defaults to `$$`.
#### Development
##### Wish List
- Tests.
- Nodal JSXExpressions.
- Distribution through NPM.
- Source maps.
- (Your suggestion.)

##### Terminology
###### Compositions
These are endgame native DOM ASTs that we plan on swapping with JSX.
###### Generators
Barebone AST node types (some are compositions of node types).
###### Transformers
Takes compositions and generators and _actually_ completes the swapping.
###### Walkers
Set up the state, allocate variables, and traverses JSXElements to our liking.
#### Why does it output everything in a closure?
I'm glad you stuck around to ask. Due to the imperative nature of the native DOM API, we're outputting variable allocations – you know, the "$$a" stuff. To avoid variable clobbering, our DOM goodies are tucked away into a JavaScript closure, safe and sound.
