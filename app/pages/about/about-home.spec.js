/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import AboutHome from './about-home';

describe('AboutHome', function () {
  it('renders without crashing', function () {
    shallow(<AboutHome />);
  });

  it('renders five markdown elements', function () {
    const wrapper = shallow(<AboutHome />);
    const markdownElements = wrapper.find('Markdown');
    assert.equal(markdownElements.length, 5);
  });
});
