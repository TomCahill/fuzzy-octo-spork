'use strict';

/** Class Object */
class Player { // eslint-disable-line no-unused-vars

  /**
   * Object constructor
   */
  constructor(input, level) {
    console.log('Player:constructor');

    this.input = input;
    this.level = level;

    this.position = new Vector2(level.startPosition.x, level.startPosition.y);
    this.size = new Vector2(32, 32);

    this.speed = new Vector2(5, 10);
    this.velocity = new Vector2(0, 0);

    this.maxSpeed = new Vector2(20, 60);

    this.grounded = false;

    this.jump = 300;
    this.drag = 0.4;
    this.gravity = 5;
    this.bounce = 0.3;
  }

  /**
   *
   */
  update(delta) {
    // super.update(delta);
    
    let acceleration = new Vector2(0, 0);
    acceleration.y += this.gravity;

    if (this.input.LEFT) {
      acceleration.x -= this.speed.x;
    } else if (this.velocity.x < 0) {
      acceleration.x += this.speed.x * this.drag;
    }
    if (this.input.RIGHT) {
      acceleration.x += this.speed.x;
    } else if (this.velocity.x > 0) {
      acceleration.x -= this.speed.x * this.drag;
    }
    if (this.input.UP && this.grounded) {
      acceleration.y = -this.jump;
      this.grounded = false;
    }

    let deltaA = new Vector2(delta * acceleration.x, delta * acceleration.y);
    
    if (deltaA.x > 0 && deltaA.x > this.maxSpeed.x) {
      deltaA.x = this.maxSpeed.x;
    } else if (deltaA.x < 0 && deltaA.x < -this.maxSpeed.x) {
      deltaA.x = -this.maxSpeed.x;
    }

    if (deltaA.y > 0 && deltaA.y > this.maxSpeed.y) {
      deltaA.y = this.maxSpeed.y;
    } else if (deltaA.y < 0 && deltaA.y < -this.maxSpeed.y) {
      deltaA.y = -this.maxSpeed.y;
    }

    this.position.x += this.velocity.x;
    this.velocity.x += delta * acceleration.x;
    this.position.y += this.velocity.y;
    this.velocity.y += delta * acceleration.y;

    let gridpos = this.level.positionToGrid(this.position);
    let collisionCurrent = this.level.getCollisionValue(gridpos.x, gridpos.y);
    let collisionRight = this.level.getCollisionValue(gridpos.x + 1, gridpos.y);
    let collisionDown = this.level.getCollisionValue(gridpos.x, gridpos.y + 1);
    
    if (this.velocity.y > 0) {
      if (collisionDown && !collisionCurrent) {
        this.velocity.y = 0;
        this.grounded = true;
      }
    } else if (this.velocity.y < 0) {
      if (collisionCurrent && !collisionDown) {
        this.velocity.y = 0;
      }
    }

    if (this.velocity.x > 0) {
      if (collisionRight && !collisionCurrent) {
        this.velocity.x = 0;
      }
    } else if (this.velocity.x < 0) {
      if (collisionCurrent && !collisionRight) {
        this.velocity.x = 0;
      }
    }

  }

  /**
   *
   */
  render(context, viewOffset) {

    // this.__renderDebug(context, viewOffset);

    context.fillStyle = '#FFFF00';
    context.fillRect(
      this.position.x - viewOffset.x,
      this.position.y - viewOffset.y,
      this.size.x,
      this.size.y
    );
  }

  __renderDebug(context, viewOffset) {

  }

}
