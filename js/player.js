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

    this.speed = new Vector2(Constants.METERS_PER_SECOND * 0.25, Constants.METERS_PER_SECOND * 0.25);
    this.velocity = new Vector2(-1, 0);

    this.maxSpeed = new Vector2(Constants.METERS_PER_SECOND * 5, 20);

    this.grounded = false;

    this.debugCollision = [];

    this.jump = Constants.METERS_PER_SECOND * 15;
    this.drag = Constants.METERS_PER_SECOND * 0.01;
    this.gravity = Constants.METERS_PER_SECOND * 1;
  }

  /**
   *
   */
  update(delta) {
    // super.update(delta);

    this.level.debugTileCollision = [];

    const lastVolocity = new Vector2(this.velocity.x, this.velocity.y);
    
    let acceleration = new Vector2(0, 0);
    acceleration.y += this.gravity;

    if (this.input.LEFT) {
      acceleration.x -= this.speed.x;
    } else if (this.velocity.x < 0) {
      if (this.velocity.x > this.drag) {
        acceleration.x -= this.velocity.x * this.drag;
      } else {
        acceleration.x = -this.velocity.x;
      }
    }
    if (this.input.RIGHT) {
      acceleration.x += this.speed.x;
    } else if (this.velocity.x > 0) {
      if (this.velocity.x < this.drag) {
        acceleration.x -= this.velocity.x * this.drag;
      } else {
        acceleration.x = -this.velocity.x;
      }
    }

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

    const lastPosition = new Vector2(this.position.x, this.position.y);

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    // if (this.velocity.y > 0 && this.velocity.y > this.maxSpeed.y) {
    //   this.velocity.y = this.maxSpeed.y;
    // } else if (this.velocity.y < 0 && this.velocity.y < -this.maxSpeed.y) {
    //   this.velocity.y = -this.maxSpeed.y;
    // }

    const left   = this.position.x;
    const top    = this.position.y;
    const right  = this.position.x + this.size.x;
    const bottom = this.position.y + this.size.y;

    const tileSpanX = Math.ceil(this.size.x / this.level.tileSize);
    const tileSpanY = Math.ceil(this.size.y / this.level.tileSize);

    if (this.velocity.y > 0 || this.velocity.y < 0) {
      const testY = (this.velocity.y > 0) ? Math.floor(bottom / this.level.tileSize) : Math.floor(top / this.level.tileSize);

      for(let i = 0; i < tileSpanX; i++) {
        const x = Math.floor((left + i * this.level.tileSize) / this.level.tileSize);

        if (this.level.getCollisionValue(x, testY)) {
          this.level.debugTileCollision.push(x + (testY * this.level.size.x));
          this.position.y = lastPosition.y;
          if (this.velocity.y > 0) {
            this.velocity.y = 0;
            this.grounded = true;
          }
        }
      }
    }
    if (this.velocity.x > 0 || this.velocity.x < 0) {
      const testX = (this.velocity.x > 0) ? Math.floor(right / this.level.tileSize) : Math.floor(left / this.level.tileSize);

      for(let i = 0; i < tileSpanY; i++) {
        const y = Math.floor((top + i * this.level.tileSize) / this.level.tileSize);

        if (this.level.getCollisionValue(testX, y)) {
          this.level.debugTileCollision.push(testX + (y * this.level.size.x));
          this.position.x = lastPosition.x;
          this.velocity.x = 0;
        }
      }
    }

    // Collision Detection & Affect
    // let gridpos = this.level.positionToGrid(this.position);
    // let collisionCurrent = this.level.getCollisionValue(gridpos.x, gridpos.y);
    // let collisionHorz = this.level.getCollisionValue(gridpos.x + 1, gridpos.y);
    // let collisionVert = this.level.getCollisionValue(gridpos.x, gridpos.y + 1);
    // let collisionDiag = this.level.getCollisionValue(gridpos.x + 1, gridpos.y + 1);

    // let tileOffset = new Vector2(this.position.x % this.level.tileSize, this.position.y % this.level.tileSize);
    
    // if (this.velocity.y > 0) {
    //   if (
    //     (collisionVert && !collisionCurrent) ||
    //     (collisionDiag && !collisionHorz && tileOffset.x)
    //   ) {
    //     this.position.y = this.level.gridToPosition(gridpos.x, gridpos.y).y;
    //     this.velocity.y = 0;
    //     tileOffset.y = 0;
    //     this.grounded = true;
    //   }
    // } else if (this.velocity.y < 0) {
    //   if (
    //     (collisionCurrent && !collisionVert) ||
    //     (collisionHorz && !collisionDiag && tileOffset.x)
    //   ){
    //     this.position.y = this.level.gridToPosition(gridpos.x, gridpos.y + 1).y;
    //     this.velocity.y = 0;
    //     tileOffset.y = 0;
    //     collisionCurrent = collisionVert;
    //     collisionHorz = collisionDiag;
    //   }
    // }

    // if (this.velocity.x > 0) {
    //   if (
    //     (collisionHorz && !collisionCurrent) ||
    //     (collisionDiag && !collisionVert && tileOffset.y)
    //   ) {
    //     this.position.x = this.level.gridToPosition(gridpos.x, gridpos.y).x;
    //     this.velocity.x = 0;
    //   }
    // } else if (this.velocity.x < 0) {
    //   if (
    //     (collisionCurrent && !collisionHorz) ||
    //     (collisionVert && !collisionDiag && tileOffset.y)
    //   ) {
    //     this.position.x = this.level.gridToPosition(gridpos.x + 1, gridpos.y).x;
    //     this.velocity.x = 0;
    //   }
    // }

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
