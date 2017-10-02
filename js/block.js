'use strict';

/** Class Object */
class Block extends Object { // eslint-disable-line no-unused-vars

  /**
   * Object constructor
   */
  constructor() {
    console.log('Block:constructor');
    super();

    this.position = new Vector2(160, 160);
    this.size = new Vector2(32, 32);

    this.speed = new Vector2(2, 5);
  }

  /**
   *
   */
  update(delta) {
    super.update();
  }

  /**
   *
   */
  render(context, viewOffset) {
    context.fillStyle = '#FF0000';
    context.fillRect(
      this.position.x - viewOffset.x,
      this.position.y - viewOffset.y,
      this.size.x,
      this.size.y
    );
  }

}
