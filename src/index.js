import Game from "./game";
import Pixmap from "./pixmap";
import AudioPlayer from "./audio-player";
import Point from "./point";
import Misc from "./misc";

//------------------------------------------------------------------------

const canvas = document.createElement("canvas");
canvas.id = "mainCanvas";
document.body.appendChild(canvas);

const style = document.createElement("style");
document.head.appendChild(style);
const css = `
body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
}`;
style.appendChild(document.createTextNode(css));

const ctx = canvas.getContext("2d");
const game = new Game();
var hasFocus = true;

function initialise() {
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("mousedown", mouseDownHandler, false);
  document.addEventListener("mouseup", mouseUpHandler, false);

  document.addEventListener("touchmove", touchMoveHandler, false);
  document.addEventListener("touchstart", touchStartHandler, false);
  document.addEventListener("touchend", touchEndHandler, false);

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
}

function mouseMoveHandler(e) {
  // console.log("mouseMoveHandler");
  e.preventDefault();
  game.setMouseTouch(false);
  game.mousePos = revertTransform(new Point(e.clientX, e.clientY));
}

function mouseDownHandler(e) {
  // console.log("mouseDownHandler");
  e.preventDefault();
  game.setMouseTouch(false);
  game.mousePos = revertTransform(new Point(e.clientX, e.clientY));
  game.mouseDown = true; // Set the event "down". It will be cleared after its treatment (by game).
}

function mouseUpHandler(e) {
  // console.log("mouseUpHandler");
  e.preventDefault();
  game.setMouseTouch(false);
  game.mousePos = revertTransform(new Point(e.clientX, e.clientY));
  game.mouseUp = true; // Set the event "up". It will be cleared after its treatment (by game).
}

function touchMoveHandler(e) {
  // console.log("touchMoveHandler");
  if (e.changedTouches.length === 0) {
    console.log("touchMoveHandler!!!");
    return;
  }
  const x = e.changedTouches[0].clientX;
  const y = e.changedTouches[0].clientY;
  game.setMouseTouch(true);
  game.mousePos = revertTransform(new Point(x, y));
}

function touchStartHandler(e) {
  // console.log("touchStartHandler");
  if (e.changedTouches.length === 0) {
    console.log("touchStartHandler!!!");
    return;
  }
  const x = e.changedTouches[0].clientX;
  const y = e.changedTouches[0].clientY;
  game.setMouseTouch(true);
  game.mousePos = revertTransform(new Point(x, y));
  game.mouseDown = true; // Set the event "down". It will be cleared after its treatment (by game).
}

function touchEndHandler(e) {
  // console.log("touchEndHandler");
  e.preventDefault();
  if (e.changedTouches.length === 0) {
    console.log("touchEndHandler!!!");
    return;
  }
  const x = e.changedTouches[0].clientX;
  const y = e.changedTouches[0].clientY;
  game.setMouseTouch(true);
  game.mousePos = revertTransform(new Point(x, y));
  game.mouseUp = true; // Set the event "up". It will be cleared after its treatment (by game).
}

function keyDownHandler(e) {
  game.keysDown.set(e.code);
}

function keyUpHandler(e) {
  game.keysDown.delete(e.code);
}

//------------------------------------------------------------------------

function revertTransform(p) {
  const t = getTransformation();

  const x = (p.x - t.offsetX) / t.scale;
  const y = (p.y - t.offsetY) / t.scale;

  return new Point(x, y);
}

function getTransformation() {
  // Get transformation for center the game, without distortion.
  const scaleX = window.innerWidth / 800;
  const scaleY = window.innerHeight / 480;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (window.innerWidth - 800 * scale) / 2;
  const offsetY = (window.innerHeight - 480 * scale) / 2;

  return { scale, offsetX, offsetY };
}

function update(elapsedTime, imagesLoaded, soundsToLoad) {
  // Canvas use full size of viewport.
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  // Center the ctx (context), without distortion.
  const t = getTransformation();
  ctx.save(); // save before change
  ctx.translate(t.offsetX, t.offsetY);
  ctx.scale(t.scale, t.scale);

  // Make clipping.
  ctx.save(); // save before clipping
  ctx.beginPath();
  ctx.rect(0, 0, 800, 480);
  ctx.clip();

  const device = {
    ctx: ctx,
    images: imagesLoaded,
    sounds: soundsToLoad,
    hasFocus: hasFocus,
  };
  game.update(device, elapsedTime);

  ctx.restore(); // restore without clipping
}

// https://codeincomplete.com/posts/javascript-game-foundations-the-game-loop/
//
// (*) One additional note is that requestAnimationFrame might pause if our
//     browser loses focus, resulting in a very, very large dt after it resumes.
//     We can workaround this by limiting the delta to one second.

function timestamp() {
  return window.performance && window.performance.now
    ? window.performance.now()
    : new Date().getTime();
}

function gameLoop(imagesLoaded, soundsToLoad) {
  var last = timestamp();

  function frame() {
    const now = timestamp();
    const elapsedTime = Math.min(1, (now - last) / 1000); //(*)
    last = now;
    update(elapsedTime, imagesLoaded, soundsToLoad);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

//------------------------------------------------------------------------

function loadSounds(imagesLoaded, soundsToLoad, callback) {
  const result = {};
  for (const soundToLoad of soundsToLoad) {
    const soundName = soundToLoad.soundName;
    const filename = soundToLoad.filename;
    result[soundName] = new Audio(filename);
  }
  callback(imagesLoaded, result, soundsToLoad.length);
}

function loadSoundsEnded(imagesLoaded, soundsLoaded, n) {
  console.log(`${n} sounds loaded`);
  initialise();
  gameLoop(imagesLoaded, soundsLoaded);
}

//------------------------------------------------------------------------

// https://codeincomplete.com/posts/javascript-game-foundations-loading-assets/

function loadImages(imagesToLoad, callback) {
  const result = {};
  var count = imagesToLoad.length;
  function onload() {
    if (--count === 0) {
      callback(result, imagesToLoad.length);
    }
  }

  for (const imageToLoad of imagesToLoad) {
    const channel = imageToLoad.channel;
    const filename = imageToLoad.filename;
    result[channel] = document.createElement("img");
    result[channel].addEventListener("load", onload);
    result[channel].src = filename;
  }
}

function loadImagesEnded(imagesLoaded, n) {
  console.log(`${n} images loaded`);
  loadSounds(imagesLoaded, AudioPlayer.soundsToLoad, loadSoundsEnded);
}

// Bootstrap the game:
// 1) Load all the images
// 2) Load all the sounds
// 3) Run the game
loadImages(Pixmap.imagesToLoad, loadImagesEnded);

//------------------------------------------------------------------------
