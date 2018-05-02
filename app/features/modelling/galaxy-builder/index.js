/* eslint-disable class-methods-use-this */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
import baseModel from '../baseReglModel';
import { drawSersic, drawSpiral } from './galaxyRegls';
import { convolvePSF, calculateDifference, scaleModel, maskImage, panZoom } from './postProcessingRegl';
import { parseDisk, parseBulge, parseBar, parseSpiralArms } from './parseFunctions';

class GalaxyBuilderModel extends baseModel {
  constructor(canvas, { frame, metadata, src, sizing }, eventHandlers) {
    const modelErrorMessage = `
    Sorry, this project requires features which are not supported by your
    device. Please try again on a different computer, and let us know in talk
    if you're still having problems. You can comment on photos (the second
    image) in Talk, but please do not classify!`;
    super(canvas, { frame, metadata, src, sizing }, eventHandlers, modelErrorMessage);
    this.panZoom = panZoom(this.regl);
    this.scaleModel = scaleModel(this.regl);
    this.state.shouldCompareToImage = false;
    this.state.annotations = [];
    // first, fire off the fetch event
    if (src) {
      fetch(`${src}?=`)
        .then(response => response.json())
        .then(data => this.handleDataLoad(data))
        .catch((e) => {
          console.warn(e);
          this.state.modelHasErrored = true;
          this.eventHandlers.modelDidError({
            modelErrorMessage: this.modelErrorMessage
          });
        });
    }
  }
  handleDataLoad(data) {
    if (this.state.modelHasErrored) return Promise.resolve();
    const oldViewBox = this.state.sizing;
    this.eventHandlers.resizeCanvas({ width: data.width, height: data.height });
    if (data.psf && data.psfWidth && data.psfHeight) {
      this.psf = data.psf;
      this.psfSize = [data.psfWidth, data.psfHeight];
      this.convolvePSF = convolvePSF(this.regl, this.psf, this.psfSize);
    }
    if (data.imageData) {
      this.imageData = this.regl.texture({
        type: 'float',
        channels: 1,
        data: data.imageData
      });
      this.state.shouldCompareToImage = true;
      this.calculateDifference = calculateDifference(this.regl);
      this.state.differenceData = new Uint8Array(data.height * data.height * 4);
    }
    if (data.imageHeight && data.imageWidth) {
      this.eventHandlers.changeCanvasStyleSize(
        { width: `${data.imageWidth}px`, height: `${data.imageHeight}px` }
      );
      this.state.sizing = Object.assign(
        {},
        this.state.sizing,
        { height: data.imageHeight, width: data.imageWidth }
      );
    }
    if (data.mask) {
      this.mask = this.regl.texture({
        type: 'float',
        channels: 1,
        data: data.mask
      });
      this.maskImage = maskImage(this.regl);
    }
    // if frame index is zero, viewBox width will be zero for first page render
    // (or if we go )
    if (oldViewBox.width === 0) {
      this.update(this.state.annotations, this.state.sizing);
    } else {
      this.update(this.state.annotations, oldViewBox);
    }
    this.eventHandlers.onLoad(this.state.sizing);
    return Promise.resolve();
  }
  setModel() {
    // return taskName: render method object
    try {
      this.model = {
        disk: {
          name: 'disk',
          func: drawSersic(this.regl),
          default: { mux: 0, muy: 0, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
        },
        bulge: {
          name: 'bulge',
          func: drawSersic(this.regl),
          default: { mux: 100, muy: 100, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
        },
        bar: {
          name: 'bar',
          func: drawSersic(this.regl),
          default: { mux: 100, muy: 100, rx: 5, ry: 5, scale: 5 / 8, roll: 0, i0: 0.75, n: 2, c: 2 }
        },
        spiral: {
          name: 'spiral',
          func: drawSpiral(this.regl, this.canvas),
          default: { mux: 100, muy: 100, rx: 5, ry: 5, spread: 1, roll: 0, i0: 0.75, n: 2, c: 2, falloff: 1 }
        }
      };
    } catch (e) {
      this.model = {};
      this.state.modelHasErrored = true;
      this.eventHandlers.modelDidError({
        modelErrorMessage: this.modelErrorMessage
      });
    }
  }
  calculateModel(annotations, viewBox) {
    // TODO: store calculated functions in state to be re-called rather than
    //       re-calculated
    this.state.annotations = annotations;
    const s = {
      size: [this.state.sizing.width, this.state.sizing.height],
      // the canvas is not the same size as is visible
      sizeMultiplier: this.canvas.width / this.state.sizing.width,
      model: this.model
    };
    // const ret = [];
    const ret = annotations.map((annotation) => {
      let comp = null;
      switch (annotation.task) {
        case 'disk':
          comp = parseDisk(annotation, s);
          break;
        case 'bulge':
          comp = parseBulge(annotation, s);
          break;
        case 'bar':
          comp = parseBar(annotation, s);
          break;
        default:
          break;
      }
      if (comp !== null) {
        comp[0](Object.assign({ texture: this.state.pixels }, comp[1]));
        this.state.pixels({ copy: true });
      }
      return comp;
    })
      .filter(component => component !== null);

    annotations.filter(annotation => annotation.task === 'spiral')
      .forEach(
        annotation => parseSpiralArms(annotation, s, ret).forEach(
          ([renderFunction, params]) => {
            renderFunction(Object.assign({ texture: this.state.pixels }, params));
            this.state.pixels({ copy: true });
          }
        )
      );
    if (this.convolvePSF) {
      this.convolvePSF({
        texture: this.state.pixels
      });
      this.state.pixels({ copy: true });
    }
    let message = '';
    if (this.state.shouldCompareToImage) {
      this.calculateDifference({
        texture: this.state.pixels,
        imageTexture: this.imageData
      });
      this.state.pixels({ copy: true });
      message += `Difference Image - Score: ${this.getScore()}`;
    } else if (this.scaleModel) {
      this.scaleModel({
        texture: this.state.pixels
      });
      this.state.pixels({ copy: true });
      message += 'Your Galaxy';
    }
    if (this.maskImage && this.mask) {
      this.maskImage({
        texture: this.state.pixels,
        mask: this.mask
      });
      this.state.pixels({ copy: true });
    }
    if (this.panZoom) {
      const scale = viewBox.width / this.state.sizing.width;
      const offset = [
        (viewBox.x / this.state.sizing.width),
        1 - scale - (viewBox.y / this.state.sizing.height)
      ];
      this.panZoom({
        texture: this.state.pixels,
        scale,
        offset
      });
    }
    if (ret.length === 0) {
      message += ' (draw a component!)';
    }
    this.eventHandlers.setMessage(message);
  }
  getScore() {
    // images have been treated by normalisation to [0, 1] then arcsinh stretch
    // with a = 0.1. Need to calc difference in normal space
    // TODO: more model-independent
    try {
      this.regl.read(this.state.differenceData); // get the difference array
    } catch (e) {
      console.warn(e, this.state.differenceData.length, this.canvas.width);
      this.state.differenceData = this.regl.read();
    }
    const l = this.canvas.width * this.canvas.height * 4;
    let v = 0;
    for (let i = 0; i < l; i += 4) {
      // normalise to [0, 1]
      const r = this.state.differenceData[i] / 255;
      const b = this.state.differenceData[i + 2] / 255;
      v += ((r - b) * (r - b)) / this.canvas.width / this.canvas.height;
    }
    // arbitrary 0 -> 100% scaling
    return (100 * Math.exp(-v * 300)).toFixed(2);
  }
}

// export the model
export default GalaxyBuilderModel;
