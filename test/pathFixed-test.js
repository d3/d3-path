var tape = require("tape"),
    path = require("../");

tape("pathFixed.moveTo(x, y) limits the precision", function(test) {
  var p = path.pathFixed(1);
  p.moveTo(123.456, 789.012);
  test.strictEqual(p + "", "M123.5,789");
  test.end();
});

tape("pathFixed.lineTo(x, y) limits the precision", function(test) {
  var p = path.pathFixed(1);
  p.moveTo(0, 0);
  p.lineTo(123.456, 789.012);
  test.strictEqual(p + "", "M0,0L123.5,789");
  test.end();
});

tape("pathFixed.arc(x, y, r, a0, a1, ccw) limits the precision", function(test) {
  var p0 = path.path(), p = path.pathFixed(1);
  p0.arc(10.0001, 10.0001, 123.456, 0, Math.PI+0.0001);
  p.arc(10.0001, 10.0001, 123.456, 0, Math.PI+0.0001);
  test.strictEqual(p + "", precision(p0 + "", 1));
  p0.arc(10.0001, 10.0001, 123.456, 0, Math.PI-0.0001);
  p.arc(10.0001, 10.0001, 123.456, 0, Math.PI-0.0001);
  test.strictEqual(p + "", precision(p0 + "", 1));
  p0.arc(10.0001, 10.0001, 123.456, 0, Math.PI / 2, true);
  p.arc(10.0001, 10.0001, 123.456, 0, Math.PI / 2, true);
  test.strictEqual(p + "", precision(p0 + "", 1));
  test.end();
});

tape("pathFixed.arcTo(x1, y1, x2, y2, r) limits the precision", function(test) {
  var p0 = path.path(), p = path.pathFixed(1);
  p0.arcTo(10.0001, 10.0001, 123.456, 456.789, 12345.6789);
  p.arcTo(10.0001, 10.0001, 123.456, 456.789, 12345.6789);
  test.strictEqual(p + "", precision(p0 + "", 1));
  test.end();
});

tape("pathFixed.quadraticCurveTo(x1, y1, x, y) limits the precision", function(test) {
  var p0 = path.path(), p = path.pathFixed(1);
  p0.quadraticCurveTo(10.0001, 10.0001, 123.456, 456.789);
  p.quadraticCurveTo(10.0001, 10.0001, 123.456, 456.789);
  test.strictEqual(p + "", precision(p0 + "", 1));
  test.end();
});

tape("pathFixed.bezierCurveTo(x1, y1, x2, y2, x, y) limits the precision", function(test) {
  var p0 = path.path(), p = path.pathFixed(1);
  p0.bezierCurveTo(10.0001, 10.0001, 123.456, 456.789, 0.007, 0.006);
  p.bezierCurveTo(10.0001, 10.0001, 123.456, 456.789, 0.007, 0.006);
  test.strictEqual(p + "", precision(p0 + "", 1));
  test.end();
});

tape("pathFixed.rect(x, y, w, h) limits the precision", function(test) {
  var p0 = path.path(), p = path.pathFixed(1);
  p0.rect(10.0001, 10.0001, 123.456, 456.789);
  p.rect(10.0001, 10.0001, 123.456, 456.789);
  test.strictEqual(p + "", precision(p0 + "", 1));
  test.end();
});


function precision(str, precision) {
  return str.replace(/\d+\.\d+/g, s => +parseFloat(s).toFixed(precision));
}
