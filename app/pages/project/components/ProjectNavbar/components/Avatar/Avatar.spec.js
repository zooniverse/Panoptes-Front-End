import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Avatar, { StyledAvatarImg, DefaultProjectAvatarWrapper, StyledZooniverseLogo } from './Avatar';
import { projectAvatar, projectWithoutRedirect } from '../../../../../../../test';

describe('Avatar', function() {
  it('should render without crashing', function() {
    shallow(<Avatar src={projectAvatar.src} size={80} />);
  });

  describe('when there is an image source', function() {
    let wrapper;
    before(function() {
      wrapper = shallow(<Avatar src={projectAvatar.src} size={80} />);
    });

    it('should use the projectTitle prop in the alt text if defined', function () {
      const wrapper = shallow(
        <Avatar projectTitle={projectWithoutRedirect.title} src={projectAvatar.src} size={80} />
      );

      expect(wrapper.props().alt.includes(projectWithoutRedirect.title)).to.be.true;
    });

    it('should render StyledAvatarImg', function() {
      expect(wrapper.find(StyledAvatarImg)).to.have.lengthOf(1);
    });
  });

  describe('when there is not an image source', function() {
    let wrapper;
    before(function () {
      wrapper = shallow(<Avatar size={80} />);
    });

    it('should render DefaultProjectAvatarWrapper', function () {
      expect(wrapper.find(DefaultProjectAvatarWrapper)).to.have.lengthOf(1);
    });

    it('should render StyledZooniverseLogo', function () {
      expect(wrapper.find(StyledZooniverseLogo)).to.have.lengthOf(1);
    });
  });
});
