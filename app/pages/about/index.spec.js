/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import AboutPage from './index';

describe('AboutPage', function () {
  it('renders without crashing', function () {
    shallow(<AboutPage />);
  });

  it('renders Translate elements', function () {
    const wrapper = shallow(<AboutPage />);
    const translateElements = wrapper.find('Translate');
    assert.equal(translateElements.length, 10);
  });
});
