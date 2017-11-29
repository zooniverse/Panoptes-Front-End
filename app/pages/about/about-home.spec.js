/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import AboutHome from './about-home';

describe('AboutHome', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<AboutHome />);
  });

  it('renders without crashing', function () {
    assert.equal(wrapper, wrapper);
  });

  it('renders five markdown elements', function () {
    const markdownElements = wrapper.find('div.on-secondary-page').children();
    assert.equal(markdownElements.length, 5);
  });
});
