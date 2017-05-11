/*
This file sholuld provide a model to be rendered in model-canvas using regl
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
    this.size = [canvas.width, canvas.height];

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
    console.error('Was not provided with a model. Cannot render')
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
    which are saved to this.toRender
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
    this.parse(annotation)

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
    frag: `
      precision mediump float;
      uniform sampler2D imageTexture, modelTexture;
      varying vec2 uv;
      vec2 texCoords;
      float pixel;
      void main () {
        // for some reason the y-axis coords have been mirrored;
        texCoords = vec2(uv[0], 1.0 - uv[1]);
        pixel = texture2D(imageTexture, texCoords).rgb[0] - texture2D(modelTexture, uv).rgb[0];
        if (pixel < 0.0) {
          // model is too bright
          gl_FragColor = vec4(
            1.0 + pixel,
            1.0 + pixel,
            1,
            1
          );
        } else {
          // model is too weak
          gl_FragColor = vec4(
            1,
            1.0 - pixel,
            1.0 - pixel,
            1
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
    this.baseTexture = null;
    this.modelTexture = null;
    this.started = false;
    this.renderFunction = bgRegl(this.regl);
  }
  setBaseTexture(image) {
    this.baseTexture = this.regl.texture(image);
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
      })
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
    // TODO: wtf is going on here?
    this.modelRegl.read(this.modelData);
    const l = this.size[0] * this.size[1] * 4;
    let score = 0;
    for (let i = 0; i < l; i += 4) {
      score += Math.pow(
        (this.modelData[i] - (this.size[0] - 1)/2) / this.size[0] * 2,
        2.0
      );
      score += Math.pow(
        (this.modelData[i+2] - (this.size[1] - 1)/2) / this.size[1] * 2,
        2.0
      );
    }
    return score;
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

// function to generate oversampled sersic profile
function oversampleGenerator(n, fname) {
  let s = `float resolution = ${n}.0;\nfloat newDensity = resolution * resolution;
    float stepSize = 1.0 / resolution / 2.0;\nfloat pixel = 0.0;\n`;
  for (let i = (1-n)/2; i <= (n-1)/2; i++) {
    for (let j = (1-n)/2; j <= (n-1.0)/2; j++) {
      s += `pixel += ${fname}(x`
      if (i === 0) { s += `, ` } else { s += ` + ${i}.0 * stepSize, ` }
      if (j === 0) { s += `y) / newDensity;\n` }
      else { s += `y + ${j}.0 * stepSize) / newDensity;\n` }
    }
    s += `\n`;
  }
  return s;
}

function drawSersic(r) {
  return r(Object.assign({}, baseObj, {
    frag: `
      precision mediump float;
      uniform vec2 mu;
      uniform float roll, rEff, axRatio, i0, n, c;
      float sersic2d(float x, float y) {
        float xPrime = x * cos(roll) - y * sin(roll)
          + mu[0] - mu[0] * cos(roll) + mu[1] * sin(roll);
        float yPrime = x * sin(roll) + y * cos(roll)
          + mu[1] - mu[1] * cos(roll) - mu[0] * sin(roll);
        float radius = 2.0 * pow(
          pow(axRatio / rEff, c) * pow(abs(xPrime - mu[0]), c) +
          pow(abs(yPrime - mu[1]), c) / pow(rEff, c), 1.0/c);
        float pixel = i0 * exp(-pow(radius, 1.0 / n));
        return pixel;
      }
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
      roll: function(context, props, batchID) {
        return Math.PI * (props.rx < props.ry ? (-props.roll) : 90 - props.roll) / 180;
      },
      mu: (c, p, b) => [p.mux, p.muy],
      rEff: function(context, props, batchID) {
        return props.rx > props.ry ? props.rx * props.scale : props.ry * props.scale
      },
      axRatio: function(context, props, batchID) {
        return props.rx > props.ry ? props.rx / props.ry : props.ry / props.rx;
      },
      i0: r.prop('i0'),
      n: r.prop('n'),
      c: r.prop('c'),
    },
  }));
}

function drawSpiral(r) {
  const spiralArgs = {
    frag: `
      precision mediump float;
      uniform vec2 mu, points[50];
      uniform int pointCount;
      uniform float rEff, axRatio, i0;
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
        if (pointCount > 1) {
          for (int i = 1; i < 50; i++) {
            radius = min(getDistance(gl_FragCoord.xy, points[i-1], points[i]), radius);
            if (i >= pointCount - 1) {
              break;
            }
          }
        }
        float pixel = i0 * exp(-radius*radius* 0.01);
        gl_FragColor = vec4(
          1,
          0,
          0,
          pixel
        );
      }`,
    uniforms: {
      //mu: (c, p, b) => [p.mux, p.muy],
      axRatio: function(context, props, batchID) {
        return props.rx > props.ry ? props.rx / props.ry : props.ry / props.rx;
      },
      i0: r.prop('i0'),
      scale: r.prop('scale'),
      pointCount: (c, p, b) => p.points.length,
    },
  };
  // this is ugly, but it's the easiest (only?) way to pass the drawn polygon to regl
  const range = [...Array(50).keys()];
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
        map: ['points', 'scale', 'i0'],
        type: 'component',
        default: { mux: 100, muy: 100, rx: 5, ry: 5, scale: 5/8, roll: 0, i0: 0.75, n: 2, c: 2, }
      },
    ];
  }
  parse(annotation) {
    // TODO: make this explicitly related to the galaxy rendering model.
    // TODO: link spiral arm to disk? Link centres?
    let renderFunctions = [];
    // cycle through each task
    for (let i = 0; i < annotation.length; i++) {
      // did we get a drawn on component?
      if (annotation[i].value[0].value.length > 0) {
        // get position values
        const parameters = [];
        if (isVar(annotation[i].value[0].value[0].x)) {
          // have we got an object centre?
          parameters.push(annotation[i].value[0].value[0].x);
          parameters.push(this.size[0] - annotation[i].value[0].value[0].y);
        }
        if (isVar(annotation[i].value[0].value[0].r)) {
          // radius => circle or triangle
          parameters.push(parseFloat(annotation[i].value[0].value[0].r))
        } else if (isVar(annotation[i].value[0].value[0].rx)) {
          // independent rx and ry => ellipse
          parameters.push(parseFloat(annotation[i].value[0].value[0].rx))
          parameters.push(parseFloat(annotation[i].value[0].value[0].ry))
        } else if (isVar(annotation[i].value[0].value[0].width)) {
          // width and height => rectangle (no rotation)
          parameters.push(parseFloat(annotation[i].value[0].value[0].width))
          parameters.push(parseFloat(annotation[i].value[0].value[0].height))
        }
        if (isVar(annotation[i].value[0].value[0].angle)) {
          // add the angle if it's present
          parameters.push(parseFloat(annotation[i].value[0].value[0].angle))
        }
        if (isVar(annotation[i].value[0].value[0].points)) {
          // polygon and bezier have points, though bezier is weird sometimes
          const points = [];
          annotation[i].value[0].value[0].points.forEach(
            (p) => points.push([p.x, this.size[0] - p.y])
          )
          parameters.push(points);
        }
        // get values from the sliders
        annotation[i].value[1].value.forEach(v => parameters.push(parseFloat(v.value)));
        const ret = {}
        parameters.forEach((c, j) => {
          ret[this.model[i].map[j]] = c;
        });
        renderFunctions.push([
          this.model[i].func,
          Object.assign(
            {
              name: this.model[i].name
            },
            this.model[i].default, ret
          )
        ]);
      }
    }
    this.toRender = renderFunctions;
  }
}
const model = galaxyModel;
export {model, differenceModel};
