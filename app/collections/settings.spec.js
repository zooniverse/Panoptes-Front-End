import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import DisplayNameSlugEditor from '../partials/display-name-slug-editor';
import CollectionSettings from './settings';

const collection = {
  id: '1',
  display_name: 'A collection',
  private: false,
  slug: 'username/a-collection'
};

describe('<CollectionSettings />', function() {
  let wrapper;
  let confirmationSpy;
  let deleteButton;
  before(function() {
    confirmationSpy = sinon.spy(CollectionSettings.prototype, 'confirmDelete');
    wrapper = shallow(<CollectionSettings canCollaborate={true} collection={collection} />, { context: { router: {} } });
    deleteButton = wrapper.find('button.error');
  });

  it('should render without crashing', function() {
    assert.equal(wrapper, wrapper);
  });

  it('should render a <DisplayNameSlugEditor /> component', function() {
    assert.equal(wrapper.find(DisplayNameSlugEditor).length, 1);
  });

  it('should render the correct default checked attribute for visibility', function() {
    const privateChecked = wrapper.find('input[type="radio"]').first().props().defaultChecked;
    const publicChecked = wrapper.find('input[type="radio"]').last().props().defaultChecked;
    assert.equal(privateChecked, collection.private);
    assert.notEqual(publicChecked, collection.private);
  });

  it('should render permission messaging if there is no user', function() {
    wrapper.setProps({ canCollaborate: false, user: null });
    const permissionMessage = wrapper.contains(<p>Not allowed to edit this collection</p>);
    assert(permissionMessage, true);
  });

  it('should call this.confirmDelete() when the delete button is clicked', function() {
    deleteButton.simulate('click');
    sinon.assert.calledOnce(confirmationSpy);
  });
});
