import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";
import BlupiWorld1 from "./blupi-world1";

//------------------------------------------------------------------------

export default class BlupiWalks2 {
  constructor() {
    this.absoluteTime = 0;
    this.start = BlupiWorld1.convertFromDiscret({ x: 10, y: 18 });
    this.distance = 0;

    this.delta = new Point(4, 1); // const from icons
    // this.horizontalMovePerFrame = 14; // exact, but not nice
    this.horizontalMovePerFrame = 8; // better
    this.speed = 80; // 80 pixels / second

    this.origin = new Point(0, 0);
  }

  setOrigin(origin) {
    this.origin = origin;
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;

    this.distance += elapsedTime * this.speed;
    this.distance = this.distance % 560;
  }

  draw(device, pixmap) {
    // Draw blupi.
    const goal = Point.add(this.start, this.delta);
    let position = Point.move(this.start, goal, this.distance);
    position = Point.add(this.origin, position);

    const i = Math.trunc(this.distance / this.horizontalMovePerFrame);
    const icons = [1, 2, 1, 3];
    const icon = icons[i % icons.length];

    const rect = Rect.fromCenterSize(position, 80);
    pixmap.drawIcon(device, "bm1", icon, rect, 1, 0);
  }
}
