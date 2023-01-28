import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class BlupiWorld1 {
  static convertFromDiscret(p) {
    const x = 44 * p.x - 36 * p.y;
    const y = 11 * p.x + 18 * p.y;
    return { x, y };
  }

  constructor() {
    this.random = new Random();
    this.absoluteTime = 0;

    // const ground = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20];
    const ground = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 14, 15, 25];
    this.world = {};
    this.maxx = 100;
    this.maxy = 100;
    for (let y = 0; y < this.maxy; y++) {
      for (let x = 0; x < this.maxx; x++) {
        const key = Point.toKey({ x, y });
        const i = this.random.getRandomInt(0, ground.length);
        this.world[key] = ground[i];
      }
    }

    this.speed = 50;
    this.originX = 150;
    this.originY = -250;
  }

  getOrigin() {
    return new Point(this.originX, this.originY);
  }

  isArrowLeft(input) {
    return input.keysDown.has("ArrowLeft");
  }
  isArrowRight(input) {
    return input.keysDown.has("ArrowRight");
  }
  isArrowUp(input) {
    return input.keysDown.has("ArrowUp");
  }
  isArrowDown(input) {
    return input.keysDown.has("ArrowDown");
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime * this.speed;

    if (this.isArrowLeft(input)) {
      this.originX += elapsedTime * this.speed * 4;
      this.originY += elapsedTime * this.speed * 1;
    }
    if (this.isArrowRight(input)) {
      this.originX -= elapsedTime * this.speed * 4;
      this.originY -= elapsedTime * this.speed * 1;
    }
    if (this.isArrowUp(input)) {
      this.originX -= elapsedTime * this.speed * 2;
      this.originY += elapsedTime * this.speed * 4;
    }
    if (this.isArrowDown(input)) {
      this.originX += elapsedTime * this.speed * 2;
      this.originY -= elapsedTime * this.speed * 4;
    }
  }

  draw(device, pixmap) {
    const o = this.getOrigin();

    for (let y = 0; y < this.maxy; y++) {
      for (let x = 0; x < this.maxx; x++) {
        const p = { x, y };
        const icon = this.world[Point.toKey(p)];
        const c = Point.add(o, BlupiWorld1.convertFromDiscret({ x, y }));
        const rect = Rect.fromCenterSize(c, 80);
        pixmap.drawIcon(device, "bm2", icon, rect, 1, 0);
      }
    }
  }
}
