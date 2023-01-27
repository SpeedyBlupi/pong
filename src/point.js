import Misc from "./misc";

export default class Point {
  /**
   * Constructor, make a Point.
   * @param {number} x - coordinate X: 0..800 pixels
   * @param {number} y - coordinate Y: 0..480 pixels, from top to bottom
   * @returns {Point}
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  //------------------------------------------------------------------------

  // Return a copy of point.
  static fromPoint(p) {
    return new Point(p.x, p.y);
  }

  static get zero() {
    return { x: 0, y: 0 };
  }

  static toKey(p) {
    return `${p.x}/${p.y}`;
  }

  static isEqual(p1, p2) {
    if (!p1 || !p2) {
      return false;
    }
    return p1.x === p2.x && p1.y === p2.y;
  }

  static approximativeEqual(a, b, chouia = 0.001) {
    return Math.abs(a.x - b.x) < chouia && Math.abs(a.y - b.y) < chouia;
  }

  static approximativeHorizontal(a, b, chouia = 0.001) {
    return Math.abs(a.y - b.y) < chouia;
  }

  static approximativeVertical(a, b, chouia = 0.001) {
    return Math.abs(a.x - b.x) < chouia;
  }

  static isZero(p) {
    return !p || (!p.x && !p.y);
  }

  static add(p1, p2) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
  }

  static sub(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
  }

  static mul(p, value) {
    return { x: p.x * value, y: p.y * value };
  }

  static div(p, value) {
    return { x: p.x / value, y: p.y / value };
  }

  //------------------------------------------------------------------------

  static gridAlign(pos) {
    return Point.convertFromDiscret(Point.convertToDiscret(pos));
  }

  static convertToDiscret(pos) {
    pos = Point.fromPoint(pos);
    pos.x -= 16;
    pos.y -= 32;

    pos = Point.gridAlignFromPoint(pos, 32, 64);
    var x, y;

    if (pos.x >= 0) {
      x = Math.trunc(pos.x / 64);
    } else {
      x = Math.trunc(pos.x / 64 - 1);
    }

    if (pos.y >= 0) {
      y = Math.trunc(pos.y / 64);
    } else {
      y = Math.trunc(pos.y / 64 - 1);
    }

    return { x, y };
  }

  static convertToRealDiscret(pos) {
    return {
      x: Math.round((pos.x - 16.0 - 32.0) / 64.0),
      y: Math.round((pos.y - 32.0 - 32.0) / 64.0),
    };
  }

  static convertFromDiscret(pos) {
    return { x: 16 + 32 + 64 * pos.x, y: 32 + 32 + 64 * pos.y };
  }

  static gridAlignFromPoint(pos, offset, step) {
    return {
      x: Point.gridAlignFromValue(pos.x, offset, step),
      y: Point.gridAlignFromValue(pos.y, offset, step),
    };
  }

  //	Met une valeur sur la grille la plus proche.
  static gridAlignFromValue(value, offset, step) {
    if (value + offset < 0.0) {
      return Math.trunc((value + offset - step / 2.0) / step) * step - offset;
    } else {
      return Math.trunc((value + offset + step / 2.0) / step) * step - offset;
    }
  }

  //------------------------------------------------------------------------

  static computeAngleDegFromPoints(c, a) {
    return Misc.radToDeg(Point.computeAngleRadFromXY(a.x - c.x, a.y - c.y));
  }

  static computeAngleRadFromPoints(c, a) {
    return Point.computeAngleRadFromXY(a.x - c.x, a.y - c.y);
  }

  //	Calcule l'angle d'un triangle rectangle.
  //	L'angle est anti-horaire (CCW), compris entre 0 et 2*PI.
  //	Pour obtenir un angle horaire (CW), il suffit de passer -y.
  //
  //	    ^
  //	    |
  //	  y o----o
  //	    |  / |
  //	    |/)a |
  //	----o----o-->
  //	    |    x
  //	    |
  static computeAngleRadFromXY(x, y) {
    if (x === 0.0 && y === 0.0) {
      return 0.0;
    }

    return Math.atan2(y, x);
  }

  //------------------------------------------------------------------------

  /**
   * Returns the distance between two points.
   * @param {Point} a
   * @param {Point} b
   * @returns {number} the distance
   */
  static distance(a, b) {
    if (!a || !b) {
      console.error("point.distance: a or b undefined");
      return 1000000;
    }

    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceToSegment(a, b, p) {
    if (Point.isEqual(a, b)) {
      return Point.distance(a, p);
    }

    var k;

    var dx = b.x - a.x;
    var dy = b.y - a.y;

    k = dx * (p.x - a.x) + dy * (p.y - a.y);
    k /= dx * dx + dy * dy;

    if (k < 0) {
      return Point.distance(a, p);
    }
    if (k > 1) {
      return Point.distance(b, p);
    }

    return Point.distance({ x: a.x + k * dx, y: a.y + k * dy }, p);
  }

  //------------------------------------------------------------------------

  static canProjectOnSegment(a, b, p) {
    return !!Point.getProjectionScale(a, b, p, true);
  }

  static getProjectionScale(a, b, p, strict) {
    if (Point.isEqual(a, b)) {
      return null;
    }

    var k;

    var dx = b.x - a.x;
    var dy = b.y - a.y;

    k = dx * (p.x - a.x) + dy * (p.y - a.y);
    k /= dx * dx + dy * dy;

    if (strict) {
      if (k < 0 || k > 1) {
        return null;
      }
    }

    return k;
  }

  //	Calcule la projection d'un point P sur une droite AB.
  static projection(a, b, p) {
    if (Point.isEqual(a, b)) {
      return p;
    }

    var k;

    var dx = b.x - a.x;
    var dy = b.y - a.y;

    k = dx * (p.x - a.x) + dy * (p.y - a.y);
    k /= dx * dx + dy * dy;

    return { x: a.x + k * dx, y: a.y + k * dy };
  }

  //------------------------------------------------------------------------

  /**
   * Rotates a point around a center.
   * @param {Point} center - center of the circle
   * @param {number} angle - angle in degrees -360..360
   * @param {Point} p - point on the circle
   * @returns {Point} p' rotated point
   */
  static rotatePointDeg(center, angle, p) {
    return Point.rotatePointRad(center, Misc.degToRad(angle), p);
  }

  static rotatePointRad(center, angle, p) {
    //	Fait tourner un point autour d'un centre.
    //	L'angle est exprimé en radians.
    //	Un angle positif est horaire (CW), puisque Y va de haut en bas.

    const a = { x: 0, y: 0 };
    const b = { x: 0, y: 0 };

    a.x = p.x - center.x;
    a.y = p.y - center.y;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    b.x = a.x * cos - a.y * sin;
    b.y = a.x * sin + a.y * cos;

    b.x += center.x;
    b.y += center.y;

    return b;
  }

  //	Multiplie le vecteur AB par le facteur d'échelle.
  //	Retourne la nouvelle extrémité B.
  static scale(a, b, scale) {
    return { x: a.x + (b.x - a.x) * scale, y: a.y + (b.y - a.y) * scale };
  }

  /**
   * Moves a certain distance along a line AB.
   * @param {Point} a - A: origin
   * @param {Point} b - B: point along the line
   * @param {number} distance
   * @returns {Point} point 'a' moved
   */
  static move(a, b, distance) {
    const length = Point.distance(a, b);
    const scale = length === 0 ? 0 : distance / length;

    return Point.scale(a, b, scale);
  }

  //	Calcule le point A' sym�trique de A par rapport au centre C.
  static symmetry(c, a) {
    return { x: c.x - (a.x - c.x), y: c.y - (a.y - c.y) };
  }

  static mapPoint(a, b, p) {
    return {
      x: ((p.x - a.left) * b.width) / a.width + b.left,
      y: ((p.y - a.top) * b.height) / a.height + b.top,
    };
  }

  //------------------------------------------------------------------------

  //	Calcule un point sur une courbe de Bézier, en fonction du paramètre t (0..1).
  //	Si t=0, on est sur p1.
  //	Si t=1, on est sur p2.
  static fromBezier(p1, s1, s2, p2, t) {
    const t1 = (1 - t) * (1 - t) * (1 - t);
    const t2 = (1 - t) * (1 - t) * t * 3;
    const t3 = (1 - t) * t * t * 3;
    const t4 = t * t * t;

    return {
      x: p1.x * t1 + s1.x * t2 + s2.x * t3 + p2.x * t4,
      y: p1.y * t1 + s1.y * t2 + s2.y * t3 + p2.y * t4,
    };
  }

  //	Cherche la valeur de t (0..1) correspondant le mieux possible au nouveau point.
  //	Il n'est pas obligatoire que le nouveau point soit sur la courbe
  //	(algorithme = distance la plus courte).
  static findBezierParameter(p1, s1, s2, p2, p) {
    const maxStep = 1000; // nombre d'étapes arbitraire fixé à 1000

    const t = 0;
    const dt = 1.0 / maxStep;

    var bestT = 0;
    var min = 1000000;

    for (var step = 1; step < maxStep; step++) {
      t += dt;

      const b = Point.fromBezier(p1, s1, s2, p2, t);
      const d = Point.distance(b, p); // d <- distance jusqu'au point

      if (d < min) {
        min = d; // min <- distance minimale
        bestT = t; // t   <- valeur correspondante
      }
    }

    return bestT;
  }

  //------------------------------------------------------------------------

  /**
   * Calcule l'intersection I d'une droite AB avec une horizontale Y.
   * @param {Point} a
   * @param {Point} b
   * @param {nomber} y
   * @returns map {result: true/false, pos: Point}
   */
  static intersectsWithHorizontal(a, b, y) {
    const i = Point.fromPoint(a);

    if (y < Math.min(a.y, b.y) || y >= Math.max(a.y, b.y)) {
      return { result: false, pos: i };
    }

    if (a.y === b.y) {
      return { result: true, pos: i };
    }

    i.x = a.x + (y - a.y) * ((b.x - a.x) / (b.y - a.y));
    i.y = y;

    return { result: true, pos: i };
  }

  /**
   * Calcule l'intersection I d'une droite AB avec une verticale X.
   * @param {Point} a
   * @param {Point} b
   * @param {nomber} y
   * @returns map {result: true/false, pos: Point}
   */
  static intersectsWithVertical(a, b, x) {
    const i = Point.fromPoint(a);

    if (x < Math.min(a.x, b.x) || x >= Math.max(a.x, b.x)) {
      return { result: false, pos: i };
    }

    if (a.x === b.x) {
      return { result: true, pos: i };
    }

    i.x = x;
    i.y = a.y + (x - a.x) * ((b.y - a.y) / (b.x - a.x));

    return { result: true, pos: i };
  }

  //  Calcule l'intersection d'une droite avec un cercle.
  //  Retourne le nombre d'intersections (0..2).
  static intersectWithCircle(p1, p2, cc, r) {
    const a = Math.pow(p2.x - p1.x, 2.0) + Math.pow(p2.y - p1.y, 2.0);
    const b =
      2 * ((p2.x - p1.x) * (p1.x - cc.x) + (p2.y - p1.y) * (p1.y - cc.y));
    const c =
      cc.x * cc.x +
      cc.y * cc.y +
      p1.x * p1.x +
      p1.y * p1.y -
      2 * (cc.x * p1.x + cc.y * p1.y) -
      r * r;
    const d = b * b - 4 * a * c;

    var i1 = null;
    var i2 = null;

    if (d < 0.0) {
      return { n: 0, i1, i2 };
    } else if (d === 0.0) {
      const k = -b / (2 * a);

      i1 = {
        x: p1.x + k * (p2.x - p1.x),
        y: p1.y + k * (p2.y - p1.y),
      };

      i2 = i1;

      return { n: 1, i1, i2 };
    } else {
      const k1 = (-b + Math.sqrt(d)) / (2 * a);
      const k2 = (-b - Math.sqrt(d)) / (2 * a);

      i1 = {
        x: p1.x + k1 * (p2.x - p1.x),
        y: p1.y + k1 * (p2.y - p1.y),
      };

      i2 = {
        x: p1.x + k2 * (p2.x - p1.x),
        y: p1.y + k2 * (p2.y - p1.y),
      };

      return { n: 2, i1, i2 };
    }
  }

  //------------------------------------------------------------------------
}
