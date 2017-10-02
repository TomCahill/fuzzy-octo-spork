'use strict';

/** Class Map */
class Level { // eslint-disable-line no-unused-vars

  /**
   * Map constructor
   * @param {Input} input - Game Input Manager
   */
  constructor(input) {
    console.log('Map:constructor');

    this.input = input;

    this._canvasBuffer = null;
    this._canvasBufferContext = null;

    this._levelLoaded = false;

    this.startPosition = new Vector2(160, 160);
    
    this.layer = {
      size: new Vector2(1000, 100),
      position: new Vector2(0, 500)
    };

    this.size = new Vector2(0, 0);

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Map:_init');
    this.changeMap('home');
  }

  /**
   *
   * @param {string} mapName - Filename of map data
   * @return {Promise}
   */
  load(mapName) {
    console.log('Map:load', mapName);
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  /**
   *
   * @return {boolean}
   */
  loaded() {
    return this._levelLoaded;
  }

  changeMap(mapName) {
    this._levelLoaded = false;
    this.load(mapName)
      .then(() => {
        this._levelLoaded = true;
      })
      .catch((err) => console.error(err));
  }

  /**
   * Takes a tile grid XY and returns a world XY
   * @param {Vector2} gridPosition
   * @return {Vector2}
   */
  getWorldPosition(gridPosition) {
    return new Vector2(
      gridPosition.x * this.tileSize,
      gridPosition.y * this.tileSize
    );
  }

  /**
   *
   * @param  {Vector2} worldPosition
   * @return {Vector2}
   */
  getGridPosition(worldPosition) {
    return new Vector2(
      worldPosition.x / this.tileSize,
      worldPosition.y / this.tileSize
    );
  }

  /**
   *
   * @param {float} delta - Game Update delta time
   */
  update(delta) {
    // console.log('Map:update');
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   */
  render(context, viewOffset) {
    if (!this._levelLoaded) {
      return;
    }

    context.fillStyle = '#FF0000';
    context.fillRect(
      this.layer.position.x-viewOffset.x,
      this.layer.position.y-viewOffset.y,
      this.layer.size.x,
      this.layer.size.y
    );
  }
}
