import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class Pong1 {
  constructor() {
    this.position = new Point(100, 100);
    this.direction = 30; // 30 deg
    this.radius = 40;
    this.speed = 200; // 200 pixels / second
  }

  step(device, elapsedTime, input) {
    const distance = elapsedTime * this.speed;
    const x = this.position.x + distance;
    const y = this.position.y;
    const p = new Point(x, y);
    const lastPosition = this.position;
    let newPosition = Point.rotatePointDeg(this.position, this.direction, p);

    const area = Pixmap.fullScreen.inflate(-this.radius, -this.radius);
    const ul = new Point(area.left, area.top);
    const ur = new Point(area.right, area.top);
    const bl = new Point(area.left, area.bottom);
    const br = new Point(area.right, area.bottom);
    let i;

    // Collision à droite ?
    if (newPosition.x > area.right) {
      i = Point.intersectsWithVertical(lastPosition, newPosition, area.right);
      if (i.result) {
        newPosition = i.pos;
        this.direction = 180 - this.direction;
      }
    }

    // Collision à gauche ?
    if (newPosition.x < area.left) {
      i = Point.intersectsWithVertical(lastPosition, newPosition, area.left);
      if (i.result) {
        newPosition = i.pos;
        this.direction = 180 - this.direction;
      }
    }

    // Collision en bas ?
    if (newPosition.y > area.bottom) {
      i = Point.intersectsWithHorizontal(
        lastPosition,
        newPosition,
        area.bottom
      );
      if (i.result) {
        newPosition = i.pos;
        this.direction = -this.direction;
      }
    }

    // Collision en haut ?
    if (newPosition.y < area.top) {
      i = Point.intersectsWithHorizontal(lastPosition, newPosition, area.top);
      if (i.result) {
        newPosition = i.pos;
        this.direction = -this.direction;
      }
    }

    this.position = newPosition;
  }

  draw(device, pixmap) {
    // Draw ball.
    const rect = Rect.fromCenterSize(this.position, this.radius * 2);
    pixmap.drawIcon(device, "80x80", 0, rect, 1, 0);
  }
}
