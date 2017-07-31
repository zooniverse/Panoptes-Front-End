/*
This file should provide a model to be rendered in model-canvas using regl
Model needs:
 - to be provided with the regl instance created in model-canvas
 - to have a method which accepts an annotation and returns a list of render
   functions and function argument, called as i[0](i[1])
 - render functions should be of the form f(regl) => regl(kwargs), so that they
   can be instantiated with the correct rendering regl

Proposed usage:
  To render to modelCanvas:
  const model = myModel(modelCanvas);
  model.start(); // start rendering
  model.update(annotation) // update render functions from new annotation
  model.getTexture(); // get texture2D of model to send to difference calc

  Calling update() on a model will trigger a render if it hasn't been started.
  This uses less CPU so is preferable.

  To render to a difference canvas:
  const diffRenderer = myDiffModel(diffCanvas, baseImage)
  diffRenderer.setModel(texture) // update the texture we want do find the difference to

where myModel and myDiffModel extend provided base classes
*/

import reglBase from 'regl';

const isVar = v => typeof(v) !== 'undefined';

class baseModel {
  constructor(canvas) {
    // bind methods to correct `this`
    this.setModel = this.setModel.bind(this);
    this.start = this.start.bind(this);
    this.update = this.update.bind(this);
    this.getRegl = this.getRegl.bind(this);
    this.parse = this.parse.bind(this);
    this.size = [canvas.height, canvas.width];

    // instantiate the regl instance with the provided canvas
    this.regl = reglBase({
      canvas,
      attributes: { preserveDrawingBuffer: true }
    });

    // call the setModel function, this will be extended for each model
    this.setModel();

    // bind the model functions to the regl
    this.model = this.model.map(
      c => Object.assign(
        c,
        { func: c.func(this.regl) }
      )
    );
    this.toRender = [];
  }
  setModel() {
    // function to be overwritten for defining model
    this.model = {};
    console.error('Was not provided with a model. Cannot render');
  }
  start() {
    /* This function is called to start the model auto rendering from
    this.toRender
    */
    this.started = true;
    // do we have a valid model? (TODO: check if model bound?)
    if (this.model === {} || typeof this.model === 'undefined') return;
    // define the frame function for the regl
    this.regl.frame(() => {
      this.regl.clear({
        color: [0, 0, 0, 1]
      });
      for (let i = 0; i < this.toRender.length; i++) {
        this.toRender[i][0](this.toRender[i][1])
      }
    });
  }
  kill() {
    this.regl.destroy();
    this.start = () => false;
  }
  parse() {
    /* function to be overwritten when class is extended. Details how to parse a
    zooniverse annotation and create list of (renderfunc, object) pairs
    which are returned and saved by update() to this.toRender
    */
    this.toRender = []
  }
  update(annotation) {
    /* this function parses the new annotation and then triggers a render.
    I think it's synchronous (but I'm not sure). Either way, manually calling
    update on each new annotation is probably better than bottlenecking through
    javascript?
    */
    // update the render funtions
    this.toRender = this.parse(annotation)

    // if automatic rendering has not started, trigger a frame
    if (!this.started) {
      this.regl.poll();
      this.regl.clear({
        color: [0, 0, 0, 1]
      });
      for (let i = 0; i < this.toRender.length; i++) {
        this.toRender[i][0](this.toRender[i][1])
      }
    }
  }
  getRegl() {
    return this.regl;
  }
  getTexture() {
    return { data: this.regl.read(), width: this.size[0], height: this.size[1] };
  }
}

function bgRegl(r) {
  return r({
    // TODO: this should be more model-independent
    frag: `
      precision mediump float;
      uniform sampler2D imageTexture, modelTexture;
      varying vec2 uv;
      vec2 texCoords;
      float pixel;
      float sinhStretch(float px) {
        return 0.1 * (exp(2.99822 * px) - exp(2.99822 * -px)) / 2.0;
      }
      float asinh(float px) {
          return log(px + sqrt(1.0+px*px));
      }
      float asinhStretch(float px) {
        return asinh(px / 0.1) / 2.999;
      }
      void main () {
        // for some reason the y-axis coords have been mirrored;
        texCoords = vec2(uv[0], 1.0 - uv[1]);
        // calculate the difference between model + image (after
        // reversing the asinh stretch on the image)
        pixel = sinhStretch(texture2D(imageTexture, texCoords).rgb[0]) - \
          texture2D(modelTexture, uv).rgb[0];
        if (pixel < 0.0) {
          // the model is brighter than the image
          gl_FragColor = vec4(
            1.0 - asinhStretch(-pixel), // nb pixel < 1 so this is making the value smaller
            1.0 - asinhStretch(-pixel),
            1.0,
            1.0
          );
        } else {
          // model is weaker than the image
          gl_FragColor = vec4(
            1.0,
            1.0 - asinhStretch(pixel), // this time pixel > 1
            1.0 - asinhStretch(pixel),
            1.0
          );
        }
      }`,
    vert: `
      precision mediump float; attribute vec2 position; varying vec2 uv;
      void main () {
        uv = position;
        gl_Position = vec4(2.0 * position - 1.0, 0, 1);
      }`,
    uniforms: {
      imageTexture: r.prop('imageTexture'),
      modelTexture: r.prop('modelTexture'),
    },
    depth: { enable: false },
    attributes: { position: [-2, 0, 0, -2, 2, 2] },
    count: 3
  });
}

