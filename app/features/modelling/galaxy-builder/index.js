/* eslint-disable class-methods-use-this */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
import baseModel from '../baseReglModel';
import { drawSersic, drawSpiral } from './galaxyRegls';
import { convolvePSF, calculateDifference, scaleModel, maskImage, panZoom } from './postProcessingRegl';
import { parseDisk, parseBulge, parseBar, parseSpiral } from './parseFunctions';

class GalaxyBuilderModel extends baseModel {
  constructor(canvas, { frame, metadata, src, sizing }) {
    super(canvas, { frame, metadata, src, sizing });
    this.panZoom = panZoom(this.regl);
    this.scaleModel = scaleModel(this.regl);
    this.state.shouldCompareToImage = false;
    this.state.annotations = [];
    this.canvas.style.width = `${sizing.width}px`;
    this.canvas.style.height = `${sizing.height}px`;
    // first, fire off the fetch event
    if (src) {
      fetch(`${src}?=`)
        .then(response => response.json())
        .catch((e) => {
          console.warn(e);
        })
        .then(data => this.handleDataLoad(data));
    }
  }
  handleDataLoad(data) {
    this.canvas.height = data.height;
    this.canvas.width = data.width;
    if (data.psf && data.psfWidth && data.psfHeight) {
      this.psf = [];
      this.psfSize = [data.psfWidth, data.psfHeight];
      this.psf = data.psf;
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
      if (data.imageHeight && data.imageWidth) {
        this.canvas.style.height = `${data.imageHeight}px`;
        this.canvas.style.width = `${data.imageWidth}px`;
        this.state.sizing = {
          sizing: Object.assign(
            {},
            this.state.sizing,
            { height: data.imageHeight, width: data.imageWidth }
          )
        };
      }
    }
    this.update(this.state.annotations, this.state.sizing);
  }
  setModel() {
    // return taskName: render method object
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
        func: drawSpiral(this.regl),
        default: { mux: 100, muy: 100, rx: 5, ry: 5, spread: 1, roll: 0, i0: 0.75, n: 2, c: 2, falloff: 1 }
      }
    };
  }
  calculateModel(annotations, viewBox) {
    console.log('-------------- MODEL CALCULATION --------------');
    // TODO: store calculated functions in state to be re-called rather than
    //       re-calculated
    this.state.annotations = annotations;
    const s = {
      size: [this.state.sizing.width, this.state.sizing.height],
      // the canvas is not the same size as is visible
      sizeMultiplier: this.canvas.width / this.state.sizing.width,
      model: this.model
    };
    const ret = [];
    for (let i = 0, comp = null; i < annotations.length; i++) {
      switch (annotations[i].task) {
        case 'disk':
          comp = parseDisk(annotations[i], s);
          break;
        case 'bulge':
          comp = parseBulge(annotations[i], s);
          break;
        case 'bar':
          comp = parseBar(annotations[i], s);
          break;
        default:
          break;
      }
      if (comp !== null) {
        console.log(`Rendering ${comp[1].name}`);
        comp[0](Object.assign({ texture: this.state.pixels }, comp[1]));
        this.state.pixels({ copy: true });
        ret.push(comp);
      }
    }
    for (let i = 0, comp = null; i < annotations.length; i++) {
      if (annotations[i].task === 'spiral') {
        comp = parseSpiral(annotations[i], s, ret);
        if (comp !== null) {
          comp.forEach(([renderFunc, params]) => {
            console.log('Rendering spiral arm');
            console.log(params);
            renderFunc(Object.assign({ texture: this.state.pixels }, params));
            this.state.pixels({ copy: true });
          });
        }
      }
    }
    if (this.convolvePSF) {
      console.log('Convolving PSF');
      this.convolvePSF({
        texture: this.state.pixels
      });
      this.state.pixels({ copy: true });
    }
    if (this.state.shouldCompareToImage) {
      console.log('Calculating difference');
      this.calculateDifference({
        texture: this.state.pixels,
        imageTexture: this.imageData
      });
      this.state.pixels({ copy: true });
    } else if (this.scaleModel) {
      console.log('Scaling model');
      this.scaleModel({
        texture: this.state.pixels
      });
      this.state.pixels({ copy: true });
    }
    if (this.panZoom) {
      console.log('Pan-Zooming');
      const scale = viewBox.width / this.state.sizing.width;
      const offset = [
        (viewBox.x / this.state.sizing.width),
        1 - scale - (viewBox.y / this.state.sizing.height)
      ];
      const zoomObj = {
        texture: this.state.pixels,
        scale,
        offset
      };
      this.panZoom(zoomObj);
    }
  }
  getScore() {
    // images have been treated by normalisation to [0, 1] then arcsinh stretch
    // with a = 0.1. Need to calc difference in normal space
    // TODO: more model-independent
    this.regl.read(this.differenceData); // get the difference array
    const l = this.size[0] * this.size[1] * 4;
    let v = 0;
    for (let i = 0; i < l; i += 4) {
      // normalise to [0, 1]
      const r = this.differenceData[i] / 255;
      const b = this.differenceData[i + 2] / 255;
      v += ((r - b) * (r - b)) / this.size[0] / this.size[1];
    }
    // arbitrary 0 -> 100% scaling
    return 100 * Math.exp(-v * 500);
  }
}

// export the model
export default GalaxyBuilderModel;
