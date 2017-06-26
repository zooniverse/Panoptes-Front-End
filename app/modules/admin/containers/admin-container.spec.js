// "Passing arrow functions (“lambdas”) to Mocha is discouraged" 
// https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import AdminContainer from './admin-container';

describe('AdminContainer', function () {

  it('should render without crashing', function () {
    const props = { user: null };
    shallow(<AdminContainer {...props} />);
  });

  it(`should show a message if you're not signed in`, function () {
    const props = { user: null };
    const wrapper = shallow(<AdminContainer {...props} />);
    assert.strictEqual(wrapper.text(), `You're not signed in.`)
  });

  it(`should show a message if you're signed in, but not an admin`, function () {
    const props = { user: { id: '1' } }
    const wrapper = shallow(<AdminContainer {...props} />);
    assert.strictEqual(wrapper.text(), `You're not an administrator.`);
  });

  it(`should render the admin page if you're signed in as an admin`, function () {
    const props = { user: { id: '1', admin: true } }
    const wrapper = shallow(<AdminContainer {...props} />);
    assert.strictEqual(wrapper.find('Admin').length, 1);
  });

});
