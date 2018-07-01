/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import TeamPage from './team-page';

describe('TeamPage', function () {
  it('renders without crashing', function () {
    shallow(<TeamPage />);
  });

  it('renders team members', function () {
    const wrapper = shallow(<TeamPage />);
    const teamMemberElements = wrapper.find('.team-member');
    assert.notEqual(teamMemberElements.length, 0);
  });

  it('renders side navigation', function () {
    const wrapper = shallow(<TeamPage />);
    const navItems = wrapper.find('.side-bar-button');
    assert.notEqual(navItems.length, 0);
  });


});
