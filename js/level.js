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

    this.startPosition = new Vector2(160, 220);

    this.collisionMap = [];
    
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
      xhr.open('get', `data/levels/${leveName}.json`, true);
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

  positionToGrid(v) {
    return new Vector2(Math.floor(v.x / this.tileSize), Math.floor(v.y / this.tileSize));
  }
  
  gridToPosition(x, y) {
    return new Vector2(x * this.tileSize, y * this.tileSize);
  }

  getCollisionValue(x, y) {
    return this.collisionMap[x + (y * this.size.x)];
  }

  /**
   *
   * @param {object} data - Loaded json map data
   * @return {array} - Parsed map layers
   * @private
   */
  _parseLevel(data) {
    // console.log('Level:_parseLevel', data);
    this._levelData = data;

    this.tileSize = this._levelData.tilewidth;
    this.size = new Vector2(this._levelData.width, this._levelData.height);
    
    this._levelTileSet = new Image();
    this._levelTileSet.src = this._levelData.tilesets[0].image;

    const layers = data.layers.reduce((layers, layer) => {
      if (layer.properties) {
        if (layer.properties.collision) {
          this.collisionMap = layer.data.map((i) => (i > 0) ? 1 : 0);
        }
      }

      layers.push(layer);
      return layers;
    }, []);

    return new Promise((resolve, reject) => {
      this._levelTileSet.addEventListener('load', () => {
        resolve(layers);
      });
      this._levelTileSet.addEventListener('error', (err) => {
        reject(err);
      })
    });
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
    let tileset = this._levelData.tilesets[0];

    for (let i=0; i < layer.data.length; i++) {
      if (layer.data[i]<1) {
        continue;
      }

      let postion = new Vector2(0, 0);
      let tilemap = new Vector2(0, 0);

      postion.x = (i % this._levelData.width) * tileSize;
      postion.y = ~~(i / this._levelData.width) * tileSize;
      tilemap.x = ((layer.data[i]-1) % tileset.imagewidth) * tileSize;
      tilemap.y = ~~((layer.data[i]-1) / tileset.imagewidth) * tileSize;

      postion.x -= viewOffset.x;
      postion.y -= viewOffset.y;

      context.drawImage(
        this._levelTileSet, // Image
        tilemap.x, // dX
        tilemap.y, // dY
        tileSize, // dWidth
        tileSize, // dHeight
        postion.x, // sX
        postion.y, // sY
        tileSize, // sWidth
        tileSize // sHeight
      );

      context.lineWidth = '1px';
      context.strokeStyle = 'rgba(0,0,0,0.1)';
      context.strokeRect(postion.x, postion.y, tileSize, tileSize);

      // context.font = '12px Arial';
      // context.fillStyle = '#FFF';
      // context.fillText(i, postion.x + 5, postion.y + 15);

      // context.font = '8px Arial';
      // context.fillStyle = '#FFF';
      // context.fillText(Math.floor(i / this.size.x) * 64, postion.x + 5, postion.y + 25);
    }
  }

}
