/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import PublicationsPage from './publications-page';

describe('PublicationsPage', function () {
  it('renders without crashing', function () {
    shallow(<PublicationsPage />);
  });

  it('renders side navigation', function () {
    const wrapper = shallow(<PublicationsPage />);
    const navItems = wrapper.find('.side-bar-button');
    assert.notEqual(navItems.length, 0);
  });

});
