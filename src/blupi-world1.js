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

    const gadgets = [
      { pos: new Point(17, 9), icon: 4 * 16 + 12 },
      { pos: new Point(18, 9), icon: 5 * 16 + 15 },
      { pos: new Point(19, 9), icon: 5 * 16 + 12 },
      { pos: new Point(17, 10), icon: 0 * 16 + 4 },
      { pos: new Point(18, 10), icon: 0 * 16 + 6 },
      { pos: new Point(19, 10), icon: 0 * 16 + 11 },
      { pos: new Point(17, 11), icon: 0 * 16 + 10 },
      { pos: new Point(18, 11), icon: 6 * 16 + 13 },
      { pos: new Point(19, 11), icon: 0 * 16 + 5 },
      { pos: new Point(17, 12), icon: 0 * 16 + 7 },
      { pos: new Point(18, 12), icon: 0 * 16 + 9 },
      { pos: new Point(19, 12), icon: 0 * 16 + 10 },

      { pos: new Point(13, 15), icon: 4 * 16 + 5 },
      { pos: new Point(14, 15), icon: 4 * 16 + 5 },
      { pos: new Point(15, 15), icon: 5 * 16 + 5 },
      { pos: new Point(16, 15), icon: 4 * 16 + 5 },
      { pos: new Point(17, 15), icon: 5 * 16 + 5 },
      { pos: new Point(18, 15), icon: 5 * 16 + 5 },
      { pos: new Point(19, 15), icon: 4 * 16 + 5 },
      { pos: new Point(20, 15), icon: 4 * 16 + 5 },
      { pos: new Point(21, 15), icon: 5 * 16 + 5 },
      { pos: new Point(22, 15), icon: 5 * 16 + 5 },
      { pos: new Point(23, 15), icon: 5 * 16 + 5 },
      { pos: new Point(24, 15), icon: 4 * 16 + 5 },
      { pos: new Point(25, 15), icon: 4 * 16 + 5 },
      { pos: new Point(26, 15), icon: 5 * 16 + 5 },
      { pos: new Point(27, 15), icon: 4 * 16 + 5 },
      { pos: new Point(28, 15), icon: 5 * 16 + 5 },

      { pos: new Point(13, 16), icon: 3 * 16 + 8 },
      { pos: new Point(13, 17), icon: 3 * 16 + 3 },
      { pos: new Point(13, 18), icon: 3 * 16 + 9 },
      { pos: new Point(28, 16), icon: 3 * 16 + 10 },
      { pos: new Point(28, 17), icon: 3 * 16 + 15 },
      { pos: new Point(28, 18), icon: 3 * 16 + 11 },
    ];
    for (let i = 0; i < gadgets.length; i++) {
      const gadget = gadgets[i];
      const key = Point.toKey(gadget.pos);
      this.world[key] = gadget.icon;
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
