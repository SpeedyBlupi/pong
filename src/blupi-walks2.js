import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class BlupiWalks2 {
  constructor() {
    this.pixmap = new Pixmap();
    this.absoluteTime = 0;
    this.walkingStep = 0;
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;

    // 5 steps / second
    this.walkingStep = Math.trunc(this.absoluteTime * 10) % 50;
  }

  draw(device) {
    const start = new Point(100, 150);
    const goal = new Point(200, 190);
    // 10 pixels / step, so speed = 50 pixels / second
    const position = Point.move(start, goal, this.walkingStep * 8);

    const icons = [2, 3, 2, 4];
    const icon = icons[this.walkingStep % icons.length];

    const rect = Rect.fromCenterSize(position, 80);
    this.pixmap.drawIcon(device, "80x80", icon, rect, 1, 0);
  }
}
