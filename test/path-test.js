var tape = require("tape"),
    path = require("../");

tape("path.arc(…) generates the expected path for small arcs", function(test) {
  var p = path.path(); p.moveTo(150, 100), p.arc(100, 100, 50, 0, Math.PI / 2);
  test.equal(p.toString(), "M150,100L150,100A50,50,0,0,1,100,150"); // TODO drop redundant L?
  test.end();
});

tape("path.arc(…) generates the expected path for large arcs", function(test) {
  var p = path.path(); p.moveTo(150, 100), p.arc(100, 100, 50, 0, Math.PI * 1);
  test.equal(p.toString(), "M150,100L150,100A50,50,0,1,1,50,100"); // TODO drop redundant L?
  test.end();
});

tape("path.arc(…) generates the expected path for full circles", function(test) {
  var p = path.path(); p.moveTo(150, 100), p.arc(100, 100, 50, 0, Math.PI * 2);
  test.equal(p.toString(), "M150,100L150,100A50,50,0,1,1,50,100A50,50,0,1,1,150,100"); // TODO drop redundant L?
  test.end();
});

tape("path.arcTo(…) generates the expected path", function(test) {
  var p = path.path(); p.moveTo(270, 182), p.arcTo(270, 39, 163, 100, 53);
  test.equal(p.toString(), "M270,182L270,130.2226855774366A53,53,0,0,0,190.75099085274036,84.179341663391L163,100");
  var p = path.path(); p.moveTo(270, 182), p.arcTo(270, 39, 363, 100, 53);
  test.equal(p.toString(), "M270,182L270,137.1471676395838A53,53,0,0,1,352.0683817315569,92.82979877016098L363,100");
  test.end();
});
