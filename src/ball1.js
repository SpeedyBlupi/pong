import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class Ball1 {
  constructor() {
    this.absoluteTime = 0;

    this.position = null;
    this.direction = 0;
    this.radius = 0;
    this.racketRect = null;
  }

  initialise() {
    this.position = new Point(100, 100);
    this.direction = 30; // 30 deg
    this.radius = 20;
  }

  setRacketRect(rect) {
    this.racketRect = rect;
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;

    const distance = elapsedTime * 200; // 200 pixels / second
    const goal = Point.rotatePointDeg(
      this.position,
      this.direction,
      new Point(this.position.x + 100, this.position.y)
    );
    this.position = Point.move(this.position, goal, distance);

    // Collision avec la raquette.
    if (this.racketRect) {
      if (
        this.position.y >= this.racketRect.top &&
        this.position.y <= this.racketRect.bottom &&
        this.position.x > this.racketRect.left - this.radius
      ) {
        this.direction = 180 - this.direction;
      }
    }

    const area = Pixmap.fullScreen.inflate(-this.radius, -this.radius);

    // Collision à droite ?
    if (this.position.x > area.right) {
      this.direction = 180 - this.direction;
    }

    // Collision à gauche ?
    if (this.position.x < area.left) {
      this.direction = 180 - this.direction;
    }

    // Collision en bas ?
    if (this.position.y > area.bottom) {
      this.direction = -this.direction;
    }

    // Collision en haut ?
    if (this.position.y < area.top) {
      this.direction = -this.direction;
    }
  }

  draw(device, pixmap) {
    // Draw ball.
    const rect = Rect.fromCenterSize(this.position, this.radius * 2);
    pixmap.drawIcon(device, "80x80", 0, rect, 1, 0);
  }
}
