import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import UserSettings from './user-settings';

describe('UserSettings', () => {
  let wrapper;
  let user = {id: 1, login: "tester"};
  let editUser = {id: 2, login: 'volunteer'};

  it('errors when no user found', () => {
    wrapper = shallow(<UserSettings user={user} />);
    wrapper.setState({ editUser: null });
    assert(wrapper.contains('No user found'));
  });

  it('errors when editing yourself', () => {
    wrapper = shallow(<UserSettings user={user} />);
    wrapper.setState({ editUser: user });
    assert(wrapper.contains("You cannot edit your own account"));
  });

  it('renders without errors if there is a user', () => {
    wrapper = shallow(<UserSettings user={user} />);
    wrapper.setState({ editUser: editUser });
    assert.equal(wrapper.find('UserProperties').length, 1);
    assert.equal(wrapper.find('LimitToggle').length, 1);
    assert.equal(wrapper.find('DeleteUser').length, 1);
    assert.equal(wrapper.find('Projects').length, 1);
  });
});
