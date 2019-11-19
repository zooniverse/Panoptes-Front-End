/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import Donate from './donate';

describe('Donate', function () {
  it('renders without crashing', function () {
    shallow(<Donate />);
  });

  it('renders markdown elements', function () {
    const wrapper = shallow(<Donate />);
    const markdownElements = wrapper.find('Markdown');
    assert.equal(markdownElements.length, 4);
  });

  it('renders an image', function () {
    const wrapper = shallow(<Donate />);
    const markdownElements = wrapper.find('img');
    assert.equal(markdownElements.length, 1);
  });
});
