import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SignIn from './sign-in';

describe('SignIn', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<SignIn />);
  });

  it('renders without crashing', () => {
    const signInContainer = wrapper.find('div.sign-in-page');
    assert.equal(signInContainer.length, 1);
  });

  describe('heading', () => {
    it('renders signIn.withZooniverse content', () => {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'signIn.withZooniverse');
    });
  });

  describe('tabbed content tabs', () => {
    it('renders two links', () => {
      const linkElements = wrapper.find('Link');
      assert.equal(linkElements.length, 2);
    });
  });
});
