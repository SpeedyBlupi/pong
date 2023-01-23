import Rect from "./rect";
import Pixmap from "./pixmap";

export default class Misc {
  //------------------------------------------------------------------------

  static pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  static toDollar(n) {
    n = n + "";
    if (n.length > 3) {
      // Without space if 4 digits.
      return "\u0001" + n; // vis
    } else {
      // With space if 3 digits or less.
      return "\u0001 " + n; // vis
    }
  }

  static toRoman(n) {
    n = n + ""; // to string
    switch (n) {
      case "1":
        return "\u0002"; // I

      case "2":
        return "\u0003"; // II

      case "3":
        return "\u0004"; // III

      case "4":
        return "\u0005"; // IV

      default:
        return n;
    }
  }

  //------------------------------------------------------------------------

  // If x1 -> y1 and x2 -> y2, then x -> y.
  // Soit un segment P1(x1;y1) P2(x2;y2), calcule y=f(x)
  // linear(-1, 10, 1, 20, -1) -> 10
  // linear(-1, 10, 1, 20,  1) -> 20
  static linear(x1, y1, x2, y2, x) {
    const a = (y2 - y1) / (x2 - x1);
    const b = y1 - x1 * a;
    return a * x + b;
  }

  // in:  0..1
  // out: 0..1
  static smooth(x, n = 1) {
    for (let i = 0; i < n; i++) {
      const a = 1 * (Math.PI / 2);
      const b = 3 * (Math.PI / 2);
      const s = Math.sin(Misc.linear(0, a, 1, b, x));
      n = Misc.linear(1, 0, -1, 1, s);
    }
    return n;
  }

  // With fooplot.com
  // hardness = 0.5..3.0
  // With hardness = 1.8:
  // 1 - (sin((exp(x * 1.8 - 1.21) - 1.2) * pi*6) / exp(5 * (x - 1)) / pi*6) * 0.1
  static bounce1(x, hardness) {
    hardness = hardness || 1.8;
    const w = 6 * Math.PI;
    return (
      1 -
      (Math.sin((Math.exp(x * hardness - 1.21) - 1.2) * w) /
        Math.exp(5 * (x - 1)) /
        w) *
        0.1
    );
  }

  static bounce2(x) {
    const w = 4 * Math.PI;
    return (
      1 -
      (Math.sin((Math.exp(x - 0.14) - 1.2) * w) / Math.exp(5 * (x - 1)) / w) *
        0.1
    );
  }

  // Chute avec 5 rebonds.
  // abs(sin(1.9-exp(x)*8.2)*(1-x))*1.2
  static fall(x) {
    return Math.abs(Math.sin(1.9 - Math.exp(x) * 8.2) * (1 - x)) * 1.2;
  }

  static exp1(n) {
    //  Utilisé par exemple pour le déplacement d'un objet lancé vu d'en haut.
    //  in      0.00 -> 0.25 -> 0.50 -> 0.75 -> 1.00
    //  out     0.00 -> 0.12 -> 0.50 -> 0.87 -> 1.00
    if (n < 0.5) {
      return Math.pow(n * 2.0, 2.0) * 0.5;
    } else {
      return 0.5 + (0.5 - Math.pow(2.0 - n * 2.0, 2.0) * 0.5);
    }
  }

  static exp2(n) {
    //  Utilisé par exemple pour la taille d'un objet lancé vu d'en haut.
    //  in      0.00 -> 0.25 -> 0.50 -> 0.75 -> 1.00
    //  out     0.00 -> 0.25 -> 1.00 -> 0.25 -> 0.00
    if (n < 0.5) {
      return Math.pow(n * 2.0, 2.0);
    } else {
      return Math.pow(2.0 - n * 2.0, 2.0);
    }
  }

  //------------------------------------------------------------------------

  static approch(actual, final, step) {
    if (actual < final) {
      actual = Math.min(actual + step, final);
    } else if (actual > final) {
      actual = Math.max(actual - step, final);
    }

    return actual;
  }

  static speed(speed, max) {
    if (speed > 0) {
      return Math.max(int(speed * max), 1);
    } else if (speed < 0) {
      return Math.min(int(speed * max), -1);
    } else {
      return 0;
    }
  }

  //------------------------------------------------------------------------

  static clip(value) {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }

  // From a to b.
  //  a= 10 b= 30  ->  delta= 20 cw=true
  //  a= 30 b= 10  ->  delta=-20 cw=false
  //  a=350 b= 10  ->  delta= 20 cw=true
  //  a= 10 b=350  ->  delta=-20 cw=false
  static deltaAngle(a, b) {
    a = Misc.clipAngleDeg(a);
    b = Misc.clipAngleDeg(b);

    let delta = b - a;
    let cw = a <= b;

    if (Math.abs(delta) > 180) {
      delta = Misc.clipAngleDeg(60 - delta);
      cw = !cw;
    }

    return { delta, cw };
  }

  static clipAngleRad(angle) {
    // Retourne un angle normalisé, c'est-à-dire compris entre 0 et 2*PI.
    angle = angle % (Math.PI * 2.0);
    return angle < 0.0 ? Math.PI * 2.0 + angle : angle;
  }

  static clipAngleDeg(angle) {
    // Retourne un angle normalisé, c'est-à-dire compris entre 0 et 360°.
    angle = angle % 360.0;
    return angle < 0.0 ? 360.0 + angle : angle;
  }

  static degToRad(angle) {
    return (angle * Math.PI) / 180.0;
  }

  static radToDeg(angle) {
    return (angle * 180.0) / Math.PI;
  }

  //------------------------------------------------------------------------
}
