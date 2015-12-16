function test1() {
  return (
    <div className="className"></div>
  );
}

function test2() {
  var hello = (
    <div id="world">
      <span className="warning" title="wut">Test</span>
      <div className="something">
        <span>Hello, World!</span>
        <div className="yesm"></div>
      </div>
      <input type="text" className="rawr" required disabled />
    </div>
  );

  console.log(hello instanceof HTMLElement);
  return hello;
}

function template() {
  return (
    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-secondary">Left</button>
      <button type="button" class="btn btn-secondary">Middle</button>
      <button type="button" class="btn btn-secondary">Right</button>
    </div>
  );
}
