import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ProjectNavbarContainer from './ProjectNavbarContainer';
import {
  background,
  organization,
  projectAvatar,
  projectRoles,
  projectWithoutRedirect,
  randomUser,
  translation,
  workflow
} from '../../../../../test';

describe('ProjectNavbarContainer', function() {
  let wrapper;
  const getNavLinksSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getNavLinks');
  const getOrganizationLinkSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getOrganizationLink');
  const getProjectLinksSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getProjectLinks');

  before(function() {
    getNavLinksSpy.resetHistory();
    getProjectLinksSpy.resetHistory();
    getOrganizationLinkSpy.resetHistory();

    wrapper = shallow(
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

  it('should call getNavLinks on render', function() {
    expect(getNavLinksSpy.calledOnce).to.be.true;
  });

  it('should call getProjectLinks on render', function() {
    expect(getProjectLinksSpy.calledOnce).to.be.true;
  });

  it('should call getOrganizationLink on render', function() {
    expect(getOrganizationLinkSpy.calledOnce).to.be.true;
  });

  it('renders ProjectNavbar', function() {
    expect(wrapper.find('ProjectNavbar')).to.have.lengthOf(1);
  });
});
