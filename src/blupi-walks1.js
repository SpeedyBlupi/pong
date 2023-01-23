import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

//------------------------------------------------------------------------

export default class BlupiWalks1 {
  constructor() {
    this.absoluteTime = 0;

    // const from icons
    this.deltaX = 4;
    this.deltaY = 1;
    // this.horizontalMovePerFrame = 14; // exact, but not nice
    this.horizontalMovePerFrame = 8; // better
    this.fps = 10;

    this.walkingStep = 0;
  }

  step(device, elapsedTime, input) {
    this.absoluteTime += elapsedTime;

    // 10 fps = 10 steps / second
    this.walkingStep = Math.trunc(this.absoluteTime * this.fps) % 70;
  }

  draw(device, pixmap) {
    // Draw blupi.
    const start = new Point(100, 50);
    const goal = Point.add(start, new Point(this.deltaX, this.deltaY));

    // 8 pixels / step, so speed = 80 pixels / second
    const position = Point.move(
      start,
      goal,
      this.walkingStep * this.horizontalMovePerFrame
    );

    const icons = [2, 3, 2, 4];
    const icon = icons[this.walkingStep % icons.length];

    const rect = Rect.fromCenterSize(position, 80);
    pixmap.drawIcon(device, "80x80", icon, rect, 1, 0);
  }
}