class differenceModel {
  constructor(canvas) {
    // bind methods to correct `this`
    this.setBaseTexture = this.setBaseTexture.bind(this);
    this.setModelRegl = this.setModelRegl.bind(this);
    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.getRegl = this.getRegl.bind(this);

    this.size = [canvas.width, canvas.height];

    // instantiate the regl instance with the provided canvas
    this.regl = reglBase({
      canvas,
      attributes: { preserveDrawingBuffer: true }
    });
    this.modelData = new Uint8Array(this.size[0] * this.size[1] * 4);
    this.differenceData = new Uint8Array(this.size[0] * this.size[1] * 4);
    this.baseTexture = null;
    this.modelTexture = null;
    this.started = false;
    this.renderFunction = bgRegl(this.regl);
  }
  setBaseTexture(image) {
    try {
      this.baseTexture = this.regl.texture(image);
    } catch(err) {
      if (err.name == 'SecurityError') {
        alert('CORS error encountered, please make sure you are using Google Chrome and try refreshing the page');
      }
    }
  }
  setModelRegl(modelRegl) {
    this.modelRegl = modelRegl;
    this.update();
  }
  update() {
    if (typeof this.modelRegl !== 'undefined') {
      this.modelRegl.read(this.modelData);
      this.modelTexture = this.regl.texture({
        data: this.modelData,
        width: this.size[0],
        height: this.size[1]
      });
    } else {
      console.error('Not been provided with a model regl')
    }
    // Rest is experimental
    if (!this.started) {
      this.regl.poll();
      this.regl.clear({
        color: [1, 1, 1, 1]
      });
      if (this.modelTexture !== null && this.baseTexture !== null) {
        this.renderFunction({
          imageTexture: this.baseTexture,
          modelTexture: this.modelTexture
        });
      }
    }
  }
  start() {
    this.started = true;
    if (this.baseTexture !== null && this.modelTexture !== null) {
      this.regl.frame((function() {
        this.regl.clear({
          color: [1, 1, 1, 1]
        })
        if (this.modelTexture !== null && this.baseTexture !== null) {
          this.renderFunction({
            imageTexture: this.baseTexture,
            modelTexture: this.modelTexture
          });
        }
      }).bind(this));
    }
  }
  kill() {
    this.regl.destroy();
    this.start = () => false;
  }
  getRegl() {
    return this.regl;
  }
  getScore() {
    // images have been treated by normalisation to [0, 1] then arcsinh stretch
    // with a = 0.1. Need to calc difference in normal space
    this.regl.read(this.differenceData); // get the difference array
    const l = this.size[0] * this.size[1] * 4;
    let AIC = 0;
    for (let i = 0; i < l; i += 4) {
      // normalise to [0, 1]
      let r = this.differenceData[i] / 255;
      let b = this.differenceData[i + 2] / 255;
      AIC += (r - b) * (r - b) / this.size[0] / this.size[1];
    }
    // arbitrary 0 -> 100% scaling
    return 100 * Math.exp(-AIC * 500);
  }
}

const baseObj = {
  frag: `void main () { gl_FragColor = vec4(0,0,0,1);}`,
  vert: `
    precision mediump float; attribute vec2 position;
    void main () { gl_Position = vec4(2.0 * position - 1.0, 0, 1); }
    `,
  attributes: { position: [-2, 0, 0, -2, 2, 2] },
  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 'one minus src alpha',
      dstAlpha: 1
    },
    equation: {
      rgb: 'add', alpha: 'add'
    },
    color: [0, 0, 0, 0]
  },
  depth: { enable: false },
  count: 3,
}

