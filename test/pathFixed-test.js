import assert from "assert";
import {path, pathFixed} from "../src/index.js";

it("pathFixed.moveTo(x, y) limits the precision", () => {
  const p = pathFixed(1);
  p.moveTo(123.456, 789.012);
  assert.strictEqual(p + "", "M123.5,789");
});

it("pathFixed.lineTo(x, y) limits the precision", () => {
  const p = pathFixed(1);
  p.moveTo(0, 0);
  p.lineTo(123.456, 789.012);
  assert.strictEqual(p + "", "M0,0L123.5,789");
});

it("pathFixed.arc(x, y, r, a0, a1, ccw) limits the precision", () => {
  const p0 = path(), p = pathFixed(1);
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

it("pathFixed.arcTo(x1, y1, x2, y2, r) limits the precision", () => {
  const p0 = path(), p = pathFixed(1);
  p0.arcTo(10.0001, 10.0001, 123.456, 456.789, 12345.6789);
  p.arcTo(10.0001, 10.0001, 123.456, 456.789, 12345.6789);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

it("pathFixed.quadraticCurveTo(x1, y1, x, y) limits the precision", () => {
  const p0 = path(), p = pathFixed(1);
  p0.quadraticCurveTo(10.0001, 10.0001, 123.456, 456.789);
  p.quadraticCurveTo(10.0001, 10.0001, 123.456, 456.789);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

it("pathFixed.bezierCurveTo(x1, y1, x2, y2, x, y) limits the precision", () => {
  const p0 = path(), p = pathFixed(1);
  p0.bezierCurveTo(10.0001, 10.0001, 123.456, 456.789, 0.007, 0.006);
  p.bezierCurveTo(10.0001, 10.0001, 123.456, 456.789, 0.007, 0.006);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

it("pathFixed.rect(x, y, w, h) limits the precision", () => {
  const p0 = path(), p = pathFixed(1);
  p0.rect(10.0001, 10.0001, 123.456, 456.789);
  p.rect(10.0001, 10.0001, 123.456, 456.789);
  assert.strictEqual(p + "", precision(p0 + "", 1));
});

function precision(str, precision) {
  return str.replace(/\d+\.\d+/g, s => +parseFloat(s).toFixed(precision));
}
