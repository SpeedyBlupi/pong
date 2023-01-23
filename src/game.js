import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";
import BlupiWalks1 from "./blupi-walks1";
import BlupiWalks2 from "./blupi-walks2";

//------------------------------------------------------------------------

export default class Game {
  constructor() {
    this.audio = new AudioPlayer();
    this.mouseTouch = true; // hide mouse cursor by default
    this.blupi1 = new BlupiWalks1();
    this.blupi2 = new BlupiWalks2();
  }

  //------------------------------------------------------------------------

  setMouseTouch(touch) {
    this.mouseTouch = touch;
  }

  // Time are in seconds.
  update(device, elapsedTime) {
    this._step(device, elapsedTime, null);
    this._draw(device);
  }

  //------------------------------------------------------------------------

  _step(device, elapsedTime, input) {
    this.blupi1.step(device, elapsedTime, input);
    this.blupi2.step(device, elapsedTime, input);
  }

  _draw(device) {
    this.blupi1.draw(device);
    this.blupi2.draw(device);
  }
}
