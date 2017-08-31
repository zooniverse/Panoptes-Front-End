import baseModel from './baseModel';
import galaxyRegls from './galaxyRegls';
import postProcessingRegl from './postProcessingRegl';

class galaxyModel extends baseModel {
  static getModel() {
    return [
      {
        name: 'sersic disk',
        func: galaxyRegls.drawSersic,
        map: ['mux', 'muy', 'rx', 'ry', 'roll', 'scale', 'i0'],
        type: 'component',
        default: { mux: 0, muy: 0, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
      },
      {
        name: 'sersic bulge',
        func: galaxyRegls.drawSersic,
        map: ['mux', 'muy', 'rx', 'ry', 'roll', 'scale', 'i0', 'n'],
        type: 'component',
        default: { mux: 100, muy: 100, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
      },
      {
        name: 'sersic bar',
        func: galaxyRegls.drawSersic,
        map: ['mux', 'muy', 'rx', 'ry', 'roll', 'scale', 'i0', 'n', 'c'],
        type: 'component',
        default: { mux: 100, muy: 100, rx: 5, ry: 5, scale: 5 / 8, roll: 0, i0: 0.75, n: 2, c: 2 }
      },
      {
        name: 'sersic spiral',
        func: galaxyRegls.drawSpiral,
        map: ['points', 'spread', 'i0'],
        type: 'component',
        default: { mux: 100, muy: 100, rx: 5, ry: 5, spread: 1, roll: 0, i0: 0.75, n: 2, c: 2, falloff: 1 }
      }
    ];
  }
  parse(annotation) {
    // TODO: make this explicitly related to the galaxy rendering model.
    // TODO: link spiral arm to disk? Link centres?
    // we have disk, then bulge then bar
    const renderFunctions = [];
    const annotationLength = annotation.length;
    let disk = null;
    if (annotationLength > 0 && annotation[0].value[0].value.length > 0) {
      // a disk has been drawn
      disk = Object.assign(
        { name: this.model[0].name },
        this.model[0].default,
        {
          mux: parseFloat(annotation[0].value[0].value[0].x),
          muy: this.size[0] - parseFloat(annotation[0].value[0].value[0].y),
          rx: parseFloat(annotation[0].value[0].value[0].rx),
          ry: parseFloat(annotation[0].value[0].value[0].ry),
          roll: parseFloat(annotation[0].value[0].value[0].angle),
          scale: parseFloat(annotation[0].value[1].value),
          i0: parseFloat(annotation[0].value[2].value)
        }
      );
      renderFunctions.push([
        this.model[0].func,
        disk
      ]);
    }
    if (annotationLength > 1 && annotation[1].value[0].value.length > 0) {
      // a bulge has been drawn
      const bulge = Object.assign(
        { name: this.model[1].name },
        this.model[1].default,
        {
          mux: parseFloat(annotation[1].value[0].value[0].x),
          muy: this.size[0] - parseFloat(annotation[1].value[0].value[0].y),
          rx: parseFloat(annotation[1].value[0].value[0].rx),
          ry: parseFloat(annotation[1].value[0].value[0].ry),
          roll: parseFloat(annotation[1].value[0].value[0].angle),
          scale: parseFloat(annotation[1].value[1].value),
          i0: parseFloat(annotation[1].value[2].value),
          n: parseFloat(annotation[1].value[3].value)
        }
      );
      renderFunctions.push([
        this.model[1].func,
        bulge
      ]);
    }
    if (annotationLength > 2 && annotation[2].value[0].value.length > 0) {
      // a bar has been drawn
      const bar = Object.assign(
        { name: this.model[2].name },
        this.model[2].default,
        {
          mux: parseFloat(annotation[2].value[0].value[0].x),
          muy: this.size[0] - parseFloat(annotation[2].value[0].value[0].y),
          rx: parseFloat(annotation[2].value[0].value[0].rx),
          ry: parseFloat(annotation[2].value[0].value[0].ry),
          roll: parseFloat(annotation[2].value[0].value[0].angle),
          scale: parseFloat(annotation[2].value[1].value),
          i0: parseFloat(annotation[2].value[2].value),
          n: parseFloat(annotation[2].value[3].value),
          c: parseFloat(annotation[2].value[4].value)
        },
      );
      renderFunctions.push([
        this.model[2].func,
        bar
      ]);
    }
    // TODO: how to do multiple spiral arms?
    // TODO: In order to have a spiral, do we actually need a disk?
    if (disk !== null && annotationLength > 3 && annotation[3].value[0].value.length > 0) {
      // cycle through drawn spiral arms
      for (let i = 0; i < annotation[3].value[0].value.length; i += 1) {
        const spiralArm = Object.assign(
          { name: this.model[3].name },
          this.model[3].default,
          {
            disk,
            i0: parseFloat(annotation[3].value[0].value[i].details[0].value),
            spread: parseFloat(annotation[3].value[0].value[i].details[1].value),
            falloff: parseFloat(annotation[3].value[1].value),
            // spread: parseFloat(annotation[3].value[1].value[0].value),
            // i0: parseFloat(annotation[3].value[1].value[1].value),
            points: annotation[3].value[0].value[i].points.map(
              p => [p.x, this.size[0] - p.y]
            )
          }
        );
        renderFunctions.push([
          this.model[3].func,
          spiralArm
        ]);
      }
    }
    // TODO: add in PSF convolution (post processing regl?)
    return renderFunctions;
  }
  static getPostProcessingFunc(r) {
    return postProcessingRegl(r);
  }
}

// export the model
export default galaxyModel;
