import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SignIn from './sign-in';

describe('SignIn', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<SignIn />);
  });

  it('renders without crashing', function () {
    const signInContainer = wrapper.find('div.sign-in-page');
    assert.equal(signInContainer.length, 1);
  });

  describe('heading', function () {
    it('renders signIn.withZooniverse content', function () {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'signIn.withZooniverse');
    });
  });

  describe('tabbed content tabs', function () {
    it('renders two links', function () {
      const linkElements = wrapper.find('Link');
      assert.equal(linkElements.length, 2);
    });
  });

  describe('third party auth', function () {
    it('renders buttons for facebook and google sign in', function () {
      const thirdPartyAuthButtons = wrapper.find('button');
      assert.equal(thirdPartyAuthButtons.length, 2);
    });
  });
});
