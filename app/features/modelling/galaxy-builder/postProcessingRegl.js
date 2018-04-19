
const asinhStretch = a => `
float asinh(float px) {
  return log(px + sqrt(1.0 + (px * px)));
}
float asinhStretch(float px) {
  return asinh(px / ${a}) / asinh(${a});
}
`;

export const convolvePSF = (r, psf, size) => {
  const psfKeys = {};
  let convolution = '';
  let c = [0, 0];
  for (let i = 0, n = size[0]; i < n; i += 1) {
    for (let j = 0, m = size[1]; j < m; j += 1) {
      psfKeys[`psf[${(i * size[0]) + j}]`] = psf[i][j];
      // TODO: psf size shouldn't be fixed to 11x11
      c = [i - 5, j - 5];
      convolution += `texture2D(texture, uv + vec2(${(c[0]).toFixed(1)}/texSize[0],`;
      convolution += `${(c[1]).toFixed(1)}/texSize[1])) * psf[${(i * size[0]) + j}]`;
      if (i < size[0] - 1 || j < size[1] - 1) {
        convolution += ' + \n';
      }
    }
  }
  return r({
    frag: `
    precision highp float;
    uniform sampler2D texture;
    uniform vec2 texSize;
    uniform float psf[${size[0] * size[1]}];
    varying vec2 uv;
    void main () {
      vec4 val = ${convolution};
      gl_FragColor = vec4(val.rgb, 1);
    }`,
    vert: `
    precision mediump float; attribute vec2 position; varying vec2 uv;
    void main () {
      uv = position;
      gl_Position = vec4(2.0 * position - 1.0, 0, 1);
    }`,
    uniforms: Object.assign(
      {
        texture: r.prop('texture'),
        texSize: c_ => [c_.drawingBufferWidth, c_.drawingBufferHeight]
      },
      psfKeys
    ),
    depth: { enable: false },
    attributes: Object.assign(
      { position: [-2, 0, 0, -2, 2, 2] },
    ),
    count: 3
  });
};

export const calculateDifference = r => r({
  frag: `
  precision highp float;
  uniform sampler2D imageTexture, modelTexture;
  varying vec2 uv;
  vec2 texCoords;
  float pixel;
  ${asinhStretch(0.6)}
  void main () {
    // for some reason the y-axis coords have been mirrored;
    texCoords = vec2(uv[0], 1.0 - uv[1]);
    // calculate the difference between model + image (after
    // reversing the asinh stretch on the image)
    pixel = 0.8 * texture2D(imageTexture, uv).rgb[0] \
     - texture2D(modelTexture, uv).rgb[0];
    if (pixel < 0.0) {
      // the model is brighter than the image
      gl_FragColor = vec4(
        1.0 * asinhStretch(-pixel),
        1.0 * asinhStretch(-pixel),
        0.0,
        1.0
      );
    } else {
      // model is weaker than the image
      gl_FragColor = vec4(
        0.0,
        1.0 * asinhStretch(pixel),
        1.0 * asinhStretch(pixel),
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
    modelTexture: r.prop('texture'),
    imageTexture: r.prop('imageTexture')
  },
  depth: { enable: false },
  attributes: { position: [-2, 0, 0, -2, 2, 2] },
  count: 3
});

export const scaleModel = r => r({
  vert: `
  precision mediump float; attribute vec2 position; varying vec2 uv;
  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`,
  frag: `
  precision highp float;
  uniform sampler2D texture, mask;
  varying vec2 uv;
  vec2 texCoords;
  float pixel;
  ${asinhStretch(0.5)}
  void main () {
    pixel = 0.8 * asinhStretch(texture2D(texture, uv).rgb[0]);
    gl_FragColor = vec4(pixel, pixel, pixel, 1.0);
  }`,
  uniforms: {
    texture: r.prop('texture')
  },
  depth: { enable: false },
  attributes: { position: [-2, 0, 0, -2, 2, 2] },
  count: 3
});

export const maskImage = r => r({
  frag: `
  precision highp float;
  uniform sampler2D texture, mask;
  varying vec2 uv;
  vec2 texCoords;
  float pixel;

  void main () {
    // for some reason the y-axis coords have been mirrored;
    texCoords = vec2(uv[0], 1.0 - uv[1]) * 2.0;
    gl_FragColor = vec4(
      (1.0 - texture2D(mask, uv).rgb) * texture2D(texture, uv).rgb,
      1.0
    );
  }`,
  vert: `
  precision mediump float; attribute vec2 position; varying vec2 uv;
  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`,
  uniforms: {
    texture: r.prop('texture'),
    mask: r.prop('mask')
  },
  depth: { enable: false },
  attributes: { position: [-2, 0, 0, -2, 2, 2] },
  count: 3
});

export const panZoom = r => r({
  frag: `
  precision highp float;
  uniform sampler2D texture;
  uniform float scale;
  uniform vec2 offset;
  varying vec2 uv;
  vec2 texCoords;
  float pixel;

  void main () {
    gl_FragColor = vec4(
      texture2D(texture, (uv * scale + offset)).rgb,
      1.0
    );
  }`,
  vert: `
  precision mediump float; attribute vec2 position; varying vec2 uv;
  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`,
  uniforms: {
    texture: r.prop('texture'),
    scale: r.prop('scale'),
    offset: r.prop('offset')
  },
  depth: { enable: false },
  attributes: { position: [-2, 0, 0, -2, 2, 2] },
  count: 3
});
