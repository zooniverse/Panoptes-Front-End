/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import Volunteering from './volunteering';

describe('Volunteering', function () {
  it('renders without crashing', function () {
    shallow(<Volunteering />);
  });

  it('renders markdown elements', function () {
    const wrapper = shallow(<Volunteering />);
    const markdownElements = wrapper.find('Markdown');
    assert.equal(markdownElements.length, 12);
  });
});
