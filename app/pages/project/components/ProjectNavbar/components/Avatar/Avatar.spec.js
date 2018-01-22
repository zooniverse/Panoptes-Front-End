import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Avatar from './Avatar';
import { projectAvatar, projectWithoutRedirect } from '../../testHelpers';

describe('Avatar', function() {
  it('should render without crashing', function() {
    shallow(<Avatar src={projectAvatar.src} size={80} />);
  });

  it('should use the projectTitle prop in the alt text if defined', function() {
    const wrapper = shallow(
      <Avatar projectTitle={projectWithoutRedirect.title} src={projectAvatar.src} size={80} />
    );

    expect(wrapper.props().alt.includes(projectWithoutRedirect.title)).to.be.true;
  });
});
