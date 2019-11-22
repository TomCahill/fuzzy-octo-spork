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
    this.size = new Vector2(20, 20);

    console.log(Constants.METERS_PER_SECOND * 1);

    this.speed = new Vector2(Constants.METERS_PER_SECOND * 0.25, 0);
    this.velocity = new Vector2(-1, 0);

    this.maxSpeed = new Vector2(Constants.METERS_PER_SECOND * 5, 20);

    this.grounded = false;

    this.jump = Constants.METERS_PER_SECOND * 15;
    this.drag = Constants.METERS_PER_SECOND * 0.01;
    this.gravity = Constants.METERS_PER_SECOND * 1;
  }

  /**
   *
   */
  update(delta) {
    // super.update(delta);

    const lastVolocity = new Vector2(this.velocity.x, this.velocity.y);
    
    let acceleration = new Vector2(0, 0);
    acceleration.y += this.gravity;

    if (this.input.LEFT) {
      acceleration.x -= (this.grounded) ? this.speed.x : this.speed.x * this.drag;
    } else if (this.velocity.x < 0) {
      if (this.velocity.x > this.drag) {
        acceleration.x -= this.velocity.x * this.drag;
      } else {
        acceleration.x = -this.velocity.x;
      }
    }
    if (this.input.RIGHT) {
      acceleration.x += (this.grounded) ? this.speed.x : this.speed.x * this.drag;
    } else if (this.velocity.x > 0) {
      if (this.velocity.x < this.drag) {
        acceleration.x -= this.velocity.x * this.drag;
      } else {
        acceleration.x = -this.velocity.x;
      }
    }
    // if (this.input.RIGHT) {
    //   acceleration.x += (this.grounded) ? this.speed.x : this.speed.x/2;
    // } else if (this.velocity.x > 0) {
    //   acceleration.x -= this.speed.x * this.drag;
    // }
    if (this.input.JUMP && this.grounded) {
      acceleration.y = -this.jump;
      this.grounded = false;
    }

    this.velocity.x += acceleration.x;
    this.velocity.y += acceleration.y;

    if (this.velocity.x > 0 && this.velocity.x > this.maxSpeed.x) {
      this.velocity.x = this.maxSpeed.x;
    } else if (this.velocity.x < 0 && this.velocity.x < -this.maxSpeed.x) {
      this.velocity.x = -this.maxSpeed.x;
    }

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    // if (this.velocity.y > 0 && this.velocity.y > this.maxSpeed.y) {
    //   this.velocity.y = this.maxSpeed.y;
    // } else if (this.velocity.y < 0 && this.velocity.y < -this.maxSpeed.y) {
    //   this.velocity.y = -this.maxSpeed.y;
    // }

    // Collision Detection & Affect
    let gridpos = this.level.positionToGrid(this.position);
    let collisionCurrent = this.level.getCollisionValue(gridpos.x, gridpos.y);
    let collisionHorz = this.level.getCollisionValue(gridpos.x + 1, gridpos.y);
    let collisionVert = this.level.getCollisionValue(gridpos.x, gridpos.y + 1);
    let collisionDiag = this.level.getCollisionValue(gridpos.x + 1, gridpos.y + 1);

    let tileOffset = new Vector2(this.position.x % this.level.tileSize, this.position.y % this.level.tileSize);
    
    if (this.velocity.y > 0) {
      if (
        (collisionVert && !collisionCurrent) ||
        (collisionDiag && !collisionHorz && tileOffset.x)
      ) {
        this.position.y = this.level.gridToPosition(gridpos.x, gridpos.y).y;
        this.velocity.y = 0;
        tileOffset.y = 0;
        this.grounded = true;
      }
    } else if (this.velocity.y < 0) {
      if (
        (collisionCurrent && !collisionVert) ||
        (collisionHorz && !collisionDiag && tileOffset.x)
      ){
        this.position.y = this.level.gridToPosition(gridpos.x, gridpos.y + 1).y;
        this.velocity.y = 0;
        tileOffset.y = 0;
        collisionCurrent = collisionVert;
        collisionHorz = collisionDiag;
      }
    }

    if (this.velocity.x > 0) {
      if (
        (collisionHorz && !collisionCurrent) ||
        (collisionDiag && !collisionVert && tileOffset.y)
      ) {
        this.position.x = this.level.gridToPosition(gridpos.x, gridpos.y).x;
        this.velocity.x = 0;
      }
    } else if (this.velocity.x < 0) {
      if (
        (collisionCurrent && !collisionHorz) ||
        (collisionVert && !collisionDiag && tileOffset.y)
      ) {
        this.position.x = this.level.gridToPosition(gridpos.x + 1, gridpos.y).x;
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
