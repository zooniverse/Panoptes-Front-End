import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import HomePageRoot from './home';

const user = {
  display_name: 'Test User'
}

const location = {
  hash: '#page'
}

describe('HomePageRoot', function () {
  describe('renders a homepage', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = shallow(<HomePageRoot user={user} location={location} />)
    });

    it('without crashing', function () {
      assert.equal(wrapper, wrapper)
    });

    it('with a user prop', function() {
      const userDisplayName = wrapper.nodes[0].props.user.display_name
      assert.equal(userDisplayName, 'Test User')
    });

    it('with a location prop', function() {
      const location = wrapper.nodes[0].props.location.hash
      assert.equal(location, '#page')
    })
  })

  describe('renders a homepage', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = shallow(<HomePageRoot />)
    })

    it('without crashing', function () {
      assert.equal(wrapper, wrapper)
    });

    it('for a not authenticated user', function() {
      const child = wrapper.children().root.length
      assert.equal(child, 1)
    })

    it('without a user prop', function() {
      const user = wrapper.nodes[0].props.user
      assert.equal(user, undefined)
    });

  })

});
