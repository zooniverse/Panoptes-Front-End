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

describe('ProjectNavbarContainer', () => {
  let wrapper;
  const getNavLinksSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getNavLinks');
  const getOrganizationLinkSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getOrganizationLink');
  const getProjectLinksSpy = sinon.spy(ProjectNavbarContainer.prototype, 'getProjectLinks');

  before(() => {
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

  it('should render without crashing', () => {});

  it('should call getNavLinks on render', () => {
    expect(getNavLinksSpy.calledOnce).to.be.true;
  });

  it('should call getProjectLinks on render', () => {
    expect(getProjectLinksSpy.calledOnce).to.be.true;
  });

  it('should call getOrganizationLink on render', () => {
    expect(getOrganizationLinkSpy.calledOnce).to.be.true;
  });

  it('renders ProjectNavbar', () => {
    expect(wrapper.find('ProjectNavbar')).to.have.lengthOf(1);
  });
});
