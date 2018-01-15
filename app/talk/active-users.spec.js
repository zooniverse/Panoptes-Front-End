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
  const wrapper = shallow(<ActiveUsers />);
  const controller = wrapper.instance();
  const getActiveIdsStub = sinon.stub(controller, 'getActiveUserIds').callsFake(() => Promise.resolve(activeIds));
  const fetchUsersSpy = sinon.spy(controller, 'fetchUncachedUsers');
  const pageCountSpy = sinon.spy(controller, 'pageCount');
  const boundedPageSpy = sinon.spy(controller, 'boundedPage');
  const userIdSpy = sinon.spy(controller, 'userIdsOnPage');
  wrapper.setState({ users });

  it('should render without crashing', function() {
  });

  it('should render the correct number of users', function() {
    assert.equal(wrapper.find('li').length, 2);
  });

  before(() => {
    controller.update();
  });

  it('should call all expected functions with update()', function() {
    sinon.assert.calledOnce(getActiveIdsStub);
    sinon.assert.calledOnce(boundedPageSpy);
    sinon.assert.calledOnce(userIdSpy);
    sinon.assert.calledWith(fetchUsersSpy, activeIds);
    sinon.assert.calledWith(pageCountSpy, activeIds);
  });
});
