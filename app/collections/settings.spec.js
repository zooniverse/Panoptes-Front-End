import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import DisplayNameSlugEditor from '../partials/display-name-slug-editor';
import CollectionSettings from './settings';

const user = {
  id: '2',
  login: 'username'
};

const collection = {
  id: '1',
  display_name: 'A collection',
  private: false,
  slug: 'username/a-collection'
};

describe('<CollectionSettings />', function() {
  describe('renders', function() {
    let wrapper;
    before(function() {
      wrapper = shallow(<CollectionSettings canCollaborate={true} collection={collection} user={user} />, { context: { router: {} } });
    });

    it('without crashing', function() {
      assert.equal(wrapper, wrapper);
    });

    it('<DisplayNameSlugEditor />', function() {
      assert.equal(wrapper.find(DisplayNameSlugEditor).length, 1);
    });

    it('the correct default checked attribute for visibility', function() {
      const privateChecked = wrapper.find('input[type="radio"]').first().props().defaultChecked;
      const publicChecked = wrapper.find('input[type="radio"]').last().props().defaultChecked;
      assert.equal(privateChecked, collection.private);
      assert.notEqual(publicChecked, collection.private);
    });

    it('permission messaging if there is no user', function() {
      wrapper.setProps({ canCollaborate: false, user: null });
      const permissionMessage = wrapper.contains(<p>Not allowed to edit this collection</p>);
      assert(permissionMessage, true);
    });
  });

  describe('delete methods', function() {
    let wrapper;
    let deleteSpy;
    let redirectSpy;
    let deleteButton;
    before(function() {
      wrapper = shallow(<CollectionSettings canCollaborate={true} collection={collection} user={user} />, { context: { router: {} } });
      deleteSpy = sinon.spy(wrapper.instance(), 'deleteCollection');
      redirectSpy = sinon.spy(wrapper.instance(), 'redirect');
      deleteButton = wrapper.find('button');
    });

    it('should open a confirmation dialog when the delete button is clicked', function() {
      deleteButton.simulate('click');
      console.log('wrapper', wrapper.html());
      assert.equal(wrapper.find('.confirm-delete-dialog').length, 1);
    });

    it('should close dialog on cancel', function() {
      const cancelButton = wrapper.find('button.minor-button');
      console.log('cancelButton', cancelButton.html())
    });

    // it('should call this.deleteCollection() when deletion is confirmed', function() {
    //   const yesDeleteButton = wrapper.find('button.major-button');
    //   console.log
    //   assert()
    // });

    // it('should call this.redirect() on the delete event', function() {

    // });
  });
});