'use strict';

/** Class Object */
class Object { // eslint-disable-line no-unused-vars

  /**
   * Object constructor
   */
  constructor() {
    console.log('Object:constructor');

    this.level = null;

    this.position = new Vector2(0, 0);
    this.size = new Vector2(0, 0);

    this.speed = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
  }

  /**
   *
   */
  update(delta) {

    if(!this.level.loaded()) return;

  }

  /**
   *
   */
  render(context, viewOffset) {

  }

}
