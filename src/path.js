const pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

export class Path {
  constructor(format = String) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
    this._append = function(strings) {
      let i = 0;
      for (const j = strings.length - 1; i < j; ++i) {
        this._ += strings[i] + format(arguments[i + 1]);
      }
      this._ += strings[i];
    };
  }
  moveTo(x, y) {
    x = +x;
    y = +y;
    this._append`M${this._x0 = this._x1 = x},${this._y0 = this._y1 = y}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0;
      this._y1 = this._y0;
      this._append`Z`;
    }
  }
  lineTo(x, y) {
    x = +x;
    y = +y;
    this._append`L${this._x1 = x},${this._y1 = y}`;
  }
  quadraticCurveTo(x1, y1, x, y) {
    x1 = +x1;
    y1 = +y1;
    x = +x;
    y = +y;
    this._append`Q${x1},${y1},${this._x1 = x},${this._y1 = y}`;
  }
  bezierCurveTo(x1, y1, x2, y2, x, y) {
    x1 = +x1;
    y1 = +y1;
    x2 = +x2;
    y2 = +y2;
    x = +x;
    y = +y;
    this._append`C${x1},${y1},${x2},${y2},${this._x1 = x},${this._y1 = y}`;
  }
  arcTo(x1, y1, x2, y2, r) {
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01,
        r_ = +r;

    // Is the radius negative? Error.
    if (r_ < 0) throw new Error("negative radius: " + r_);

    x1 = +x1;
    y1 = +y1;

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._append`M${this._x1 = x1},${this._y1 = y1}`;
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r_) {
      this._append`L${this._x1 = x1},${this._y1 = y1}`;
    }

    // Otherwise, draw an arc!
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
      }

      this._append`A${r_},${r_},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
    }
  }
  arc(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._append`M${x0},${y0}`;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._append`L${x0},${y0}`;
    }

    // Is this arc empty? We’re done.
    var r_ = r;
    if (!(r_)) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._append`A${r_},${r_},0,1,${cw},${x - dx},${y - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._append`A${r_},${r_},0,${+(da >= pi)},${cw},${this._x1 = x + r * Math.cos(a1)},${this._y1 = y + r * Math.sin(a1)}`;
    }
  }
  rect(x, y, w, h) {
    x = +x;
    y = +y;
    w = +w;
    h = +h;
    this._append`M${this._x0 = this._x1 = x},${this._y0 = this._y1 = y}h${w}v${h}h${-w}Z`;
  }
  toString() {
    return this._;
  }
}

export function path() {
  return new Path;
}

// Allow instanceof d3.path
path.prototype = Path.prototype;

export function pathFixed(digits) {
  (digits = +digits).toFixed(digits); // Validate digits.
  return new Path((x) => +x.toFixed(digits));
}
