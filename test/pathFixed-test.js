var tape = require("tape"),
    path = require("../");

tape("pathFixed.moveTo(x, y) limits the precision of x and y", function(test) {
  var p = path.pathFixed(1);
  p.moveTo(123.456, 789.012);
  test.strictEqual(p + "", "M123.5,789");
  test.end();
});

tape("pathFixed.lineTo(x, y) limits the precision of x and y", function(test) {
  var p = path.pathFixed(1);
  p.moveTo(0, 0);
  p.lineTo(123.456, 789.012);
  test.strictEqual(p + "", "M0,0L123.5,789");
  test.end();
});
