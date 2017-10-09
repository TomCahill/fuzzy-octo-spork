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

    this.speed = new Vector2(this.size.x, 5);
    this.velocity = new Vector2(0, 0);

    this.projected = new Vector2(0, 0);

    this.drag = 0.4;
  }

  /**
   *
   */
  update(delta) {
    super.update(delta);
    
    let v = this.velocity;

    if(v.x > 0) {
      if (v.x > this.size.x) {
        v.x += -v.x * this.drag;
      } else {
        v.x = 0;
      }
    }
    if(v.x < 0) {
      if(v.x < -this.size.x) {
        v.x -= v.x * this.drag;
      } else {
        v.x = 0;
      }
    }
    
    const idxPos = (x, y) => {
      return (Math.floor(y / 32) * 60) + Math.floor(x / 32);
    };

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

    // Check prodicted path
    
    this.projected.x = this.position.x + (v.x * delta);
    this.projected.y = this.position.y + (v.y * delta);

    if (this.projected.y > 545) {
      this.velocity.y = 0;
    }

    // this.position.x += v.x * delta; 
    // this.position.y += v.y * delta;
  }

  /**
   *
   */
  render(context, viewOffset) {

    this.__renderDebug(context, viewOffset);

    context.fillStyle = '#FFFF00';
    context.fillRect(
      this.position.x - viewOffset.x,
      this.position.y - viewOffset.y,
      this.size.x,
      this.size.y
    );
  }

  __renderDebug(context, viewOffset) {
    let posX = this.projected.x;
    let posY = this.projected.y;
    let vX =  this.size.x;
    let vY =  this.size.y;

    context.fillStyle = '#FF0000';
    context.fillRect(
      posX - viewOffset.x,
      posY - viewOffset.y,
      vX,
      vY
    );
  }

}
