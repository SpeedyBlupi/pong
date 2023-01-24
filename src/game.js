import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";
import Pong1 from "./pong1";
import BlupiWalks1 from "./blupi-walks1";
import BlupiWalks2 from "./blupi-walks2";

//------------------------------------------------------------------------

export default class Game {
  constructor() {
    this.audio = new AudioPlayer();
    this.pixmap = new Pixmap();

    this.mouseTouch = true; // hide mouse cursor by default
    this.mouseDown = false;
    this.mouseUp = false;
    this.mousePos = new Point(0, 0);

    this.pong1 = new Pong1();
    this.blupi1 = new BlupiWalks1();
    this.blupi2 = new BlupiWalks2();
  }

  //------------------------------------------------------------------------

  setMouseTouch(touch) {
    this.mouseTouch = touch;
  }

  // Time are in seconds.
  update(device, elapsedTime) {
    const pos = this.mousePos;
    const isDown = this.mouseDown;
    const isTouch = this.mouseTouch;
    const input = { pos, isDown, isTouch };

    if (this.mouseUp) {
      // Clears these events when they have been processed.
      // This allows a very short down/up click are always done!
      this.mouseDown = false;
      this.mouseUp = false;
    }

    this._step(device, elapsedTime, input);
    this._draw(device);
  }

  //------------------------------------------------------------------------

  _step(device, elapsedTime, input) {
    this.pong1.step(device, elapsedTime, input);
    this.blupi1.step(device, elapsedTime, input);
    this.blupi2.step(device, elapsedTime, input);
  }

  _draw(device) {
    // Draw grey background.
    const area = Pixmap.fullScreen;
    this.pixmap.drawIcon(device, "80x80", 7, area, 1, 0);

    this.pong1.draw(device, this.pixmap);
    this.blupi1.draw(device, this.pixmap);
    this.blupi2.draw(device, this.pixmap);
  }
}
