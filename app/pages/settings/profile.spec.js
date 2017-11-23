import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import CustomiseProfile from './profile';

const resources = {
  avatar: {
    src: '//zooniverse.org/images/avatar.jpg',
    delete() {}
  },
  profile_header: {
    src: '//zooniverse.org/images/header.jpg',
    delete() {}
  }
};

const user = {
  get(type) {
    return Promise.resolve([resources[type]]);
  }
};

describe('CustomiseProfile', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<CustomiseProfile user={user} />);
  });

  beforeEach(() => wrapper.update());

  it('renders the user avatar', () => {
    const avatar = wrapper.find('ImageSelector[src="//zooniverse.org/images/avatar.jpg"]');
    assert.equal(avatar.length, 1);
  });

  it('renders the user background', () => {
    const avatar = wrapper.find('ImageSelector[src="//zooniverse.org/images/header.jpg"]');
    assert.equal(avatar.length, 1);
  });

  it('deletes the avatar when Clear Avatar is pressed', () => {
    wrapper.find('button').first().simulate('click');
    setTimeout(() => assert.equal(wrapper.update().state().avatar, {}));
  });

  it('deletes the profile header when Clear Header is pressed', () => {
    wrapper.find('button').last().simulate('click');
    setTimeout(() => assert.equal(wrapper.update().state().profile_header, {}));
  });
});
