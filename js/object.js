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

    this.gravity = 5;
    this.bounce = 0.3;
  }

  /**
   *
   */
  update(delta) {

    if(!this.level.loaded()) return;

    let v = this.velocity;
    v.y += this.gravity;

    this.velocity.x = v.x;
    this.velocity.y = v.y;
  }

  /**
   *
   */
  render(context, viewOffset) {

  }

}
