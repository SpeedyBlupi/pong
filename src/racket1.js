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
    this.centerX = 0;
    this.centerY = 0;
  }

  initialise() {
    const area = Pixmap.fullScreen;

    this.centerX = area.right - this.size / 2;
    this.centerY = (area.top + area.bottom) / 2;
  }

  get rect() {
    const center = new Point(this.centerX, this.centerY);
    return Rect.fromCenterSize(center, this.size);
  }

  isArrowUp(input) {
    return input.keysDown.has("ArrowUp");
  }
  isArrowDown(input) {
    return input.keysDown.has("ArrowDown");
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;

    // Move racket according to arrow keys up/down.
    let move = 0;
    if (this.isArrowUp(input)) {
      move = -this.speed;
    }
    if (this.isArrowDown(input)) {
      move = this.speed;
    }
    this.centerY += move * elapsedTime;

    // Clip position into area.
    const area = Pixmap.fullScreen;
    this.centerY = Math.max(this.centerY, area.top + this.size / 2);
    this.centerY = Math.min(this.centerY, area.bottom - this.size / 2);
  }

  draw(device, pixmap) {
    // Draw racket.
    const center = new Point(this.centerX, this.centerY);
    const rect = Rect.fromCenterSize(center, this.size);
    pixmap.drawIcon(device, "80x80", 8, rect, 1, 0);
  }
}
