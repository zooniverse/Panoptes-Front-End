import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import CustomiseProfile from './CustomiseProfile';

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

describe('CustomiseProfile', function () {
  let wrapper;
  let clearMediaSpy;

  before(function () {
    wrapper = shallow(<CustomiseProfile user={user} />);
    clearMediaSpy = sinon.spy(CustomiseProfile.prototype, 'handleMediaClear');
  });

  beforeEach(function () {
    wrapper.update();
    clearMediaSpy.resetHistory();
  });
  after(function () {
    clearMediaSpy.restore();
  });

  it('renders the user avatar', function () {
    const avatar = wrapper.find('ImageSelector[src="//zooniverse.org/images/avatar.jpg"]');
    assert.equal(avatar.length, 1);
  });

  it('renders the user background', function () {
    const avatar = wrapper.find('ImageSelector[src="//zooniverse.org/images/header.jpg"]');
    assert.equal(avatar.length, 1);
  });

  it('deletes the avatar when Clear Avatar is pressed', function () {
    wrapper.find('button').first().simulate('click');
    sinon.assert.calledOnce(clearMediaSpy);
    sinon.assert.calledWith(clearMediaSpy, 'avatar');
  });

  it('deletes the profile header when Clear Header is pressed', function () {
    wrapper.find('button').last().simulate('click');
    sinon.assert.calledOnce(clearMediaSpy);
    sinon.assert.calledWith(clearMediaSpy, 'profile_header');
  });
});
