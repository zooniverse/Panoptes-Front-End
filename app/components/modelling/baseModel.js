import reglBase from 'regl';

class baseModel {
  constructor(canvas, metadata) {
    // bind methods to correct `this`
    this.update = this.update.bind(this); // function to call on new annotation
    // set the texture of the image we are modelling
    this.setBaseTexture = this.setBaseTexture.bind(this);
    this.parse = this.parse.bind(this); // requires overwrite
    this.getScore = this.getScore.bind(this); // (optional)

    // save info on the zooniverse subject
    this.baseTexture = null;
    this.imageMetadata = Object.assign({}, metadata);
    this.size = [canvas.height, canvas.width];
    this.differenceData = new Uint8Array(this.size[0] * this.size[1] * 4);

    // instantiate the regl instance with the provided canvas
    this.regl = reglBase({
      canvas,
      attributes: { preserveDrawingBuffer: true }
    });
    // create a texture which is used for post-processing and difference calculation
    this.pixels = this.regl.texture();
    const postProcessingArray = this.getPostProcessingFunc(this.regl);
    // const postProcessingArray = postProcessingArray2.slice(0, postProcessingArray2.length - 1);

    this.postProcessingFunc = () => {
      if (this.baseTexture !== null) {
        if (typeof this.imageMetadata.psf === 'undefined') {
          /* eslint-disable prefer-spread */
          const psf = Array.apply(null, Array(121)).map(Number.prototype.valueOf, 0);
          /* eslint-enable prefer-spread */
          psf[60] = 1;
          this.imageMetadata.psf = psf;
        }
        postProcessingArray.map((i) => {
          this.pixels({
            copy: true
          });
          i({
            texture: this.pixels,
            metadata: this.imageMetadata,
            imageTexture: this.baseTexture
          });
        });
      }
    };

    // call the getModel function, this will be extended for each model and returns
    // a list of component objects TODO: model schema?
    this.model = this.getModel();

    // bind the model functions to the regl
    this.model = this.model.map(
      c => Object.assign(c, { func: c.func(this.regl) })
    );
    this.toRender = [];
  }
  update(annotation) {
    // this function parses the new annotation and then triggers a render.
    // update the render funtions
    this.toRender = this.parse(annotation);
    this.regl.poll();
    this.regl.clear({
      color: [0, 0, 0, 1]
    });
    this.pixels({
      copy: true
    });
    for (let i = 0; i < this.toRender.length; i += 1) {
      this.toRender[i][0](Object.assign({ texture: this.pixels }, this.toRender[i][1]));
      this.pixels({
        copy: true
      });
    }
    this.pixels({
      copy: true
    });
    this.postProcessingFunc();
  }
  kill() {
    this.regl.destroy();
  }
  setBaseTexture(image) {
    try {
      this.baseTexture = this.regl.texture(image);
    } catch (err) {
      if (err.name === 'SecurityError') {
        // TODO: shouldn't really be using alert here. Does Zooniverse have a modal?
        alert('CORS error encountered, please make sure you are using Google Chrome and try refreshing the page');
      }
    }
  }
  getTexture() {
    return { data: this.regl.read(), width: this.size[0], height: this.size[1] };
  }
  // -------------- Functions to be overwritten by child classes --------------
  /* eslint-disable class-methods-use-this */
  getModel() {
    // function to be overwritten for defining model
    /* eslint-disable no-console */
    console.warn('Was not provided with a model. Cannot render');
    /* eslint-enable no-console */
    return [];
  }
  parse() {
    /* function to be overwritten when class is extended. Details how to parse a
    zooniverse annotation and create list of (renderfunc, kwargs obj) pairs
    which are returned and saved by update() to this.toRender
    */
    /* eslint-disable no-console */
    console.warn('Was not provided with a parse function. Will not render');
    /* eslint-enable no-console */
    return [];
  }
  getPostProcessingFunc() {
    // function to be overwritten with post processing (this includes difference calculation)
    return null;
  }
  /* eslint-enable class-methods-use-this */
  getScore() {
    // images have been treated by normalisation to [0, 1] then arcsinh stretch
    // with a = 0.1. Need to calc difference in normal space
    // TODO: more model-independent
    this.regl.read(this.differenceData); // get the difference array
    const l = this.size[0] * this.size[1] * 4;
    let AIC = 0;
    for (let i = 0; i < l; i += 4) {
      // normalise to [0, 1]
      const r = this.differenceData[i] / 255;
      const b = this.differenceData[i + 2] / 255;
      AIC += ((r - b) * (r - b)) / this.size[0] / this.size[1];
    }
    // arbitrary 0 -> 100% scaling
    return 100 * Math.exp(-AIC * 500);
  }
}
export default baseModel;
