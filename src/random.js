export default class Random {
  constructor() {
    this._pseudoRandom = false;
  }

  seed(seed) {
    this._pseudoRandom = true;
    seed = Math.pow(seed, 7);
    this._seed = seed % 2147483647;
    if (this._seed <= 0) {
      this._seed += 2147483646;
    }
  }

  getRandomReal(min, max) {
    if (this._pseudoRandom) {
      return min + this._nextFloat() * (max - min);
    } else {
      return min + Math.random() * (max - min);
    }
  }

  getRandomInt(min, max) {
    if (this._pseudoRandom) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(this._nextFloat() * (max - min)) + min;
    } else {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }

  getRandomIntInclusive(min, max) {
    if (this._pseudoRandom) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(this._nextFloat() * (max - min + 1)) + min;
    } else {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  getRandomBool() {
    if (this._pseudoRandom) {
      return this._next() % 2 === 0;
    } else {
      return Math.random() < 0.5;
    }
  }

  // Returns a pseudo-random value between 1 and 2^32 - 2.
  _next() {
    return (this._seed = (this._seed * 16807) % 2147483647);
  }

  // Returns a pseudo-random floating point number in range [0, 1).
  _nextFloat() {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this._next() - 1) / 2147483646;
  }
}
