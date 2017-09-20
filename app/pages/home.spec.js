import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import HomePageRoot from './home';

const user = {
  display_name: 'test'
}

const location = {
  hash: '#page'
}

describe('HomePageRoot', function () {
  // describe('user homepage', function() {
  //   let wrapper;

  //   beforeEach(function () {
  //     wrapper = shallow(<HomePageRoot user={user} location={location} />)
  //   });

  //   it('renders without crashing', function () {
  //     shallow(<HomePageRoot shouldRender={true} />);
  //   });

  //   it('renders the homepage for the user', function() {
  //     shallow(<HomePageLoggedIn shouldRender={true} />);
  //   });

  // })

  // describe('user not logged in homepage', function() {
  //   let wrapper;

  //   beforeEach(function () {
  //     wrapper = shallow(<HomePageRoot user={null} />)
  //   })

  //   it('renders without crashing', function () {
  //     shallow(<HomePageRoot shouldRender={true} />);
  //   });

  //   it('renders homepage for a user who is not logged in', function() {
  //     shallow(<HomePageNotLoggedIn shouldRender={true} />);
  //   })
  // })

});
