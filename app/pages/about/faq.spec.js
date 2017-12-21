/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import Faq from './faq';

describe('Faq', function () {
  it('renders without crashing', function () {
    shallow(<Faq />);
  });

  it('renders markdown elements', function () {
    const wrapper = shallow(<Faq />);
    const markdownElements = wrapper.find('Markdown');
    assert.equal(markdownElements.length, 10);
  });
});
