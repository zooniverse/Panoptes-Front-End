/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import Highlights from './highlights';

describe('Highlights', function () {
  it('renders without crashing', function () {
    shallow(<Highlights />);
  });
});
