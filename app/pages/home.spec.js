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

describe('HomePageRoot', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<HomePageRoot />);
  });

  it('renders <HomePageNotLoggedIn /> when there isn\'t a user', () => {
    assert.equal(wrapper.find('HomePageNotLoggedIn').root.length, 1);
  });

  it('renders <HomePageLoggedIn /> when there is a user', () => {
    wrapper.setProps({ user, location });
    assert.equal(wrapper.find('HomePageLoggedIn').first().length, 1);
  });
});
