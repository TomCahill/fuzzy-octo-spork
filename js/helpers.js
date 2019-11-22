'use strict';

const Constants = {
  METERS_PER_SECOND: 32 / 1000,
  METER: 32,
  KM: 1000
};

/** Class Vector2 */
class Vector2 { // eslint-disable-line no-unused-vars

  /**
   *
   * @param {float} x - Vector X
   * @param {float} y - Vector Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  equals(v) {
    return this.x === v.x && this.y === v.y;
  }

  /**
   *
   * @return {string} - Dumps out X Y as a combined string
   */
  toString() {
    return `${this.x}:${this.y}`;
  }

  clamp(min, max) {
    this.x = Math.min(Math.max(this.x, min), max);
    this.y = Math.min(Math.max(this.y, min), max);
    return self;
  }

}
