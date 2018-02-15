/* eslint-disable class-methods-use-this */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
import baseModel from '../baseReglModel';
import galaxyRegls from './galaxyRegls';
import { convolvePSF, calculateDifference, maskImage } from './postProcessingRegl';
import { parseDisk, parseBulge, parseBar, parseSpiral } from './parseFunctions';

class GalaxyBuilderModel extends baseModel {
  constructor(canvas, { frame, metadata, src, sizing }) {
    super(canvas, { frame, metadata, src, sizing });
    this.state.dataHasLoaded = false;
    this.state.shouldCompareToImage = false;
    this.state.annotations = [];
    console.log(sizing);
    this.canvas.style.width = `${sizing.width}px`;
    this.canvas.style.height = `${sizing.height}px`;
    console.log(this.canvas);
    // first, fire off the fetch event
    if (src) {
      console.log('>>> Attempting to fetch json');
      fetch(`${src}?=`)
        .then(response => response.json())
        .catch((e) => {
          const content = e.message;
          console.warn(content);
        })
        .then(data => this.handleDataLoad(data));
    }
  }
  handleDataLoad(data) {
    this.canvas.height = data.height;
    this.canvas.width = data.width;
    console.log(Object.keys(data));
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
    }
    this.state.dataHasLoaded = true;
  }
  setModel() {
    // return taskName: render method object
    this.model = {
      disk: {
        name: 'disk',
        func: galaxyRegls.drawSersic(this.regl),
        default: { mux: 0, muy: 0, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
      },
      bulge: {
        name: 'bulge',
        func: galaxyRegls.drawSersic(this.regl),
        default: { mux: 100, muy: 100, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
      },
      bar: {
        name: 'bar',
        func: galaxyRegls.drawSersic(this.regl),
        default: { mux: 100, muy: 100, rx: 5, ry: 5, scale: 5 / 8, roll: 0, i0: 0.75, n: 2, c: 2 }
      },
      spiral: {
        name: 'spiral',
        func: galaxyRegls.drawSpiral(this.regl),
        default: { mux: 100, muy: 100, rx: 5, ry: 5, spread: 1, roll: 0, i0: 0.75, n: 2, c: 2, falloff: 1 }
      }
    };
  }
  calculateModel(annotations) {
    // TODO: store calculated functions in state to be re-called rather than
    //       re-calculated
    this.state.annotations = annotations;
    console.log('Sizing:', this.state.sizing.width, this.state.sizing.height);
    console.log('Canvas', this.canvas.width, this.canvas.height);
    const s = {
      size: [this.state.sizing.width, this.state.sizing.height],
      sizeMultiplier: this.canvas.width / this.state.sizing.width,
      model: this.model
    };
    console.log(s);
    const ret = [];
    let comp = null;
    for (let i = 0; i < annotations.length; i++) {
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
      console.log('>>> Calculated component', comp, 'from', annotations[i]);
      if (comp !== null) {
        comp[0](comp[1]);
        this.state.pixels({ copy: true });
        ret.push(comp);
      }
    }
    for (let i = 0; i < annotations.length; i++) {
      if (annotations[i].task === 'spiral') {
        comp = ret.concat(parseSpiral(annotations[i], s, ret));
        comp[0](comp[1]);
        this.state.pixels({ copy: true });
      }
    }
    if (this.convolvePSF) {
      console.log('>>> calculating PSF');
      this.convolvePSF({
        texture: this.state.pixels
      });
    }
    if (this.calculateDifference) {
      console.log('>>> calculating Difference');
      this.calculateDifference({
        texture: this.state.pixels,
        imageTexture: this.imageData
      });
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
