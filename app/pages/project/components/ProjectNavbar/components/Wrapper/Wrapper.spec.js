/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Wrapper from './Wrapper';

describe('Wrapper', function () {
  it('should render without crashing', function () {
    shallow(<Wrapper />);
  });
});