import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ActiveUsers from './active-users';

const activeIds = ['1234', '5678'];
const users = [
  { id: '1', display_name: 'Test_User_1', login: 'testUser1' },
  { id: '2', display_name: 'Test_User_2', login: 'testUser2' }
];

describe('ActiveUsers', function () {
  const getActiveIdsStub = sinon.stub(ActiveUsers.prototype, 'getActiveUserIds').callsFake(() => Promise.resolve(activeIds));
  const fetchUsersSpy = sinon.spy(ActiveUsers.prototype, 'fetchUncachedUsers');
  const pageCountSpy = sinon.spy(ActiveUsers.prototype, 'pageCount');
  const boundedPageSpy = sinon.spy(ActiveUsers.prototype, 'boundedPage');
  const userIdSpy = sinon.spy(ActiveUsers.prototype, 'userIdsOnPage');
  const wrapper = shallow(<ActiveUsers />);
  wrapper.setState({ users });

  it('should render without crashing', function() {
  });

  it('should render the correct number of users', function() {
    assert.equal(wrapper.find('li').length, 2);
  });

  it('should call all expected functions on mount', function() {
    sinon.assert.calledOnce(getActiveIdsStub);
    sinon.assert.calledOnce(boundedPageSpy);
    sinon.assert.calledOnce(userIdSpy);
    sinon.assert.calledWith(fetchUsersSpy, activeIds);
    sinon.assert.calledWith(pageCountSpy, activeIds);
  });
});
