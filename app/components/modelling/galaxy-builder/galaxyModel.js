/* eslint-disable class-methods-use-this */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
import baseModel from '../baseModel';
import galaxyRegls from './galaxyRegls';
import postProcessingRegl from './postProcessingRegl';

const hasComp = c => (c.value[0].value.length > 0);

const parseDisk = (comp, state) => {
  if (!hasComp(comp)) return null;
  const disk = Object.assign(
    { name: state.model.disk.name },
    state.model.disk.default,
    {
      mux: parseFloat(comp.value[0].value[0].x),
      muy: state.size[0] - parseFloat(comp.value[0].value[0].y),
      rx: parseFloat(comp.value[0].value[0].rx),
      ry: parseFloat(comp.value[0].value[0].ry),
      roll: parseFloat(comp.value[0].value[0].angle),
      scale: parseFloat(comp.value[1].value),
      i0: parseFloat(comp.value[2].value)
    }
  );
  return ([
    state.model.disk.func,
    disk
  ]);
};

const parseBulge = (comp, state) => {
  if (!hasComp(comp)) return null;
  const bulge = Object.assign(
    { name: state.model.bulge.name },
    state.model.bulge.default,
    {
      mux: parseFloat(comp.value[0].value[0].x),
      muy: state.size[0] - parseFloat(comp.value[0].value[0].y),
      rx: parseFloat(comp.value[0].value[0].rx),
      ry: parseFloat(comp.value[0].value[0].ry),
      roll: parseFloat(comp.value[0].value[0].angle),
      scale: parseFloat(comp.value[1].value),
      i0: parseFloat(comp.value[2].value),
      n: parseFloat(comp.value[3].value)
    }
  );
  return ([
    state.model.bulge.func,
    bulge
  ]);
};

const parseBar = (comp, state) => {
  if (!hasComp(comp)) return null;
  const bar = Object.assign(
    { name: state.model.bar.name },
    state.model.bar.default,
    {
      name: state.model.bar.name,
      mux: parseFloat(comp.value[0].value[0].x),
      muy: state.size[0] - parseFloat(comp.value[0].value[0].y),
      rx: parseFloat(comp.value[0].value[0].rx),
      ry: parseFloat(comp.value[0].value[0].ry),
      roll: parseFloat(comp.value[0].value[0].angle),
      scale: parseFloat(comp.value[1].value),
      i0: parseFloat(comp.value[2].value),
      n: parseFloat(comp.value[3].value),
      c: parseFloat(comp.value[4].value)
    }
  );
  return ([
    state.model.bar.func,
    bar
  ]);
};

const parseSpiral = (comp, state, currentComps) => {
  // has a spiral been drawn?
  if (!hasComp(comp)) return null;
  // do we have a disk?
  const disks = currentComps.filter(i => i[1].name === 'disk');
  if (disks.length === 0) return null;
  else {
    const ret = [];
    for (let i = 0; i < comp.value[0].value.length; i += 1) {
      const spiralArm = Object.assign(
        { name: state.model.spiral.name },
        state.model.spiral.default,
        {
          disk: Object.assign({}, disks[0][1]), // base falloff from the 0th disk
          i0: parseFloat(comp.value[0].value[i].details[0].value),
          spread: parseFloat(comp.value[0].value[i].details[1].value),
          falloff: parseFloat(comp.value[1].value),
          points: comp.value[0].value[i].points.map(
            p => [p.x, state.size[0] - p.y]
          )
        }
      );
      ret.push([
        state.model.spiral.func,
        spiralArm
      ]);
    }
    return ret;
  }
};

class galaxyModel extends baseModel {
  getModel(r) {
    // return taskName: render method object
    return {
      disk: {
        name: 'disk',
        func: galaxyRegls.drawSersic(r),
        default: { mux: 0, muy: 0, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
      },
      bulge: {
        name: 'bulge',
        func: galaxyRegls.drawSersic(r),
        default: { mux: 100, muy: 100, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
      },
      bar: {
        name: 'bar',
        func: galaxyRegls.drawSersic(r),
        default: { mux: 100, muy: 100, rx: 5, ry: 5, scale: 5 / 8, roll: 0, i0: 0.75, n: 2, c: 2 }
      },
      spiral: {
        name: 'spiral',
        func: galaxyRegls.drawSpiral(r),
        default: { mux: 100, muy: 100, rx: 5, ry: 5, spread: 1, roll: 0, i0: 0.75, n: 2, c: 2, falloff: 1 }
      }
    };
  }
  parse(annotations) {
    const s = {
      size: this.size,
      model: this.model
    };
    let ret = [];
    for (let i = 0; i < annotations.length; i++) {
      let comp = null;
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
      if (comp !== null) ret.push(comp);
    }
    for (let i = 0; i < annotations.length; i++) {
      if (annotations[i].task === 'spiral') {
        ret = ret.concat(parseSpiral(annotations[i], s, ret));
      }
    }
    return ret;
  }
  getPostProcessingFunc(r) {
    return postProcessingRegl(r);
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
export default galaxyModel;
