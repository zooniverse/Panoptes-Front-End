const baseObj = {
  frag: 'void main () { gl_FragColor = vec4(0,0,0,1);}',
  vert: `
  precision mediump float; attribute vec2 position; varying vec2 uv;
  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`,
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
  count: 3
};

// Templates for webgl functions used in drawSersic and drawSpiral
const sersic2dFunc = `
float calcBoxyEllipseDist(float x, float y, vec2 mu, float roll, float rEff, float axRatio, float c) {
  float xPrime = x * cos(roll) - y * sin(roll)
    + mu[0] - mu[0] * cos(roll) + mu[1] * sin(roll);
  float yPrime = x * sin(roll) + y * cos(roll)
    + mu[1] - mu[1] * cos(roll) - mu[0] * sin(roll);
  // return a scaled version of the radius (multiplier is chosen so svg tool doesn't
  // impact badly on shown model component)
  float multiplier = 3.0;
  return multiplier * sqrt(
    pow(axRatio / rEff, c) * pow(abs(xPrime - mu[0]), c) +
    pow(abs(yPrime - mu[1]), c) / pow(rEff, c)
  );
}

float b(float n) {
  // from https://arxiv.org/abs/astro-ph/9911078
  return 2.0 * n - 1.0/3.0 + 4.0/405.0/n +
    46.0/25515.0/n/n + 131.0/1148175.0/pow(n, 3.0) -
    2194697.0/30690717750.0/pow(n, 4.0);
}

float sersic2d(float x, float y, vec2 mu, float roll, float rEff, float axRatio, float c, float i0, float n) {
  // from https://www.cambridge.org/core/services/aop-cambridge-core/content/view/S132335800000388X
  return 0.5 * i0 * exp(b(n) - b(n) * pow(calcBoxyEllipseDist(x, y, mu, roll, rEff, axRatio, c), 1.0 / n));
}`;

// function to generate oversampled sersic profile
function oversampleGenerator(n, fname) {
  let s = `float resolution = ${n}.0;\nfloat newDensity = resolution * resolution;
float stepSize = 1.0 / resolution / 2.0;\nfloat pixel = 0.0;\n`;
  for (let i = (1 - n) / 2; i <= (n - 1) / 2; i += 1) {
    for (let j = (1 - n) / 2; j <= (n - 1) / 2; j += 1) {
      s += `pixel += ${fname}(x`;
      if (i === 0) { s += ', '; } else { s += ` + ${i}.0 * stepSize, `; }
      if (j === 0) {
        s += `y, mu, roll, rEff, axRatio, c, i0, n) / newDensity;\n`;
      } else {
        s += `y + ${j}.0 * stepSize, mu, roll, rEff, axRatio, c, i0, n) / newDensity;\n`;
      }
    }
    s += `\n`;
  }
  return s;
}

export const drawSersic = r => r(Object.assign({}, baseObj, {
  frag: `
    precision highp float;
    uniform vec2 mu;
    varying vec2 uv;
    uniform sampler2D texture;
    uniform float roll, rEff, axRatio, i0, n, c;
    ${sersic2dFunc}
    void main () {
      float x = gl_FragCoord.xy[0];
      float y = gl_FragCoord.xy[1];

      ${oversampleGenerator(5, 'sersic2d')}

      gl_FragColor = vec4(
        pixel + texture2D(texture, uv).rgb[0],
        pixel + texture2D(texture, uv).rgb[0],
        pixel + texture2D(texture, uv).rgb[0],
        1.0
      );
    }`,
  uniforms: {
    roll: (context, props) => (
      (Math.PI * (props.rx < props.ry ? (-props.roll) : 90 - props.roll)) / 180
    ),
    mu: (c, p) => [p.mux, p.muy],
    rEff: (context, props) => (
      props.rx > props.ry ? props.rx * props.scale : props.ry * props.scale
    ),
    axRatio: (context, props) => (
      props.rx > props.ry ? props.rx / props.ry : props.ry / props.rx
    ),
    texture: r.prop('texture'),
    i0: r.prop('i0'),
    n: r.prop('n'),
    c: r.prop('c')
  }
}));

export const drawSpiral = (r, canvas) => {
  const gl = canvas.getContext('webgl');
  let maxPointCount = 240;
  if (gl) {
    maxPointCount = Math.min(
      Math.max(
        200,
        gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) - 100
      ),
      600
    );
  }
  const spiralArgs = {
    frag: `
      precision highp float;
      uniform sampler2D texture;
      varying vec2 uv;
      struct parentDisk {
        vec2 mu;
        float roll;
        float rEff;
        float axRatio;
        float c;
        float n;
      };
      uniform vec2 points[${maxPointCount}];
      uniform parentDisk disk;
      uniform int pointCount;
      uniform float spread, axRatio, i0, falloff;
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

        float pixel = i0 * exp(-radius*radius * 0.1/spread) *
          exp(-calcBoxyEllipseDist(x, y, disk.mu, disk.roll, disk.rEff, disk.axRatio, disk.c)/falloff);
        gl_FragColor = vec4(
          pixel + texture2D(texture, uv).rgb[0],
          pixel + texture2D(texture, uv).rgb[0],
          pixel + texture2D(texture, uv).rgb[0],
          1.0
        );
      }`,
    uniforms: {
      i0: r.prop('i0'),
      spread: r.prop('spread'),
      falloff: r.prop('falloff'),
      pointCount: (c, p) => p.points.length,
      'disk.mu': (c, p) => [p.disk.mux, p.disk.muy],
      'disk.axRatio': (c, p) => (
        p.disk.rx > p.disk.ry ? p.disk.rx / p.disk.ry : p.disk.ry / p.disk.rx
      ),
      'disk.roll': (c, p) => (Math.PI * (p.disk.rx < p.disk.ry ? (-p.disk.roll) : 90 - p.disk.roll)) / 180,
      'disk.rEff': (c, p) => (
        p.disk.rx > p.disk.ry ? p.disk.rx * p.disk.scale : p.disk.ry * p.disk.scale
      ),
      'disk.n': (c, p) => p.disk.n,
      'disk.c': (c, p) => p.disk.c,
      texture: r.prop('texture')
    }
  };
  // this is ugly, but it's the easiest (only?) way to pass the drawn polygon to regl
  const range = [...Array(maxPointCount).keys()];
  range.forEach((i) => {
    spiralArgs.uniforms[`points[${i}]`] = (c, p) => (
      p.points.length > i ? p.points[i] : [-1.0, -1.0]
    );
  });
  return r(Object.assign({}, baseObj, spiralArgs));
};
