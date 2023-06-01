/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import MobileAppPage from './mobile-app';

describe('Mobile App Page', function () {
  it('renders without crashing', function () {
    shallow(<MobileAppPage />);
  });
});
