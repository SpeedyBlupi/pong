import Point from "./point";
import Pixmap from "./pixmap";

export default class Rect {
  /**
   * Constructor, make a Rect.
   * @param {number} left - Coordinate X
   * @param {number} top - Coordinate Y
   * @param {number} width - Horizontal size
   * @param {number} height - Vertical size
   * @returns {Rect}
   */
  constructor(left, top, width, height) {
    if (
      typeof left === "undefined" ||
      typeof top === "undefined" ||
      typeof width === "undefined" ||
      typeof height === "undefined"
    ) {
      this.left = left || 0;
      this.right = left || 0;
      this.top = left || 0;
      this.bottom = left || 0;
    } else {
      this.left = left;
      this.right = left + width;
      this.top = top;
      this.bottom = top + height;
    }
  }

  // Return a copy of rectangle.
  static fromRect(rect) {
    if (!rect) {
      return null;
    }
    return Rect.fromLeftRightTopBottom(
      rect.left,
      rect.right,
      rect.top,
      rect.bottom
    );
  }

  static fromLeftRightTopBottom(left, right, top, bottom) {
    return new Rect(left, top, right - left, bottom - top);
  }

  static fromCenterSize(center, size) {
    if (typeof size === "number") {
      size = { dx: size, dy: size };
    }
    return new Rect(
      center.x - size.dx / 2,
      center.y - size.dy / 2,
      size.dx,
      size.dy
    );
  }

  static fromP1P2(p1, p2) {
    return new Rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
  }

  //------------------------------------------------------------------------

  get width() {
    return this.right - this.left;
  }

  set width(w) {
    this.right = this.left + w;
  }

  get height() {
    return this.bottom - this.top;
  }

  set height(h) {
    this.bottom = this.top + h;
  }

  get center() {
    return {
      x: (this.left + this.right) / 2,
      y: (this.top + this.bottom) / 2,
    };
  }

  // Get top-left corner.
  get p1() {
    return { x: this.left, y: this.top };
  }

  // Get bottom-right corner.
  get p2() {
    return { x: this.right, y: this.bottom };
  }

  get size() {
    return { dx: this.right - this.left, dy: this.bottom - this.top };
  }

  set size(size) {
    const c = this.center;
    this.left = c.x - size.dx / 2;
    this.right = c.x + size.dx / 2;
    this.top = c.y - size.dy / 2;
    this.bottom = c.y + size.dy / 2;
  }

  //------------------------------------------------------------------------

  /**
   * Check if a point is inside the current rectangle.
   * @param {Point} p
   * @returns {boolean} true if p is inside
   */
  isInside(p) {
    return (
      p.x >= this.left &&
      p.x <= this.right &&
      p.y >= this.top &&
      p.y <= this.bottom
    );
  }

  /**
   * Enlarge the current rectangle.
   * @param {number} dx
   * @param {number} dy
   * @returns {Rect} the rectangle enlarged
   */
  inflate(dx, dy) {
    dy = dy || dx;
    return new Rect(
      this.left - dx,
      this.top - dy,
      this.width + dx * 2,
      this.height + dy * 2
    );
  }

  /**
   * Move the current rectangle.
   * @param {Point} m - dx and dy
   * @returns none
   */
  move(m) {
    this.left += m.dx;
    this.right += m.dx;
    this.top += m.dy;
    this.bottom += m.dy;
  }

  //------------------------------------------------------------------------

  static intersectRect(src1, src2) {
    const left = Math.max(src1.left, src2.left);
    const right = Math.min(src1.right, src2.right);
    const top = Math.max(src1.top, src2.top);
    const bottom = Math.min(src1.bottom, src2.bottom);

    const r = new Rect(left, top, right - left, bottom - top);
    return {
      rect: r,
      isEmpty: Rect.isRectEmpty(r),
    };
  }

  static unionRect(src1, src2) {
    const left = Math.min(src1.left, src2.left);
    const right = Math.max(src1.right, src2.right);
    const top = Math.min(src1.top, src2.top);
    const bottom = Math.max(src1.bottom, src2.bottom);

    const r = new Rect(left, top, right - left, bottom - top);
    return {
      rect: r,
      isEmpty: Rect.isRectEmpty(r),
    };
  }

  static isRectEmpty(rect) {
    return rect.left >= rect.right || rect.top >= rect.bottom;
  }

  // Map r in a to b.
  static mapRect(a, b, r) {
    a = a || Pixmap.fullScreen;
    b = b || Pixmap.fullScreen;
    r = r || Pixmap.fullScreen;
    const p1 = Point.mapPoint(a, b, r.p1);
    const p2 = Point.mapPoint(a, b, r.p2);
    return Rect.fromP1P2(p1, p2);
  }

  static rotateAdjust(rect, angle) {
    //  La rotation s'effectue selon le coin sup/gauche. Il faut donc adapter rect,
    //  puisqu'on souhaite une rotation selon le centre.
    const c = {
      x: rect.Width / 2.0,
      y: rect.Height / 2.0,
    };

    const r = Point.rotatePointRad({ x: 0, y: 0 }, angle, c);

    const dx = r.x - c.x;
    const dy = r.y - c.y;

    return new Rect(rect.left - dx, rect.top - dy, rect.width, rect.height);
  }

  //------------------------------------------------------------------------

  toString() {
    return `left=${this.left}, top=${this.top}, right=${this.right}, bottom=${this.bottom}`;
  }
}
