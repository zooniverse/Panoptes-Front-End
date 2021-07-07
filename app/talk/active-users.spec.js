import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ActiveUsers from './active-users';

const activeIds = ['1', '2'];
const users = [
  { id: '1', display_name: 'Test_User_1', login: 'testUser1' },
  { id: '2', display_name: 'Test_User_2', login: 'testUser2' }
];

describe('ActiveUsers', function () {
  let getActiveIdsStub;
  let pageCountSpy;
  let boundedPageSpy;
  let userIdSpy;
  let fetchUsersStub;
  let wrapper;

  before(function () {
    getActiveIdsStub = sinon.stub(ActiveUsers.prototype, 'getActiveUserIds').callsFake(() => Promise.resolve(activeIds));
    pageCountSpy = sinon.spy(ActiveUsers.prototype, 'pageCount');
    boundedPageSpy = sinon.spy(ActiveUsers.prototype, 'boundedPage');
    userIdSpy = sinon.spy(ActiveUsers.prototype, 'userIdsOnPage');
    fetchUsersStub = sinon.stub(ActiveUsers.prototype, 'fetchUncachedUsers').callsFake(() => Promise.resolve(users));
    wrapper = shallow(<ActiveUsers />);
  });

  after(function () {
    const spiesandStubs = [
      getActiveIdsStub,
      pageCountSpy,
      boundedPageSpy,
      userIdSpy,
      fetchUsersStub
    ];
    spiesandStubs.forEach(spy => spy.restore());
    // ensure we unmount to unset the saved timers
    wrapper.unmount();
  });

  it('should render without crashing', function() {
    expect(wrapper.instance()).to.be.instanceOf(ActiveUsers);
  });

  it('should render the correct number of users', function() {
    expect(wrapper.find('li')).to.have.lengthOf(2);
  });

  it('should call all expected functions on mount', function() {
    sinon.assert.calledOnce(getActiveIdsStub);
    sinon.assert.calledOnce(boundedPageSpy);
    sinon.assert.calledOnce(userIdSpy);
    sinon.assert.calledWith(fetchUsersStub, activeIds);
    sinon.assert.calledWith(pageCountSpy, activeIds);
  });
});