// Templates for webgl functions used in drawSersic and drawSpiral
const sersic2dFunc = `
float sersic2d(float x, float y, vec2 mu, float roll, float rEff, float axRatio, float c, float i0, float n) {
  return i0 * exp(-pow(calcBoxyEllipseDist(x, y, mu, roll, rEff, axRatio, c), 1.0 / n));
}`;
const calcBoxyEllipseDistFunc = `
float calcBoxyEllipseDist(float x, float y, vec2 mu, float roll, float rEff, float axRatio, float c) {
  float xPrime = x * cos(roll) - y * sin(roll)
    + mu[0] - mu[0] * cos(roll) + mu[1] * sin(roll);
  float yPrime = x * sin(roll) + y * cos(roll)
    + mu[1] - mu[1] * cos(roll) - mu[0] * sin(roll);
  return 2.0 * pow(
    pow(axRatio / rEff, c) * pow(abs(xPrime - mu[0]), c) +
    pow(abs(yPrime - mu[1]), c) / pow(rEff, c), 1.0/c);
}
`;

// function to generate oversampled sersic profile
function oversampleGenerator(n, fname) {
  let s = `float resolution = ${n}.0;\nfloat newDensity = resolution * resolution;
float stepSize = 1.0 / resolution / 2.0;\nfloat pixel = 0.0;\n`;
  for (let i = (1-n)/2; i <= (n-1)/2; i++) {
    for (let j = (1-n)/2; j <= (n-1.0)/2; j++) {
      s += `pixel += ${fname}(x`
      if (i === 0) { s += `, ` } else { s += ` + ${i}.0 * stepSize, ` }
      if (j === 0) { s += `y, mu, roll, rEff, axRatio, c, i0, n) / newDensity;\n` }
      else { s += `y + ${j}.0 * stepSize, mu, roll, rEff, axRatio, c, i0, n) / newDensity;\n` }
    }
    s += `\n`;
  }
  return s;
}

function drawSersic(r) {
  // TODO: boxy part of this is wrong
  return r(Object.assign({}, baseObj, {
    frag: `
      precision mediump float;
      uniform vec2 mu;
      uniform float roll, rEff, axRatio, i0, n, c;
      ${calcBoxyEllipseDistFunc}
      ${sersic2dFunc}
      void main () {
        float x = gl_FragCoord.xy[0];
        float y = gl_FragCoord.xy[1];

        ${oversampleGenerator(5, 'sersic2d')}

        gl_FragColor = vec4(
          1,
          0,
          0,
          pixel
        );
      }`,
    uniforms: {
      roll: (context, props, batchID) => {
        return Math.PI * (props.rx < props.ry ? (-props.roll) : 90 - props.roll) / 180;
      },
      mu: (c, p, b) => [p.mux, p.muy],
      rEff: (context, props, batchID) => {
        return props.rx > props.ry ? props.rx * props.scale : props.ry * props.scale;
      },
      axRatio: (context, props, batchID) => {
        return props.rx > props.ry ? props.rx / props.ry : props.ry / props.rx;
      },
      i0: r.prop('i0'),
      n: r.prop('n'),
      c: r.prop('c'),
    },
  }));
}

function drawSpiral(r) {
  // TODO: is there any way of dynamically increasing the maximum point count
  const maxPointCount = 50;
  const spiralArgs = {
    frag: `
      precision mediump float;
      struct parentDisk {
        vec2 mu;
        float roll;
        float rEff;
        float axRatio;
        float c;
        float n;
      };
      uniform vec2 points[50];
      uniform parentDisk disk;
      uniform int pointCount;
      uniform float spread, axRatio, i0, falloff;

      ${calcBoxyEllipseDistFunc}
      ${sersic2dFunc}
      float getDistance(vec2 y, vec2 p1, vec2 p2) {
        float r = dot(p2 - p1, y - p1) / length(p2 - p1) / length(p2 - p1);
        if (r <= 0.0) {
          return length(y - p1);
        } else if (r >= 1.0) {
          return length(y - p2);
        } else {
          float top = abs((p2[1] - p1[1])*y[0] - (p2[0]-p1[0])*y[1] + p2[0]*p1[1] - p2[1]*p1[0]);
          float bottom = sqrt((p2[1] - p1[1])*(p2[1] - p1[1]) + (p2[0] - p1[0])*(p2[0] - p1[0]));
          return top / bottom;
        }
      }
      void main () {
        float radius = 10000.0;
        float x = gl_FragCoord.xy[0];
        float y = gl_FragCoord.xy[1];
        vec2 mu = vec2(0.0, 0.0);
        if (pointCount > 1) {
          for (int i = 1; i < ${maxPointCount}; i++) {
            radius = min(getDistance(gl_FragCoord.xy, points[i-1], points[i]), radius);
            if (i >= pointCount - 1) {
              break;
            }
          }
        }

        float pixel = i0 * exp(-radius*radius * 0.01/spread) *
          exp(-calcBoxyEllipseDist(x, y, disk.mu, disk.roll, disk.rEff, disk.axRatio, disk.c)/falloff);
        gl_FragColor = vec4(
          1,
          0,
          0,
          pixel
        );
      }`,
    uniforms: {
      i0: r.prop('i0'),
      spread: r.prop('spread'),
      falloff: r.prop('falloff'),
      pointCount: (c, p, b) => p.points.length,
      'disk.mu': (c, p, b) => [p.disk.mux, p.disk.muy],
      'disk.axRatio': (c, p, b) => p.disk.rx > p.disk.ry ?
        p.disk.rx / p.disk.ry:
        p.disk.ry / p.disk.rx,
      'disk.roll': (c, p, b) => Math.PI * (p.disk.rx < p.disk.ry ? (-p.disk.roll) : 90 - p.disk.roll) / 180,
      'disk.rEff': (c, p, b) => p.disk.rx > p.disk.ry ?
        p.disk.rx * p.disk.scale:
        p.disk.ry * p.disk.scale,
      'disk.n': (c, p, b) => p.disk.n,
      'disk.c': (c, p, b) => p.disk.c,
    },
  };
  // this is ugly, but it's the easiest (only?) way to pass the drawn polygon to regl
  const range = [...Array(maxPointCount).keys()];
  range.forEach(i => {
    spiralArgs.uniforms[`points[${i}]`] = (c, p, b) =>
      p.points.length > i ?
        p.points[i] :
        [-1.0, -1.0];
  });
  return r(Object.assign({}, baseObj, spiralArgs));
}

