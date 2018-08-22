import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import UserSettings from './user-settings';

describe('UserSettings', function () {
  let wrapper;
  let user = {id: '1', login: "tester"};
  let editUser = {id: '2', login: 'volunteer'};

  before(function () {
    sinon.stub(UserSettings.prototype, 'getUser').callsFake(() => null);
  });

  after(function () {
    UserSettings.prototype.getUser.restore();
  });

  it('errors when no user found', function () {
    wrapper = shallow(<UserSettings user={user} />);
    wrapper.setState({ editUser: null });
    assert(wrapper.contains('No user found'));
  });

  it('errors when editing yourself', function () {
    wrapper = shallow(<UserSettings user={user} />);
    wrapper.setState({ editUser: user });
    assert(wrapper.contains("You cannot edit your own account"));
  });

  it('renders without errors if there is a user', function () {
    wrapper = shallow(<UserSettings user={user} />);
    wrapper.setState({ editUser: editUser });
    assert.equal(wrapper.find('UserProperties').length, 1);
    assert.equal(wrapper.find('LimitToggle').length, 1);
    assert.equal(wrapper.find('DeleteUser').length, 1);
    assert.equal(wrapper.find('Resources').length, 2);
  });
});
