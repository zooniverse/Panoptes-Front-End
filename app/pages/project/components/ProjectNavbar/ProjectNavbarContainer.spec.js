import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ProjectNavbarContainer from './ProjectNavbarContainer';
import {
  adminUser,
  background,
  organization,
  projectAvatar,
  projectRoles,
  projectWithoutRedirect,
  randomUser,
  translation,
  workflow
} from './testHelpers';

describe('ProjectNavbarContainer', function() {
  let wrapper;
  const getExternalLinksSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getExternalLinks');
  const getNavLinksSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getNavLinks');
  const getOrganizationLinkSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getOrganizationLink');
  const getProjectLinksSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getProjectLinks');

  before(function() {
    wrapper = mount(
      <ProjectNavbarContainer
        background={background}
        organization={organization}
        projectAvatar={projectAvatar}
        project={projectWithoutRedirect}
        projectRoles={projectRoles}
        translation={translation}
        user={randomUser}
        workflow={workflow}
      />
    );
  });

  it('should render without crashing', function() {});

  it('renders ProjectNavbar', function() {
    expect(wrapper.find('ProjectNavbar')).to.have.lengthOf(1);
  });

  describe('componentDidMount', function() {
    it('should call getNavLinks', function () {
      expect(getNavLinksSpy.calledOnce).to.be.true;
    });

    it('should call getProjectLinks', function () {
      expect(getProjectLinksSpy.calledOnce).to.be.true;
    });

    it('should call getExternalLinks', function () {
      expect(getExternalLinksSpy.calledOnce).to.be.true;
    });

    it('should call getOrganizationLink', function () {
      expect(getOrganizationLinkSpy.calledOnce).to.be.true;
    });
  });

  describe('componentWillReceiveProps', function() {
    let previousNavLinksState;
    before(function() {
      previousNavLinksState = wrapper.state('navLinks');
      wrapper.setProps({ user: adminUser });
    });

    it('should call getNavLinks', function() {
      expect(getNavLinksSpy.calledTwice).to.be.true;
      expect(previousNavLinksState).to.not.equal(wrapper.state('navLinks'));
    });
  });
});
