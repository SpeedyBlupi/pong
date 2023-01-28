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

  constructor(mode) {
    this.mode = mode;
    this.random = new Random();
    this.absoluteTime = 0;

    // Initialise un sol aléatoire.
    // const ground = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20];
    const ground = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 14, 15, 25];
    this.world = {};
    this.maxx = 20;
    this.maxy = 15;
    for (let y = 0; y < this.maxy; y++) {
      for (let x = 0; x < this.maxx; x++) {
        const key = Point.toKey({ x, y });
        const i = this.random.getRandomInt(0, ground.length);
        this.world[key] = ground[i];
      }
    }

    // Initialise le bord gauche du sol.
    for (let x = 0; x < this.maxx; x++) {
      const key = Point.toKey({ x, y: this.maxy });
      this.world[key] = 1 * 16 + 14;
    }

    // Initialise le bord droite du sol.
    for (let y = 0; y < this.maxy; y++) {
      const key = Point.toKey({ x: this.maxx, y });
      this.world[key] = 1 * 16 + 15;
    }

    const gadgets = [
      // Partie technique.
      { pos: new Point(7, 1), icon: 4 * 16 + 12 },
      { pos: new Point(8, 1), icon: 5 * 16 + 15 },
      { pos: new Point(9, 1), icon: 5 * 16 + 12 },
      { pos: new Point(7, 2), icon: 0 * 16 + 4 },
      { pos: new Point(8, 2), icon: 0 * 16 + 6 },
      { pos: new Point(9, 2), icon: 0 * 16 + 11 },
      { pos: new Point(7, 3), icon: 0 * 16 + 10 },
      { pos: new Point(8, 3), icon: 6 * 16 + 13 },
      { pos: new Point(9, 3), icon: 0 * 16 + 5 },
      { pos: new Point(7, 4), icon: 0 * 16 + 7 },
      { pos: new Point(8, 4), icon: 0 * 16 + 9 },
      { pos: new Point(9, 4), icon: 0 * 16 + 10 },

      // Mur du fond.
      { pos: new Point(3, 7), icon: 4 * 16 + 5 },
      { pos: new Point(4, 7), icon: 4 * 16 + 5 },
      { pos: new Point(5, 7), icon: 5 * 16 + 5 },
      { pos: new Point(6, 7), icon: 4 * 16 + 5 },
      { pos: new Point(7, 7), icon: 6 * 16 + 5 },
      { pos: new Point(8, 7), icon: 5 * 16 + 5 },
      { pos: new Point(9, 7), icon: 4 * 16 + 5 },
      { pos: new Point(10, 7), icon: 4 * 16 + 5 },
      { pos: new Point(11, 7), icon: 5 * 16 + 5 },
      { pos: new Point(12, 7), icon: 5 * 16 + 5 },
      { pos: new Point(13, 7), icon: 5 * 16 + 5 },
      { pos: new Point(14, 7), icon: 6 * 16 + 5 },
      { pos: new Point(15, 7), icon: 4 * 16 + 5 },
      { pos: new Point(16, 7), icon: 5 * 16 + 5 },
      { pos: new Point(17, 7), icon: 4 * 16 + 5 },
      { pos: new Point(18, 7), icon: 5 * 16 + 5 },

      // Döpart.
      { pos: new Point(3, 8), icon: 3 * 16 + 8 },
      { pos: new Point(3, 9), icon: 3 * 16 + 3 },
      { pos: new Point(3, 10), icon: 3 * 16 + 9 },

      // Arrivée.
      { pos: new Point(18, 8), icon: 3 * 16 + 10 },
      { pos: new Point(18, 9), icon: 3 * 16 + 15 },
      { pos: new Point(18, 10), icon: 3 * 16 + 11 },

      // Trous.
      { pos: new Point(10, 8), icon: 1 * 16 + 13 },
      { pos: new Point(10, 10), icon: 1 * 16 + 13 },
    ];
    for (let i = 0; i < gadgets.length; i++) {
      const gadget = gadgets[i];
      const key = Point.toKey(gadget.pos);
      this.world[key] = gadget.icon;
    }

    this.speed = 50;

    const o = BlupiWorld1.convertFromDiscret(new Point(4, -2));
    this.originX = o.x;
    this.originY = o.y;
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
    this.absoluteTime += elapsedTime;

    if (this.mode === "move") {
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
  }

  draw(device, pixmap) {
    const o = this.getOrigin();

    for (let y = 0; y <= this.maxy; y++) {
      for (let x = 0; x <= this.maxx; x++) {
        const p = { x, y };
        const icon = this.world[Point.toKey(p)];
        const c = Point.add(o, BlupiWorld1.convertFromDiscret({ x, y }));
        const rect = Rect.fromCenterSize(c, 80);
        pixmap.drawIcon(device, "bm2", icon, rect, 1, 0);
      }
    }
  }
}
