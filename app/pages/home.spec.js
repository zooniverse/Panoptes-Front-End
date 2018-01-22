import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import HomePageRoot from './home';

const user = {
  display_name: 'Test User'
};

const location = {
  hash: '#page'
};

describe('HomePageRoot', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<HomePageRoot />);
  });

  it('renders <HomePageNotLoggedIn /> when there isn\'t a user', function () {
    assert.equal(wrapper.find('HomePage').length, 1);
    assert.equal(wrapper.find('HomePageForUser').length, 0);
  });

  it('renders <HomePageLoggedIn /> when there is a user', function () {
    wrapper.setProps({ user, location });
    assert.equal(wrapper.find('HomePage').length, 0);
    assert.equal(wrapper.find('HomePageForUser').length, 1);
  });
});
