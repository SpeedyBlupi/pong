import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class Racket1 {
  constructor() {
    this.absoluteTime = 0;

    this.size = 80; // racket size
    this.speed = 300; // 300 pixels / second
    this.x = 0;
    this.y = 0;
  }

  initialise() {
    const area = Pixmap.fullScreen;

    this.x = area.right - this.size / 2;
    this.y = (area.top + area.bottom) / 2;
  }

  get rect() {
    const center = new Point(this.x, this.y);
    return Rect.fromCenterSize(center, this.size);
  }

  _isArrowUp(input) {
    return input.keysDown.has("ArrowUp");
  }
  _isArrowDown(input) {
    return input.keysDown.has("ArrowDown");
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;

    // Move racket according to arrow keys up/down.
    let move = 0;
    if (this._isArrowUp(input)) {
      move = -this.speed;
    }
    if (this._isArrowDown(input)) {
      move = this.speed;
    }
    this.y += move * elapsedTime;

    // Clip position into area.
    const area = Pixmap.fullScreen;
    this.y = Math.max(this.y, area.top + this.size / 2);
    this.y = Math.min(this.y, area.bottom - this.size / 2);
  }

  draw(device, pixmap) {
    // Draw racket.
    const center = new Point(this.x, this.y);
    const rect = Rect.fromCenterSize(center, this.size);
    pixmap.drawIcon(device, "80x80", 8, rect, 1, 0);
  }
}
