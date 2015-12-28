## jsxdom [![Build Status](https://travis-ci.org/treycordova/jsxdom.svg?branch=master)](https://travis-ci.org/treycordova/jsxdom) [![Version Status](https://img.shields.io/npm/v/jsxdom.svg)](https://www.npmjs.org/package/jsxdom)
#### JSX to native DOM API transpilation.
Want all the goodness of JSX without the React dependency?
**Wait**, not quite _all_ of the goodness, but a well-rounded feature set that makes sense within the realm of JavaScript's native DOM API.

I know. "Why all the words?" Just show you something.

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

jsxdom.parse('dat-btn-group.js', {
  declarationType: 'var',
  variablePrefix: '$$'
}).then(function(transpiledGoodness) {
  console.log(transpiledGoodness);
});

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
##### IMPORTANT NOTES:
###### Destructuring
All compilation **requires** node 5.2 or greater _including_ the `--harmony_destructuring` flag. For example:
```bash
$ node --harmony_destructuring my-jsxdom-script.js
```
###### Frontend Dependency
A _very_ tiny JavaScript file located in `dist`, `appendChildren.js`, is **required**.
```html
<script type="text/javascript" src="path/to/appendChildren.js"></script>
```

#### API
```javascript
parse(/* String: */ fileName, /* Object: */ options) // => Promise => String
parseSync(/* String: */ fileName, /* Object: */ options) // => String
transpile(/* String: */ jsx) // => String
```
##### Options
- **declarationType**: Either `var` (default) or `let`.
- **variablePrefix**: Any string (defaults to `$$`) you can conjure up that produces a _valid_ JavaScript variable.
- **acorn**: All acorn options are available [here](https://github.com/ternjs/acorn#main-parser). Defaults to `{plugins: {jsx: true}}`.

#### Build Tools
- **Webpack**: [jsxdom-loader](https://github.com/treycordova/jsxdom-loader).
- **Grunt**: [grunt-jsxdom](https://github.com/treycordova/grunt-jsxdom).
- **Gulp**: [gulp-jsxdom](https://github.com/treycordova/gulp-jsxdom).

#### Development
##### Wish List
- ~~More Tests~~.
- ~~Hardened Nodal JSXExpressions~~.
- ~~Gulp, grunt, and webpack plugins~~.
- Source maps.
- (Your suggestion.)

##### Terminology
- **Compositions**: These are endgame native DOM ASTs that we plan on swapping with JSX.
- **Generators**: Barebone AST node types (some are compositions of node types).
- **Transformers**: Takes compositions and generators and _actually_ completes the swapping.
- **Walkers**: Set up the state, allocate variables, and traverses JSXElements to our liking.

#### What the heck is `appendChildren`?
`appendChildren` helps clean up the mess JSXExpressions (the {} things) leave due to JavaScript's lack of static typing. I can't rightly tell if the expressions your fingers conjure up are going to return JSX, literals, or whatever else.
#### Why does it output everything in a closure?
I'm glad you stuck around to ask. Due to the imperative nature of the native DOM API, we're outputting variable allocations – you know, the "$$a" stuff. To avoid variable clobbering, our DOM goodies are tucked away into a JavaScript closure, safe and sound.
