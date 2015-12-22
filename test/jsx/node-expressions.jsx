function test() {
  var hello = 'Hello, World!';

  return (
    <div>
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
