import {test} from "vitest";
import assert from "assert";
import {path, pathRound} from "../src/index.js";

test("pathRound() defaults to three digits of precision", () => {
  const p = pathRound();
  p.moveTo(Math.PI, Math.E);
  assert.strictEqual(p + "", "M3.142,2.718");
});

test("pathRound(null) is equivalent to pathRound(0)", () => {
  const p = pathRound(null);
  p.moveTo(Math.PI, Math.E);
  assert.strictEqual(p + "", "M3,3");
});

test("pathRound(digits) validates the specified digits", () => {
  assert.throws(() => pathRound(NaN), /invalid digits/);
  assert.throws(() => pathRound(-1), /invalid digits/);
});

test("pathRound(digits) ignores digits if greater than 15", () => {
  const p = pathRound(40);
  p.moveTo(Math.PI, Math.E);
  assert.strictEqual(p + "", "M3.141592653589793,2.718281828459045");
});

test("pathRound.moveTo(x, y) limits the precision", () => {
  const p = pathRound(1);
  p.moveTo(123.456, 789.012);
  assert.strictEqual(p + "", "M123.5,789");
});

test("pathRound.lineTo(x, y) limits the precision", () => {
  const p = pathRound(1);
  p.moveTo(0, 0);
  p.lineTo(123.456, 789.012);
  assert.strictEqual(p + "", "M0,0L123.5,789");
});

test("pathRound.arc(x, y, r, a0, a1, ccw) limits the precision", () => {
  const p0 = path(), p = pathRound(1);
  p0.arc(10.0001, 10.0001, 123.456, 0, Math.PI+0.0001);
  p.arc(10.0001, 10.0001, 123.456, 0, Math.PI+0.0001);
  assert.strictEqual(p + "", precision(p0 + "", 1));
  p0.arc(10.0001, 10.0001, 123.456, 0, Math.PI-0.0001);
  p.arc(10.0001, 10.0001, 123.456, 0, Math.PI-0.0001);
  assert.strictEqual(p + "", precision(p0 + "", 1));
  p0.arc(10.0001, 10.0001, 123.456, 0, Math.PI / 2, true);
  p.arc(10.0001, 10.0001, 123.456, 0, Math.PI / 2, true);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

test("pathRound.arcTo(x1, y1, x2, y2, r) limits the precision", () => {
  const p0 = path(), p = pathRound(1);
  p0.arcTo(10.0001, 10.0001, 123.456, 456.789, 12345.6789);
  p.arcTo(10.0001, 10.0001, 123.456, 456.789, 12345.6789);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

test("pathRound.quadraticCurveTo(x1, y1, x, y) limits the precision", () => {
  const p0 = path(), p = pathRound(1);
  p0.quadraticCurveTo(10.0001, 10.0001, 123.456, 456.789);
  p.quadraticCurveTo(10.0001, 10.0001, 123.456, 456.789);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

test("pathRound.bezierCurveTo(x1, y1, x2, y2, x, y) limits the precision", () => {
  const p0 = path(), p = pathRound(1);
  p0.bezierCurveTo(10.0001, 10.0001, 123.456, 456.789, 0.007, 0.006);
  p.bezierCurveTo(10.0001, 10.0001, 123.456, 456.789, 0.007, 0.006);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

test("pathRound.rect(x, y, w, h) limits the precision", () => {
  const p0 = path(), p = pathRound(1);
  p0.rect(10.0001, 10.0001, 123.456, 456.789);
  p.rect(10.0001, 10.0001, 123.456, 456.789);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

function precision(str, precision) {
  return str.replace(/\d+\.\d+/g, s => +parseFloat(s).toFixed(precision));
}
