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

    let v = this.velocity;

    this.velocity.y += this.gravity;

    if (this.position.x > this.level.layer.position.x
      && this.position.x < this.level.layer.position.x + this.level.layer.size.x) {

      if (this.position.y >= this.level.layer.position.y - this.size.y) {
        this.position.y = this.level.layer.position.y - this.size.y;
  
        if (v.y > this.size.y) {
          v.y *= -this.bounce;
        } else {
          v.y = 0;
        }
      }
    }


    if (this.position.y > 2000) {
      this.position.x = this.level.startPosition.x;
      this.position.y = this.level.startPosition.y;
    }


    this.velocity.x = v.x;
    this.velocity.y = v.y;
  }

  /**
   *
   */
  render(context, viewOffset) {

  }

}
