'use strict';

/** Class ViewPort */
class ViewPort { // eslint-disable-line no-unused-vars

  /**
   * ViewPort constructor
   * @param {Vector2} canvasSize
   */
  constructor(canvasSize, input) {
    console.log('ViewPort:constructor');

    this.input = input;

    this.offset = new Vector2(0, 0);
    this.position = new Vector2(0, 0);

    this._viewPortThreshold = new Vector2(192, 128);
    this._canvasCenter = new Vector2(canvasSize.x / 2, canvasSize.y / 2);
    
    this._speed = new Vector2(5, 5);

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('ViewPort:_init');

    // Set viewport to 0,0
    this.position.x += this._canvasCenter.x;
    this.position.y += this._canvasCenter.y;

  }

  /**
   *
   * @param {float} delta - DeltaTime
   */
  update(delta, target) {

    this.offset.x = target.position.x - this._canvasCenter.x + target.size.x;
    this.offset.y = target.position.y - this._canvasCenter.y + target.size.y;
  }

}
