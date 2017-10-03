'use strict';

/** Class Map */
class Level { // eslint-disable-line no-unused-vars

  /**
   * Map constructor
   * @param {Input} input - Game Input Manager
   */
  constructor(input) {
    console.log('Level:constructor');

    this.input = input;

    this._canvasBuffer = null;
    this._canvasBufferContext = null;

    this._levelName = null;
    this._levelData = null;
    this._levelLayers = null;
    this._levelTileSet = null;
    this._levelLoaded = false;
    this._postRenderLayer = null;

    this.startPosition = new Vector2(160, 160);
    
    this.layer = {
      size: new Vector2(1000, 100),
      position: new Vector2(0, 500)
    };

    this.tileSize = 32;
    this.size = new Vector2(0, 0);

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Level:_init');
    this.changeMap('test');
  }

  /**
   *
   * @param {string} leveName - Filename of level data
   * @return {Promise}
   */
  load(leveName) {
    console.log('Level:load', leveName);
    this._levelName = leveName;
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', `/data/levels/${leveName}.json`, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            throw new Error(xhr);
          }
        }
      };
      xhr.send();
    });
  }

  /**
   *
   * @return {boolean}
   */
  loaded() {
    return this._levelLoaded;
  }

  changeMap(levelName) {
    this._levelLoaded = false;
    return this.load(levelName)
      .then(data => this._parseLevel(data))
      .then(layers => this._saveCanvas(layers))
      .then(() => {
        this._levelLoaded = true;
        console.log('Level:changeMap', '_levelLoaded', this._levelLoaded);
      })
      .catch((err) => console.error(err));
  }

  /**
   *
   * @param {object} data - Loaded json map data
   * @return {array} - Parsed map layers
   * @private
   */
  _parseLevel(data) {
    console.log('Level:_parseLevel', data);
    this._levelData = data;
    this._levelTileSet = new Image();
    this._levelTileSet.src = this._levelData.tilesets[0].image;

    this.tileSize = this._levelData.tilewidth;
    this.size = new Vector2(this._levelData.width, this._levelData.height);

    // Parse out object layers
    return data.layers.reduce((layers, layer) => {
      layers.push(layer);
      return layers;
    }, []);
  }

  /**
   * Create a canvas to pre-render the map
   * @param {data} renderLayers - data to be rendered
   * @private
   */
  _saveCanvas(renderLayers) {
    this._canvasBuffer = document.createElement('canvas');
    this._canvasBuffer.width = this.size.x * this.tileSize;
    this._canvasBuffer.height = this.size.y * this.tileSize;

    let context = this._canvasBuffer.getContext('2d');

    const offset = new Vector2(0, 0);

    for (let i = 0; i < renderLayers.length; i++) {
      this._renderLayer(renderLayers[i], context, offset);
    }
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

    context.drawImage(this._canvasBuffer, -viewOffset.x, -viewOffset.y);
  }

  /**
   *
   * @param {object} layer - Map Layer data
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - View offset vector
   * @private
   */
  _renderLayer(layer, context, viewOffset) {
    let tileSize = this._levelData.tilewidth;
    let tile = this._levelData.tilesets[0];

    console.log(layer.name);

    for (let i=0; i < layer.data.length; i++) {
      if (layer.data[i]<1) {
        continue;
      }

      let img = new Vector2(0, 0);
      let src = new Vector2(0, 0);

      img.x = (i % ((this._levelData.width*tileSize) / tileSize)) * tileSize;
      img.y = ~~(i / ((this._levelData.width*tileSize) / tileSize)) * tileSize;
      src.x = ((layer.data[i]-1) % (tile.imagewidth/tileSize)) * tileSize;
      src.y = ~~((layer.data[i]-1) / (tile.imagewidth/tileSize)) * tileSize;

      img.x -= viewOffset.x;
      img.y -= viewOffset.y;

      context.fillStyle = '#FF0000';
      context.fillRect(
        src.x,
        src.y,
        tileSize,
        tileSize
      );

      debugger;
      // context.drawImage(
      //   this._levelTileSet, // Image
      //   src.x, // dX
      //   src.y, // dY
      //   tileSize, // dWidth
      //   tileSize, // dHeight
      //   img.x, // sX
      //   img.y, // sY
      //   tileSize, // sWidth
      //   tileSize // sHeight
      // );
    }
  }

}
