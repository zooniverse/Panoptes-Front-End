// "Passing arrow functions (“lambdas”) to Mocha is discouraged" 
// https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import Admin from './admin';

describe('Admin', function () {

  it('should render without crashing', function () {
    shallow(<Admin />);
  });



});
