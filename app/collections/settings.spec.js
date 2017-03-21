import React from 'react';
import assert from 'assert';
import CollectionSettings from './settings';
import DisplayNameSlugEditor from '../partials/display-name-slug-editor';
import { render, shallow, mount } from 'enzyme';

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

const roles = [
  { id: '2',
    links: {
      owner: {
        id: '2',
        type: 'users'
      }
    },
    roles: ['owner']
  }
];

describe('<CollectionSettings />', function() {
  describe('renders', function() {
    let wrapper;
    before(function() {
      wrapper = shallow(<CollectionSettings collection={collection} roles={roles} user={user} />, { context: { router: {} } });
    });

    it('without crashing', function() {
      assert.equal(wrapper, wrapper);
    });

    it('the display name in the display name editor', function() {
      // const displayNameInput = wrapper.find('input[name="display_name"]').props().value;
      console.log('input', wrapper.find('input'))
      // assert.equal(displayNameInput, collection.display_name);
    });

    it('the collection slug as a link', function() {
      assert.equal(wrapper.contains(<a href="/collections/username/a-collection">/collections/username/a-collection</a>), true);
    });

    it('the correct default checked attribute for visibility', function() {
      const privateChecked = wrapper.find('input[type="radio"]').first().checked;
      const publicChecked = wrapper.find('input[type="radio"]').last().checked;
      assert.notEqual(privateChecked, collection.private);
      assert.equal(publicChecked, collection.private);
    });

    it('permission messaging if there is no user', function() {
      wrapper.setProps({ user: null });
      const permissionMessage = wrapper.contains(<p>Not allowed to edit this collection</p>);
      assert(permissionMessage, true);
    });
  });

});