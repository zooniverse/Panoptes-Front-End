// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'],
no-param-reassign: 0 */
/* global describe, it, beforeEach */
import assert from 'assert';
// import sinon from 'sinon';
import { cloneDeep } from 'lodash';

import { hasComp, parseDisk, parseBulge, parseBar, parseSpiralArms } from './parseFunctions';

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

const annotationWithoutShape = cloneDeep(annotations);
annotationWithoutShape.forEach(
  (annotation) => { annotation.value[0].value = []; }
);

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

describe('hasComp', function () {
  it('should return false for an annotation without a drawn shape', function () {
    assert.equal(hasComp(annotationWithoutShape[0]), false);
  });
  it('should return true for an annotation with a drawn shape', function () {
    assert.equal(hasComp(annotations[0]), true);
  });
});

describe('parseDisk', function () {
  it('should return null for an annotation without a drawn shape', function () {
    assert.equal(parseDisk(annotationWithoutShape[0], state), null);
  });
  it('should return component parameters for an annotation with a drawn shape', function () {
    assert.ok(parseDisk(annotations[0], state));
  });
});

describe('parseBulge', function () {
  it('should return null for an annotation without a drawn shape', function () {
    assert.equal(parseBulge(annotationWithoutShape[1], state), null);
  });
  it('should return component parameters for an annotation with a drawn shape', function () {
    assert.ok(parseBulge(annotations[1], state));
  });
});

describe('parseBar', function () {
  it('should return null for an annotation without a drawn shape', function () {
    assert.equal(parseBar(annotationWithoutShape[2], state), null);
  });
  it('should return component parameters for an annotation with a drawn shape', function () {
    assert.ok(parseBar(annotations[2], state));
  });
});

describe('parseSpiralArms', function () {
  const comps = [
    () => null,
    { name: 'disk', mux: 0.8, muy: 408.8, rx: 4, ry: 4, scale: 1, roll: 0, i0: 0.4, n: 1, c: 2 }
  ];
  it('should return an empty list for an annotation without a drawn shape', function () {
    assert.equal(parseSpiralArms(annotationWithoutShape[3], state, []).length, 0);
    assert.equal(parseSpiralArms(annotationWithoutShape[3], state, comps).length, 0);
  });
  it('should return null when not provided with a disk', function () {
    assert.equal(parseSpiralArms(annotations[3], state, []).length, 0);
  });
  it('should return component parameters for an annotation with a drawn shape', function () {
    assert.ok(parseSpiralArms(annotations[3], state, [comps]));
  });
});
