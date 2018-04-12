/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ResourcesPage from './resources-page';

describe('ResourcesPage', function () {
  it('renders without crashing', function () {
    expect(shallow(<ResourcesPage />)).to.be.ok;
  });
});
