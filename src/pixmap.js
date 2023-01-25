import path from "path";
import Rect from "./rect.js";
import Misc from "./misc";
import cache from "./cache";

//------------------------------------------------------------------------

export default class Pixmap {
  constructor() {
    this._viewPort = {
      rect: null, // full screen
      opacity: 1.0,
    };

    this._crop = null;
  }

  static get fullScreen() {
    return new Rect(0, 0, 800, 480);
  }

  //------------------------------------------------------------------------

  drawIcon(device, channel, icon, dstRect, opacity, rotation) {
    if (!channel || !dstRect || typeof icon === "undefined" || icon === -1) {
      return;
    }

    if (this._viewPort.rect) {
      // If not full screen, make transform to viewPort.rect.
      dstRect = Rect.mapRect(Pixmap.fullScreen, this._viewPort.rect, dstRect);
    }

    const size = Pixmap._getChannelSize(channel);
    if (size.width === 0 || size.height === 0) {
      return;
    }
    const scaleX = dstRect.width / size.width;
    const scaleY = dstRect.height / size.height;

    const center = dstRect.center;

    opacity = typeof opacity === "undefined" ? 1 : opacity;
    opacity *= this._viewPort.opacity;
    opacity = Misc.clip(opacity);
    if (opacity === 0) {
      return;
    }

    device.ctx.save();
    device.ctx.globalAlpha = opacity;

    if (Pixmap._getTotal(channel)) {
      const name = Pixmap._getName(channel, icon);

      if (device.images[name]) {
        device.ctx.translate(center.x, center.y);
        device.ctx.rotate(Misc.degToRad(rotation || 0));
        device.ctx.scale(scaleX, scaleY);
        device.ctx.translate(-size.width / 2, -size.height / 2);
        device.ctx.drawImage(device.images[name], 0, 0);
      } else {
        console.log(
          `pixmap.drawIcon, image not found, channel=${channel} icon=${icon} name=${name}`
        );
      }
    } else if (device.images[channel]) {
      let sx = 0;
      let sy = 0;
      if (size.imageWidth) {
        const gap = size.gap || 0;
        const w = size.width + gap;
        const h = size.height + gap;
        const nx = Math.trunc(size.imageWidth / w);
        sx = (icon % nx) * w;
        sy = Math.trunc(icon / nx) * h;
      }

      if (this._crop) {
        device.ctx.beginPath();
        device.ctx.rect(
          this._crop.left,
          this._crop.top,
          this._crop.width,
          this._crop.height
        );
        device.ctx.clip();
      }

      device.ctx.translate(center.x, center.y);
      device.ctx.rotate(Misc.degToRad(rotation || 0));
      device.ctx.scale(scaleX, scaleY);
      device.ctx.translate(-size.width / 2, -size.height / 2);
      device.ctx.drawImage(
        device.images[channel],
        sx,
        sy,
        size.width,
        size.height,
        0,
        0,
        dstRect.width / scaleX,
        dstRect.height / scaleY
      );
    }

    device.ctx.restore();
  }

  //------------------------------------------------------------------------

  // Return the complete list of images to load asynchronously at bootstrap.
  static get imagesToLoad() {
    const imagesToLoad = [];

    const folderSprites = ["80x80"];
    for (const channel of folderSprites) {
      const total = Pixmap._getTotal(channel);
      for (let i = 0; i < total; i++) {
        const file = Pixmap._getFile(channel, i);
        const name = Pixmap._getName(channel, i);
        imagesToLoad.push({ channel: name, filename: file });
      }
    }

    return imagesToLoad;
  }

  // Return by example "80x80.i002".
  static _getName(channel, icon) {
    return `${channel}.i${Misc.pad(icon, 3)}`;
  }

  // Return by example "static/icons/80x80/i002.png".
  static _getFile(channel, icon) {
    return cache[`./icons/${channel}/i${Misc.pad(icon, 3)}.png`];
  }

  static _getTotal(channel) {
    switch (channel) {
      case "80x80":
        return 9;
      default:
        return null;
    }
  }

  static _getChannelSize(channel) {
    switch (channel) {
      case "80x80":
        return {
          width: 80,
          height: 80,
          folder: true,
        };
        break;

      default:
        return {
          width: 800,
          height: 480,
        };
        break;
    }
  }
}
