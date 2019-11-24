'use strict';

/** Class Game */
class Game { // eslint-disable-line no-unused-vars

  /**
   * Game constructor
   * @param {string} gameMainFrameId - Main game canvas element id
   */
  constructor(gameMainFrameId) {
    console.log('Game:constructor');

    this._gameMainFrameId = gameMainFrameId;

    this.socket = null;
    this.input = null;
    this.canvas = null;
    this.level = null;
    this.viewPort = null;

    this._mainLoop = false;
    this._lastFrame = 0;
    this._lastTick = 0;
    this._deltaTime = 0;
    this._tickRate = 1/60;

    this._lastFrameCheck = 0;
    this._frameRate = 0;
    this._fps = 0;

    this._assets = [
      {path: 'data/tilemaps/test.png', type: 'image'},
    ];
    this._preloadLoaded = false;
    this._preloadProgress = 0;

    this.player = null;

    this._entities = [];

    this._init();
    this._preloadAssets();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Game:_init');
    this.input = new Input();
    this.canvas = new Canvas(this._gameMainFrameId);

    this.viewPort = new ViewPort(this.canvas.size, this.input);

    this.input.initMobileListeners('mobile-controls');

    this.start();
  }

  _initGame() {
    this.level = new Level(this.input);

    this.player = new Player(this.input, this.level);

    this._entities.push(this.player);
  }

  _preloadAssets() {
    console.log('Game:_preload');
    if (this._assets.length < 1) {
      this._preloadLoaded = true;
      return this._initGame();
    }

    for(let i = 0; i < this._assets.length; i++) {
      let asset = this._assets[i];
      if (asset.type === 'image') {
        asset.element = new Image();
        asset.element.src = asset.path;
        asset.element.onload = () => {
          asset.loaded = true;
          this._preloadProgress++;
        };
      }

    }
  }

  start() {
    this._mainLoop = true;
    this._main();
  }

  stop() {
    this._mainLoop = false;
  }

  /**
   *
   * @private
   */
  _main() {
    // console.log('Game:_main');
    if (!this._mainLoop) {
      return;
    }

    window.requestAnimationFrame(this._main.bind(this));
    // setTimeout(this._main.bind(this), 1000);

    const now = new Date();

    if ((now - this._lastTick) > this._tickRate) {
      this._deltaTime = (now - this._lastTick);
      try {
        this._update(this._deltaTime);
      } catch(e) {
        console.error(e);
        this.stop();
      }
      this._lastTick = now;
    }

    if ((now - this._lastFrameCheck) > 1000) {
      this._fps = this._frameRate;
      this._frameRate = 0;
      this._lastFrameCheck = now;
    }

    try {
      this._render(this.canvas.context);
    } catch(e) {
      console.error(e);
      this.stop();
    }
    this._frameRate++;

    this._lastFrame = now;
  }

  /**
   *
   * @param {float} delta - Game Update delta time
   * @private
   */
  _update(delta) {
    // console.log('Game:_update');
    if (!this._preloadLoaded) {
      if (this._preloadProgress / this._assets.length === 1) {
        this._preloadLoaded = true;
        this._initGame();
      }
      return;
    }
    this.viewPort.update(delta, this.player);
    this.level.update(delta);

    for(let entityIdx in this._entities) {
      this._entities[entityIdx].update(delta, this.player);
    }

  }

  /**
   *
   * @param {object} context - Game canvas context
   * @private
   */
  _render(context) {
    // console.log('Game:_render');
    context.clearRect(0, 0, this.canvas.size.x, this.canvas.size.y);

    if (!this._preloadLoaded) {
      this._renderLoader(context);
      return;
    }

    this.level.render(context, this.viewPort.offset);

    for(let entityIdx in this._entities) {
      this._entities[entityIdx].render(context, this.viewPort.offset);
    }

    this._renderDebug(context);
  }

  _renderLoader(context) {
    context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    context.fillRect(
      0,
      0,
      this.canvas.size.x * (this._preloadProgress / this._assets.length),
      this.canvas.size.y
    );

    context.font = '20px Arial';
    context.fillStyle = '#FFF';
    context.fillText(`Loading: ${this._preloadProgress}/${this._assets.length}`, 20, 40);
  }

  _renderDebug(context) {
    // Debug shit
    context.font = '15px Arial';
    context.fillStyle = '#FFF';
    context.fillText(`CanvasSize:: ${this.canvas.size}`, 20, 30);
    context.fillText(`ViewPort: ${this.viewPort.offset}`, 20, 50);
    context.fillText(`FPS: ${this._fps}`, 20, 70);
    context.fillText(`Delta: ${this._deltaTime}`, 20, 90);

    context.fillText(`Position: ${this.player.position}`, 20, 120);
    context.fillText(`Velocity: ${this.player.velocity}`, 20, 140);
    context.fillText(`Collision: ${this.level.debugTileCollision}`, 20, 160);
    // context.fillText(`Projected: ${this.player.projected}`, 20, 140);
  }

}
