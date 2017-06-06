import React from 'react';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { CollectionCollaborators, RoleRow } from './collaborators';

let resolveMock;

const asyncMock = () => {
  return new Promise(function (resolve) {
    resolveMock = resolve;
  });
};

const roleSet = {
  id: '1',
  get: asyncMock,
  roles: ['owner']
};

const roleSets = [
  roleSet,
  {
    id: '2',
    get: asyncMock,
    roles: ['contributor', 'collaborator']
  }
];

const owner = {
  display_name: 'testUser'
};

describe('<CollectionCollaborators />', function() {
  let wrapper;

  before(function() {
    const stub = sinon.stub(CollectionCollaborators.prototype, 'componentDidMount');
    wrapper = mount(<CollectionCollaborators />);
    wrapper.setState({ hasSettingsRole: true, roleSets, owner });
    stub.restore();
  });

  it('should render without crashing', function() {
    assert.equal(wrapper, wrapper);
  });

  it('shows four settings options', function() {
    assert.equal(wrapper.find('tbody').children().length, 4);
  });

  it('will show a button to remove each user', function() {
    const rowCount = wrapper.find('RoleRow').find('button').length;
    assert.equal(rowCount, 2);
  });

  it('will bold the font of an active role', function() {
    const rowCount = wrapper.find('RoleRow').first();
    assert.equal(rowCount.find('span').find('strong').text(), 'Owner');
  });
});

describe('<RoleRow />', function() {
  let wrapper;

  before(function() {
    wrapper = shallow(<RoleRow collectionOwner={'testUser'} roleSet={roleSet} />);
    wrapper.setState({ owner });
  });

  it('will disable role options for owner', function() {
    const viewer = wrapper.find('input').last();
    assert.equal(viewer.props().disabled, true);
  });

  it('will not show an option to remove an owner', function() {
    const removeButton = wrapper.find('button').length;
    assert.equal(removeButton, 0);
  });

  it('the correct box should be checked', function() {
    const ownerBox = wrapper.find('input').first();
    assert.equal(ownerBox.props().checked, true);
  });
})
