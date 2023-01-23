import Pixmap from "./pixmap";
import Point from "./point";
import Rect from "./rect";

export default class Text {
  // Affiche un pavé de texte centré, typiquement pour une bulle.
  static drawTextRowsBalloon(device, pixmap, pos, rows) {
    const height = rows.reduce((accumulator, row) => {
      const h = row.size * 30;
      return accumulator + h;
    }, 0);

    let y = pos.y - height / 2;
    rows.map((row) => {
      Text.drawTextCenter(
        device,
        pixmap,
        { x: pos.x, y },
        row.text,
        row.size,
        1,
        row.style
      );
      y += row.size * 34;
    });
  }

  // Affiche un texte centré.
  static drawTextCenter(device, pixmap, pos, text, size, opacity, style) {
    if (!text) {
      return;
    }

    const start = {
      x: Text._floor(
        pos.x - Text._getTextWidth(text, size, style) / 2,
        size,
        style
      ),
      y: Text._floor(pos.y, size, style),
    };
    Text.drawText(device, pixmap, start, text, size, opacity, style);
  }

  // Affiche un texte en spécifiant toujours le coin sup/gauche.
  static drawText(device, pixmap, pos, text, size, opacity, style) {
    if (!text) {
      return;
    }

    pos = Point.fromPoint(pos);
    for (const c of text) {
      pos = Text._drawChar(device, pixmap, pos, c, size, opacity, style);
    }
  }

  //------------------------------------------------------------------------

  // Affiche un caractére.
  static _drawChar(device, pixmap, pos, car, size, opacity, style) {
    const rank = Text._getCharRank(car);
    Text._drawCharSingle(device, pixmap, pos, rank, size, opacity, style);

    pos.x += Text._getCharWidth(car, size, style);
    return pos;
  }

  // Retourne la longueur d'un texte.
  static _getTextWidth(text, size, style) {
    if (!text) {
      return 0;
    }

    var width = 0;
    for (const c of text) {
      width += Text._getCharWidth(c, size, style);
    }
    return width;
  }

  // Retourne la largeur d'un caractére.
  static _getCharWidth(c, size, style) {
    if (size === 0.45 && c === "1") {
      return 7;
    }
    const rank = Text._getCharRank(c);
    size /= 0.7; // size 0.7 -> 1 (0.7 = 22/32)
    var width = Text._floor(_table_width[rank] * size, size, style);
    if (style === "bold") {
      width += 2 * size;
    }
    return width;
  }

  static _getCharRank(c) {
    const code = c.charCodeAt(0);
    return _table_accents[code] || code;
  }

  static _drawCharSingle(device, pixmap, pos, rank, size, opacity, style) {
    if (size === 0.45 && (rank === 1 || (rank >= 48 && rank < 58))) {
      // Little number.
      if (rank === 1) {
        rank = 0;
      } else {
        rank -= 48 - 1;
      }
      const rect = new Rect(
        Text._floor(pos.x, size, style),
        Text._floor(pos.y, size, style),
        14,
        14
      );
      pixmap.drawIcon(device, "meca-ln", rank, rect, opacity, 0.0);
    } else {
      size = Text._floor((22 / 0.7) * size, size, style); // size 0.7 -> 22
      const rect = new Rect(
        Text._floor(pos.x, size, style),
        Text._floor(pos.y, size, style),
        size,
        size
      );
      const channel = style === "bold" ? "meca-bold" : "meca";
      pixmap.drawIcon(device, channel, rank, rect, opacity, 0.0);
    }
  }

  static _floor(value, size, style) {
    if (size === 0.45 || size === 0.7 || size === 1.4) {
      return Math.floor(value);
    } else {
      return value;
    }
  }
}

//------------------------------------------------------------------------

const _table_accents = {
  224: 16, // à
  226: 17, // â
  228: 27, // ä
  231: 29, // ç
  232: 19, // è
  233: 18, // é
  234: 21, // ê
  235: 20, // ë
  238: 23, // î
  239: 22, // ï
  244: 24, // ô
  246: 28, // ö
  249: 25, // ù
  251: 26, // û
  252: 15, // ü
};

// prettier-ignore
const _table_width =
    [
        22,22,10,15,20,20,22,22,22,22,22,22,22,22,22,10,
        10,10,10,10,10,10,5,7,10,10,10,10,10,11,0,0,
        6,3,6,12,11,11,12,3,5,5,9,9,5,9,3,10,
        12,9,12,12,12,12,12,12,12,12,3,5,9,9,9,10,
        22,12,11,11,11,10,10,12,12,3,8,10,9,15,12,12,
        11,12,11,12,11,12,13,19,13,13,12,5,9,5,7,22,
        22,10,10,10,10,10,8,10,10,3,6,10,3,15,9,10,
        10,10,6,10,7,10,11,19,10,10,10,6,3,6,22,22,
    ];

//------------------------------------------------------------------------
