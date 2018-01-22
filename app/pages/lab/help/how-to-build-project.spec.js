/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import HowToBuildProject from './how-to-build-project';

describe('HowToBuildProject', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<HowToBuildProject />);
  });

  it('renders without crashing', function () {
  });

  it('renders all of the text via markdown elements', function () {
    const markdownElements = wrapper.find('div.on-secondary-page').children();
    assert.equal(markdownElements.length, 160);
  });
});
