import React from 'react';
import assert from 'assert';
import WorldWideTelescope from './world-wide-telescope';
import { shallow } from 'enzyme';

const testSubject = {
  locations: [{ 'image/jpeg': 'http://www.image.com' }],
  metadata: {}
};

const testProject = {
  slug: "zooniverse/test-project"
};

const incompleteAnnotations = [
  { task: 'T0',
    type: 'drawing',
    value: [{
      height: 1000,
      width: 800,
      x: 315,
      y: 130 }]
  },
  { task: 'T1',
    type: 'drawing',
    value: [{
      details: [{ value: '44 00' }],
      x: 880,
      y: 1260
    }] },
  { task: 'T2',
    type: 'drawing',
    value: [{
      details: [{ value: 0 }],
      x: 660,
      y: 1310
    }] }
];

// These annotations are for two completely annotated charts
const testAnnotations = [
  { task: 'T0',
    type: 'drawing',
    value: [{
      height: 275,
      width: 375,
      x: 485,
      y: 185 },
    {
      height: 260,
      width: 540,
      x: 530,
      y: 730 }]
  },
  { task: 'T1',
    type: 'drawing',
    value: [{
      details: [{ value: '44 00' }],
      x: 1025,
      y: 1010
    },
    {
      details: [{ value: '44 00' }],
      x: 820,
      y: 490
    },
    {
      details: [{ value: '14 46 00' }],
      x: 555,
      y: 1010
    },
    {
      details: [{ value: '14 46 00' }],
      x: 520,
      y: 490
    },
    {
      details: [{ value: '-62 35' }],
      x: 495,
      y: 935
    },
    {
      details: [{ value: '-62 35' }],
      x: 445,
      y: 430
    },
    {
      details: [{ value: '-62 10' }],
      x: 460,
      y: 195
    },
    {
      details: [{ value: '-62 10' }],
      x: 490,
      y: 755
    }] },
  { task: 'T2',
    type: 'drawing',
    value: [{
      details: [{ value: 0 }],
      x: 790,
      y: 1050
    },
    {
      details: [{ value: 0 }],
      x: 670,
      y: 515
    },
    {
      details: [{ value: 2 }],
      x: 445,
      y: 305
    },
    {
      details: [{ value: 2 }],
      x: 470,
      y: 835
    }] }
];

const testWorkflow = {
  tasks: {
    T0: { type: 'drawing' },
    T1: { type: 'drawing' },
    T2: { type: 'drawing' }
  }
};

describe('WorldWideTelescope render without incomplete annotations', function () {
  it('will render an empty div with no annotations', function() {
    const page = shallow(<WorldWideTelescope subject={testSubject} />);
    assert.equal(page.find('div').children().length, 0)
  });

  it('will render an empty div with incomplete annotations', function() {
    const page = shallow(<WorldWideTelescope subject={testSubject} workflow={testWorkflow} project={testProject} annotations={incompleteAnnotations} />);
    assert.equal(page.find('div').children().length, 0)
  });
});

describe('WorldWideTelescope with classification', function() {
  let wrapper;

  before(function () {
    wrapper = shallow(<WorldWideTelescope subject={testSubject} annotations={testAnnotations} workflow={testWorkflow} project={testProject} />);
  });

  it('will render a WWT link for each full classification', function() {
    const linkInstances = wrapper.find('.standard-button');
    assert.equal(linkInstances.length, 2);
  });

  it('will render a cropped image for each fully classified chart', function() {
    const image = wrapper.find('img');
    assert.equal(image.length, 2);
  });

  it('will render text about misaligned images', function() {
    const content = wrapper.find('.worldwide-telescope__content');
    content.forEach((node) => {
      assert.equal(node.childAt(1).type(), 'p');
    })
  });
});
