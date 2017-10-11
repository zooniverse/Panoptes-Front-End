const postProcessingRegl = (r) => {
  let convolution = '';
  let c = [0, 0];
  const psfunc = i => (c_, p) => parseFloat(p.metadata.psf[i]);
  const psfObj = {};
  for (let i = 0; i < 121; i += 1) {
    c = [Math.floor(i / 11) - 5, (i % 11) - 5];
    convolution += `texture2D(texture, uv + vec2(${parseFloat(c[0]).toFixed(1)}/texSize[0],`;
    convolution += `${parseFloat(c[1]).toFixed(1)}/texSize[1])) * psf[${i}]`;
    psfObj[`psf[${i}]`] = psfunc(i);
    if (i < (121 - 1)) { convolution += ' + \n'; }
  }
  return [
    // psf convolution
    r({
      frag: `
      precision mediump float;
      uniform sampler2D texture;
      uniform float psf[121];
      uniform vec2 texSize;
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
        psfObj
      ),
      depth: { enable: false },
      attributes: { position: [-2, 0, 0, -2, 2, 2] },
      count: 3
    }),
    // difference calculation
    r({
      frag: `
      precision mediump float;
      uniform sampler2D imageTexture, modelTexture;
      uniform float renorm;
      varying vec2 uv;
      vec2 texCoords;
      float pixel;
      float sinhStretch(float px) {
        return 0.05 * (exp(2.99822 * px) - exp(2.99822 * -px));
      }
      float asinh(float px) {
          return log(px + sqrt(1.0+px*px));
      }
      float asinhStretch(float px) {
        return asinh(px / 0.5) / asinh(0.5);
      }
      void main () {
        // for some reason the y-axis coords have been mirrored;
        texCoords = vec2(uv[0], 1.0 - uv[1]);
        // calculate the difference between model + image (after
        // reversing the asinh stretch on the image)
        pixel = 0.6 * (sinhStretch(texture2D(imageTexture, texCoords).rgb[0]) - renorm) \
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
        imageTexture: r.prop('imageTexture'),
        renorm: (c_, p) => parseFloat(p.metadata.renorm)
      },
      depth: { enable: false },
      attributes: { position: [-2, 0, 0, -2, 2, 2] },
      count: 3
    })
  ];
};

export default postProcessingRegl;
