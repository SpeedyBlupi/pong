import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class BlupiWalks2 {
  constructor() {
    this.absoluteTime = 0;
    this.distance = 0;

    // const from icons
    this.deltaX = 4;
    this.deltaY = 1;
    // this.horizontalMovePerFrame = 14; // exact, but not nice
    this.horizontalMovePerFrame = 8; // better
    this.speed = 80; // 80 pixels / second
    this.fps = 10;
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;

    this.distance += elapsedTime * this.speed;
    this.distance = this.distance % 560;
  }

  draw(device, pixmap) {
    // Draw blupi.
    const start = new Point(100, 150);
    const goal = Point.add(start, new Point(this.deltaX, this.deltaY));
    const position = Point.move(start, goal, this.distance);

    const icons = [2, 3, 2, 4];
    const i = Math.trunc(this.distance / this.horizontalMovePerFrame);
    const icon = icons[i % icons.length];

    const rect = Rect.fromCenterSize(position, 80);
    pixmap.drawIcon(device, "80x80", icon, rect, 1, 0);
  }
}
