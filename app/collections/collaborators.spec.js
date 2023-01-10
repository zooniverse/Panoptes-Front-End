import React from 'react';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { CollectionCollaborators, RoleCreator, RoleRow } from './collaborators';

let resolveMock;

const asyncMock = function () {
  return new Promise(((resolve) => {
    resolveMock = resolve;
  }));
};

const getMetaMock = function () {
  return {
    count: 25,
    page: 1,
    page_count: 2
  };
};

const roleSet = {
  id: '1',
  get: asyncMock,
  getMeta: getMetaMock,
  roles: ['viewer'],
  links: {
    owner: { id: '1' }
  }
};

const roleSets = [
  roleSet,
  {
    id: '2',
    get: asyncMock,
    roles: ['contributor', 'collaborator'],
    links: {
      owner: { id: '2' }
    }
  }
];

const owner = {
  display_name: 'testUser',
  id: '3'
};

describe('<CollectionCollaborators />', () => {
  let wrapper;
  let addUserSpy;
  let deleteUserSpy;
  let componentDidMountStub;
  before(() => {
    addUserSpy = sinon.spy(RoleCreator.prototype, 'handleSubmit');
    deleteUserSpy = sinon.spy(RoleRow.prototype, 'confirmDelete');
    componentDidMountStub = sinon.stub(CollectionCollaborators.prototype, 'componentDidMount');
    wrapper = mount(<CollectionCollaborators owner={owner} />, { context: { router: {}}});
    wrapper.setState({ hasSettingsRole: true, roleSets });
  });

  after(() => {
    addUserSpy.restore();
    deleteUserSpy.restore();
    componentDidMountStub.restore();
  });

  it('should render without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  it('shows three settings options', () => {
    assert.equal(wrapper.find('dl').children().length, 3);
  });

  it('will show a button to remove each user', () => {
    const rowCount = wrapper.find('RoleRow').find('button').length;
    assert.equal(rowCount, 2);
  });

  it('will bold the font of an active role', () => {
    const firstRow = wrapper.find('RoleRow').first();
    assert.equal(firstRow.find('strong').last().text(), 'Viewer');
  });

  it('will allow three roles to be added to a user', () => {
    const creationRoleRows = wrapper.find('RoleCreator').find('dt').length;
    assert.equal(creationRoleRows, 3);
  });

  it('should call this.handleSubmit() when adding a user', () => {
    const addUserButton = wrapper.find('RoleCreator').find('button');
    addUserButton.simulate('click');
    sinon.assert.calledOnce(addUserSpy);
  });

  it('will call this.confirmDelete() when removing a user', () => {
    const removeUserButton = wrapper.find('RoleRow').first().find('button');
    removeUserButton.simulate('click');
    sinon.assert.calledOnce(deleteUserSpy);
  });
});
