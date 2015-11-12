var tape = require("tape"),
    path = require("../");

tape("path is an instanceof path", function(test) {
  var p = path.path();
  test.ok(p instanceof path.path);
  test.end();
});

tape("path.beginPath() empties all subpaths", function(test) {
  var p = path.path(); p.moveTo(150, 50); p.lineTo(200, 100);
  test.equal(p.toString(), "M150,50L200,100");
  p.beginPath();
  test.equal(p.toString(), "");
  test.end();
});

tape("path.moveTo(x, y) appends an M command", function(test) {
  var p = path.path(); p.moveTo(150, 50);
  test.equal(p.toString(), "M150,50");
  p.lineTo(200, 100);
  test.equal(p.toString(), "M150,50L200,100");
  p.moveTo(100, 50);
  test.equal(p.toString(), "M150,50L200,100M100,50");
  test.end();
});

tape("path.closePath() appends a Z command", function(test) {
  var p = path.path(); p.moveTo(150, 50);
  test.equal(p.toString(), "M150,50");
  p.closePath();
  test.equal(p.toString(), "M150,50Z");
  test.end();
});

tape("path.lineTo(x, y) appends an L command", function(test) {
  var p = path.path(); p.moveTo(150, 50);
  test.equal(p.toString(), "M150,50");
  p.lineTo(200, 100);
  test.equal(p.toString(), "M150,50L200,100");
  p.lineTo(100, 50);
  test.equal(p.toString(), "M150,50L200,100L100,50");
  test.end();
});

tape("path.quadraticCurveTo(x1, y1, x, y) appends a Q command", function(test) {
  var p = path.path(); p.moveTo(150, 50);
  test.equal(p.toString(), "M150,50");
  p.quadraticCurveTo(100, 50, 200, 100);
  test.equal(p.toString(), "M150,50Q100,50,200,100");
  test.end();
});

tape("path.bezierCurveTo(x1, y1, x, y) appends a C command", function(test) {
  var p = path.path(); p.moveTo(150, 50);
  test.equal(p.toString(), "M150,50");
  p.bezierCurveTo(100, 50, 0, 24, 200, 100);
  test.equal(p.toString(), "M150,50C100,50,0,24,200,100");
  test.end();
});

tape("path.arc(x, y, radius, startAngle, endAngle) appends a single A command if the angle is less than π", function(test) {
  var p = path.path(); p.moveTo(150, 100), p.arc(100, 100, 50, 0, Math.PI / 2);
  test.equal(p.toString(), "M150,100L150,100A50,50,0,0,1,100,150"); // TODO drop redundant L?
  test.end();
});

tape("path.arc(x, y, radius, startAngle, endAngle) appends a single A command if the angle is less than τ", function(test) {
  var p = path.path(); p.moveTo(150, 100), p.arc(100, 100, 50, 0, Math.PI * 1);
  test.equal(p.toString(), "M150,100L150,100A50,50,0,1,1,50,100"); // TODO drop redundant L?
  test.end();
});

tape("path.arc(x, y, radius, startAngle, endAngle) appends two A commands if the angle is greater than τ", function(test) {
  var p = path.path(); p.moveTo(150, 100), p.arc(100, 100, 50, 0, Math.PI * 2);
  test.equal(p.toString(), "M150,100L150,100A50,50,0,1,1,50,100A50,50,0,1,1,150,100"); // TODO drop redundant L?
  test.end();
});

tape("path.arcTo(x1, y1, x2, y2, radius) appends an A command if the arc starts at the current point", function(test) {
  var p = path.path(); p.moveTo(270, 182), p.arcTo(270, 39, 163, 100, 53);
  test.equal(p.toString(), "M270,182L270,130.2226855774366A53,53,0,0,0,190.75099085274036,84.179341663391L163,100");
  var p = path.path(); p.moveTo(270, 182), p.arcTo(270, 39, 363, 100, 53);
  test.equal(p.toString(), "M270,182L270,137.1471676395838A53,53,0,0,1,352.0683817315569,92.82979877016098L363,100");
  test.end();
});

tape("path.arcTo(x1, y1, x2, y2, radius) appends L and A commands if the arc does not start at the current point", function(test) {
  // TODO
  test.end();
});

tape("path.rect(x, y, w, h) appends M, h, v, h, and Z commands", function(test) {
  var p = path.path(); p.moveTo(150, 100), p.rect(100, 200, 50, 25);
  test.equal(p.toString(), "M150,100M100,200h50v25h-50Z");
  test.end();
});
