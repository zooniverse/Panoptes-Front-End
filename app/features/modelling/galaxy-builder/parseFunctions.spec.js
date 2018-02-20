// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */
import assert from 'assert';
import sinon from 'sinon';
import { cloneDeep } from 'lodash';

import { hasComp, parseDisk, parseBulge, parseBar, parseSpiral } from './parseFunctions';

const annotations = [
  {
    value: [
      {
        task: 'drawDisk',
        value: [{ tool: 0, frame: 1, x: 1.0, y: 1.0, rx: 5.0, ry: 5.0, angle: 0.0 }]
      },
      { task: 'scaleSlider', value: '1' },
      { task: 'intensitySlider', value: '0.4' }
    ],
    task: 'disk'
  },
  {
    value: [
      {
        task: 'drawBulge',
        value: [{ tool: 0, frame: 1, x: 1.0, y: 1.0, rx: 5.0, ry: 5.0, angle: 0.0 }]
      },
      { task: 'scaleSlider', value: '1' },
      { task: 'intensitySlider', value: '0.4' },
      { task: 'sersicSlider', value: '1' }
    ],
    task: 'bulge'
  },
  {
    value: [
      {
        task: 'drawBar',
        value: [{ tool: 0, frame: 1, x: 1.0, y: 1.0, rx: 5.0, ry: 5.0, angle: 0.0 }]
      },
      { task: 'scaleSlider', value: '1' },
      { task: 'intensitySlider', value: '0.4' },
      { task: 'sersicSlider', value: '1' },
      { task: 'shapeSlider', value: '2' }
    ],
    task: 'bar'
  },
  {
    value: [
      {
        task: 'drawSpiral',
        value: [{
          details: [{ value: '0.75' }, { value: '1' }],
          points: [{ x: 275.3, y: 238 }, { x: 275.3, y: 237 }]
        }]
      },
      { task: 'falloffSlider', value: 1.04 }
    ],
    task: 'spiral'
  }
];


const state = {
  size: [512, 512],
  // the canvas is not the same size as is visible
  sizeMultiplier: 0.8,
  model: {
    disk: {
      name: 'disk',
      func: () => null,
      default: { mux: 0, muy: 0, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
    },
    bulge: {
      name: 'bulge',
      func: () => null,
      default: { mux: 100, muy: 100, rx: 10, ry: 15, scale: 5 / 8, roll: 0, i0: 0.75, n: 1, c: 2 }
    },
    bar: {
      name: 'bar',
      func: () => null,
      default: { mux: 100, muy: 100, rx: 5, ry: 5, scale: 5 / 8, roll: 0, i0: 0.75, n: 2, c: 2 }
    },
    spiral: {
      name: 'spiral',
      func: () => null,
      default: { mux: 100, muy: 100, rx: 5, ry: 5, spread: 1, roll: 0, i0: 0.75, n: 2, c: 2, falloff: 1 }
    }
  }
};

const annotationWithoutShape = cloneDeep(annotations);
for (let i = 0; i < annotationWithoutShape.length; i += 1) {
  annotationWithoutShape[i].value[0].value = [];
}

describe('hasComp', function () {
  it('should return false for an annotation without a drawn shape', function () {
    assert.equal(hasComp(annotationWithoutShape[0]), false);
  });
  it('should return true for an annotation with a drawn shape', function () {
    assert.equal(hasComp(annotations[0]), true);
  });
});

// cycle through parse functions, same tests as they only differ in the required annotation shape
[['parseDisk', parseDisk], ['parseBulge', parseBulge], ['parseBar', parseBar]].forEach(
  ([name, f], i) => {
    describe(name, function () {
      it('should return null for an annotation without a drawn shape', function () {
        assert.equal(f(annotationWithoutShape[i], state), null);
      });
      it('should return component parameters for an annotation with a drawn shape', function () {
        assert.ok(f(annotations[i], state));
      });
    });
  }
);

describe('parseSpiral', function () {
  const comps = [
    () => null,
    { name: 'disk', mux: 0.8, muy: 408.8, rx: 4, ry: 4, scale: 1, roll: 0, i0: 0.4, n: 1, c: 2 }
  ];
  it('should return null for an annotation without a drawn shape', function () {
    assert.equal(parseSpiral(annotationWithoutShape[3], state, []), null);
    assert.equal(parseSpiral(annotationWithoutShape[3], state, comps), null);
  });
  it('should return null when not provided with a disk', function () {
    assert.equal(parseSpiral(annotations[3], state, []), null);
  });
  it('should return component parameters for an annotation with a drawn shape', function () {
    assert.ok(parseSpiral(annotations[3], state, [comps]));
  });
});
