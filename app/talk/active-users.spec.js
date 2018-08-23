import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ActiveUsers from './active-users';

const activeIds = ['1234', '5678'];
const users = [
  { id: '1', display_name: 'Test_User_1', login: 'testUser1' },
  { id: '2', display_name: 'Test_User_2', login: 'testUser2' }
];

describe('ActiveUsers', function () {
  let getActiveIdsStub;
  let fetchUsersSpy;
  let pageCountSpy;
  let boundedPageSpy;
  let userIdSpy;
  let wrapper;

  before(function () {
    getActiveIdsStub = sinon.stub(ActiveUsers.prototype, 'getActiveUserIds').callsFake(() => Promise.resolve(activeIds));
    fetchUsersSpy = sinon.spy(ActiveUsers.prototype, 'fetchUncachedUsers');
    pageCountSpy = sinon.spy(ActiveUsers.prototype, 'pageCount');
    boundedPageSpy = sinon.spy(ActiveUsers.prototype, 'boundedPage');
    userIdSpy = sinon.spy(ActiveUsers.prototype, 'userIdsOnPage');
    wrapper = shallow(<ActiveUsers />);
    wrapper.setState({ users });
  });

  after(function () {
    const spies = [
      getActiveIdsStub,
      fetchUsersSpy,
      pageCountSpy,
      boundedPageSpy,
      userIdSpy
    ];
    spies.forEach(spy => spy.restore());
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
    sinon.assert.calledWith(fetchUsersSpy, activeIds);
    sinon.assert.calledWith(pageCountSpy, activeIds);
  });
});