class galaxyModel extends baseModel {
  setModel() {
    this.model = [
      {
        name: 'sersic disk',
        func: drawSersic,
        map: ['mux', 'muy', 'rx', 'ry', 'roll', 'scale', 'i0'],
        type: 'component',
        default: { mux: 0, muy: 0, rx: 10, ry: 15, scale: 5/8, roll: 0, i0: 0.75, n: 1, c: 2, }
      },
      {
        name: 'sersic bulge',
        func: drawSersic,
        map: ['mux', 'muy', 'rx', 'ry', 'roll', 'scale', 'i0', 'n'],
        type: 'component',
        default: { mux: 100, muy: 100, rx: 10, ry: 15, scale: 5/8, roll: 0, i0: 0.75, n: 1, c: 2, }
      },
      {
        name: 'sersic bar',
        func: drawSersic,
        map: ['mux', 'muy', 'rx', 'ry', 'roll', 'scale', 'i0', 'n', 'c'],
        type: 'component',
        default: { mux: 100, muy: 100, rx: 5, ry: 5, scale: 5/8, roll: 0, i0: 0.75, n: 2, c: 2, }
      },
      {
        name: 'sersic spiral',
        func: drawSpiral,
        map: ['points', 'spread', 'i0'],
        type: 'component',
        default: { mux: 100, muy: 100, rx: 5, ry: 5, spread: 1, roll: 0, i0: 0.75, n: 2, c: 2, falloff: 1, }
      },
    ];
  }
  parse(annotation) {
    // TODO: make this explicitly related to the galaxy rendering model.
    // TODO: link spiral arm to disk? Link centres?
    // we have disk, then bulge then bar
    let renderFunctions = [];
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
          scale: parseFloat(annotation[0].value[1].value[0].value),
          i0: parseFloat(annotation[0].value[1].value[1].value)
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
          scale: parseFloat(annotation[1].value[1].value[0].value),
          i0: parseFloat(annotation[1].value[1].value[1].value),
          n: parseFloat(annotation[1].value[1].value[2].value)
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
          scale: parseFloat(annotation[2].value[1].value[0].value),
          i0: parseFloat(annotation[2].value[1].value[1].value),
          n: parseFloat(annotation[2].value[1].value[2].value),
          c: parseFloat(annotation[2].value[1].value[3].value)
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
      for (let i = 0; i < annotation[3].value[0].value.length; i++) {
        const spiralArm = Object.assign(
          { name: this.model[3].name },
          this.model[3].default,
          {
            disk,
            i0: parseFloat(annotation[3].value[0].value[i].details[0].value),
            spread: parseFloat(annotation[3].value[0].value[i].details[1].value),
            falloff: parseFloat(annotation[3].value[1].value[0].value),
            //spread: parseFloat(annotation[3].value[1].value[0].value),
            //i0: parseFloat(annotation[3].value[1].value[1].value),
            points: annotation[3].value[0].value[i].points.map(
              (p) => [p.x, this.size[0] - p.y]
            ),
          }
        );
        renderFunctions.push([
          this.model[3].func,
          spiralArm
        ]);
      }
    }
    return renderFunctions;
  }
}
const model = galaxyModel;
// export the two canvases
export {model, differenceModel};
