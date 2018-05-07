import reglBase from 'regl';

class BaseReglModel {
  constructor(canvas, { frame, metadata, src, sizing }, eventHandlers, errMessage) {
    this.eventHandlers = eventHandlers;
    this.modelErrorMessage = errMessage;
    this.update = this.update.bind(this); // function to call on new annotation
    this.getModel = this.getModel.bind(this);
    this.calculateModel = this.calculateModel.bind(this);
    if (this.getScore) {
      this.getScore = this.getScore.bind(this); // (optional)
    }

    this.canvas = canvas;
    this.regl = reglBase({
      canvas,
      attributes: { preserveDrawingBuffer: true },
      extensions: ['OES_texture_float']
    });

    this.state = {
      comparisonTexture: null,
      dataHasLoaded: false,
      modelHasErrored: false,
      metadata,
      sizing,
      frame,
      pixels: this.regl.texture()
    };
    this.setModel();
  }
  update(annotations, newViewBox) {
    // this function parses the new annotation and then triggers a render.
    // update the render funtions
    if (this.state.modelHasErrored) return;
    this.regl.poll();
    this.regl.clear({
      color: [0, 0, 0, 1]
    });
    this.state.pixels({ copy: true });

    // Call model-specific model calculation function. Returns [[regl-func, params], ...]
    this.calculateModel(annotations, newViewBox);
    this.state.pixels({ copy: true });
  }
  kill() {
    this.regl.destroy();
  }
  setBaseTexture(texData) {
    try {
      this.baseTexture = this.regl.texture(texData);
    } catch (err) {
      console.warn('Inside Model.setBaseTexture2d:', err);
    }
  }
  getTexture() {
    return this.state.modelHasErrored ? {} : {
      data: this.regl.read(),
      width: this.canvas.width,
      height: this.canvas.height
    };
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
  calculateModel() {
    // function to be overwritten to render model from annotation
    return false;
  }
  getScore() {
    return 0;
  }
  handlePanZoom(newSizing) {
    // This function will be used to zoom/rotate/scale the image according to the
    // new viewBoxDimensions (in comparison to those that arrived with the model)
  }
  /* eslint-enable class-methods-use-this */
}
export default BaseReglModel;
