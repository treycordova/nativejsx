## nativejsx [![Build Status](https://travis-ci.org/treycordova/nativejsx.svg?branch=master)](https://travis-ci.org/treycordova/nativejsx) [![Version Status](https://img.shields.io/npm/v/nativejsx.svg)](https://www.npmjs.org/package/nativejsx)
#### JSX to native DOM API transpilation.
Like the idea of keeping JSX around as a general-purpose templating language?
nativejsx is a well-rounded JSX feature subset that makes sense within the realm of JavaScript's native DOM API.

I know. _"Why all the words?"_ Just show you something.

#### Example

Here's the scenario, Capitan:
```jsx
function template() {
  return (
    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-secondary" onClick={eventListener}>Left</button>
      <button type="button" class="btn btn-secondary" ref={(ref) => this.middleButton = ref}>Middle</button>
      <button type="button" class="btn btn-secondary">Right</button>
      <button type="button" class="btn btn-secondary" style={{backgroundColor: 'peachpuff'}}>Primary</button>
    </div>
  );
}
```
That looks awesome, right? Yeah.
Now we bake it in `nativejsx` using `nativejsx.parse`:
```javascript
var nativejsx = require('nativejsx');

nativejsx.parse('dat-btn-group.js', {
  declarationType: 'var',
  variablePrefix: '$$'
}).then(function(transpiledGoodness) {
  console.log(transpiledGoodness);
});

```
That `console.log` reveals the amazing native DOM API output:
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
              ((ref) => this.middleButton = ref)($$e);
              $$d.appendChild($$e);
          var $$f = document.createElement('button');
            $$f.setAttribute('type', 'button');
            $$f.setAttribute('class', 'btn btn-secondary');
            $$a.appendChild($$f);
              var $$g = document.createTextNode('Right');
              $$f.appendChild($$g);
          var $$h = document.createElement('button');
            $$h.setAttribute('type', 'button');
            $$h.setAttribute('class', 'btn btn-secondary');
            $$h.setStyles({ backgroundColor: 'peachpuff' });
            $$a.appendChild($$h);
              var $$i = document.createTextNode('Primary');
              $$h.appendChild($$i);
        return $$a;
    }.call(this);
}
```
##### IMPORTANT NOTES:
###### Tested Node Versions
- 6.10.0

###### Frontend Dependencies
You have two choices:

1. Use a _very_ tiny JavaScript file located in `dist`, `nativejsx-prototype.js`.
Feel free to include it in your build steps (before any nativejsx-transpiled code runs, of course).

  ```html
  <script type="text/javascript" src="path/to/nativejsx-prototype.js"></script>
  // or the minified version
  <script type="text/javascript" src="path/to/nativejsx-prototype.min.js"></script>
  ```

2. Enable inline usage with the API option, `prototypes: 'inline'`. **Warning**: this places `setAttributes` and `appendChildren` in every file that they are needed.

#### API
```javascript
// (String, Object) => Promise => String
parse(fileName, options)
// (String, Object) => String
parseSync(fileName, options)
// String => String
transpile(jsx)
```
##### Options
- **declarationType**: `var` (default), `const`, or `let`.
- **variablePrefix**: Any string (defaults to `$$`) you can conjure up that produces a _valid_ JavaScript variable.
- **prototypes**: Either `true` (default) or `'inline'`.
- **acorn**: All acorn options are available [here](https://github.com/ternjs/acorn#main-parser). Defaults to `{plugins: {jsx: true}, ecmaVersion: 6, sourceType: 'module'}`.

#### Build Tools
- **Shell Script**: `nativejsx path-to-jsx/**/*.jsx [--output ./here]`. (See `nativejsx -h` for examples.)
- **Webpack**: [nativejsx-loader](https://github.com/treycordova/nativejsx-loader).
- **Grunt**: [grunt-nativejsx](https://github.com/treycordova/grunt-nativejsx).
- **Gulp**: [gulp-nativejsx](https://github.com/treycordova/gulp-nativejsx).

#### Development
##### Wish List
- ~~More Tests~~.
- ~~Hardened Nodal JSXExpressions~~.
- ~~Gulp, grunt, and webpack plugins~~.
- Source maps.
- Support SVG elements.
- (Your suggestion.)

##### Terminology
- **AST**: Abstract syntax tree.
- **Compositions**: These are endgame native DOM ASTs that we plan on swapping with JSX.
- **Generators**: Barebone AST node types (some are combinations of node types).
- **Transformers**: Takes compositions and generators and _actually_ completes the swapping.
- **Walkers**: Sets up the state, allocates variables, and traverses JSXElements to our liking.

#### What the heck is `appendChildren`?
`appendChildren` helps clean up the mess JSXExpressions (the {} things) leave due to JavaScript's lack of static typing. I can't rightly tell if the expressions your fingers conjure up are going to return JSX, literals, or whatever else.
#### What the heck is `setAttributes`?
`setAttributes` handles the [JSXSpreadAttribute](https://facebook.github.io/react/docs/jsx-spread.html) expression that is in the JSX Specification. In other words, `<div {...attributes}></div>`, where `attributes` is an object containing _valid_ HTML attribute names and values, should just work. There isn't a convenient way to do this with native DOM.
#### What the heck is `setStyles`?
`setStyles` takes an `Object` that maps keys to `HTMLElement.prototype.style` and sets the corresponding value. This is a reimplementation of React's fancy style attribute.
#### Why does it output everything in a closure?
I'm glad you stuck around to ask. Due to the imperative nature of the native DOM API, we're outputting variable allocations – you know, the "$$a" stuff. To avoid variable clobbering, our DOM goodies are tucked away into a JavaScript closure, safe and sound.
