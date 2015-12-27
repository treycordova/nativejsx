function test() {
  var hello = 'Hello, World!';
  var listener = function() {};

  return (
    <div className="yes" onclick={listener}>
      {hello}
      <div>Hello, World!</div>
    </div>
  );
}

function test2() {
  return (
    <ul>
      {[1, 2, 3].map(function(item) {
        return <li>{item}</li>;
      })}
    </ul>
  );
}
