import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Rect from "./rect";
import Misc from "./misc";
import Random from "./random";

import Ball from "./ball1";
import Racket from "./racket1";

//------------------------------------------------------------------------

export default class PingPong1 {
  constructor() {
    this.position = new Point(100, 100);
    this.direction = 30; // 30 deg
    this.radius = 20;

    this.ball = new Ball();
    this.racket = new Racket();

    this.ball.initialise();
    this.racket.initialise();
  }

  step(device, elapsedTime, input) {
    this.racket.step(device, elapsedTime, input);

    this.ball.setRacketRect(this.racket.rect);

    this.ball.step(device, elapsedTime, input);
  }

  draw(device, pixmap) {
    this.ball.draw(device, pixmap);
    this.racket.draw(device, pixmap);
  }
}
