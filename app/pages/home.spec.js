import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import HomePageRoot from './home';

const loggedInUser = {
  loggedIn = true
}

const notLoggedInUser = {
  loggedIn = false
}

describe('HomePageRoot', function () {
  describe('user homepage', function() {
    let wrapper;
    beforeEach(function () {
      wrapper = shallow(<HomePageRoot />)
    })

    it('should render without crashing', function () {
    });

    it('should log user into the logged in home page', function() {

    })
  })

  describe('user not logged in', function() {
    let wrapper;
    beforeEach(function () {
      wrapper = shallow(<HomePageRoot />)
    })

    it('should render without crashing', function () {
    });

    it('should log user into the logged in home page', function() {

    })
  })
}
