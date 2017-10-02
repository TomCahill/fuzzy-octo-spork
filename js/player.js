'use strict';

/** Class Object */
class Player extends Block { // eslint-disable-line no-unused-vars

  /**
   * Object constructor
   */
  constructor(input, level) {
    console.log('Player:constructor');
    super();

    this.input = input;
    this.level = level;

    this.position = new Vector2(level.startPosition.x, level.startPosition.y);

    this.speed = new Vector2(100, 5);
    this.velocity = new Vector2(0, 0);

    this.drag = 0.4;
  }

  /**
   *
   */
  update(delta) {
    super.update();
    
    let v = this.velocity;

    if(v.x > 0) {
      v.x += -v.x * this.drag;
    }
    if(v.x < 0) {
      v.x -= v.x * this.drag;
    }
    
    if (this.input.UP) {
      // v.y -= this.speed.y;
      if (v.y === 0) {
        v.y = -this.speed.y * 50;
      }
    }
    if (this.input.DOWN) {
      // v.y += this.speed.y;
    }
    if (this.input.LEFT) {
      v.x -= this.speed.x;
    }
    if (this.input.RIGHT) {
      v.x += this.speed.x;
    }

    this.position.x += v.x * delta; 
    this.position.y += v.y * delta;
  }

  /**
   *
   */
  render(context, viewOffset) {
    context.fillStyle = '#FFFF00';
    context.fillRect(
      this.position.x - viewOffset.x,
      this.position.y - viewOffset.y,
      this.size.x,
      this.size.y
    );
  }

}
