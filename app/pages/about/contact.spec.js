/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import Contact from './contact';

describe('Contact', function () {
  it('renders without crashing', function () {
    shallow(<Contact />);
  });

  it('renders markdown elements', function () {
    const wrapper = shallow(<Contact />);
    const markdownElements = wrapper.find('Markdown');
    assert.equal(markdownElements.length, 6);
  });
});
