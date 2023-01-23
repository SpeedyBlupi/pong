import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class BlupiWalks1 {
  constructor() {
    this.pixmap = new Pixmap();
    this.absoluteTime = 0;
    this.distance = 0;
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;
    this.distance += elapsedTime * 50; // 50 pixels / second
    this.distance = this.distance % 500;
  }

  draw(device) {
    const start = new Point(100, 50);
    const goal = new Point(200, 90);
    const position = Point.move(start, goal, this.distance);

    const icons = [2, 3, 2, 4];
    const i = Math.trunc(this.distance / 8);
    const icon = icons[i % icons.length];

    const rect = Rect.fromCenterSize(position, 80);
    this.pixmap.drawIcon(device, "80x80", icon, rect, 1, 0);
  }
}
