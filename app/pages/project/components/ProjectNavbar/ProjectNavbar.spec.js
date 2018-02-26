import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { ProjectNavbar } from './ProjectNavbar';
import { getProjectLinks } from '../helpers';
import {
  buildLinksWithLabels,
  projectOwnerUser,
  projectRoles,
  projectWithoutRedirect,
  workflow
} from '../testHelpers';

describe('ProjectNavbar', function() {
  const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: projectOwnerUser });
  const navLinksWithLabels = buildLinksWithLabels(navLinks);

  it('should render without crashing', function() {
    shallow(
      <ProjectNavbar
        navLinks={navLinksWithLabels}
        projectTitle={projectWithoutRedirect.title}
        width={1024}
      />
    );
  });

  describe('calculating the breakpoint', function() {
    let wrapper;
    // We can't test the actual function because getRenderedSize doesn't work with jsdom
    let setBreakpointStub = sinon.stub(ProjectNavbar.prototype, 'setBreakpoint').callsFake(() => {});

    before(function() {
      setBreakpointStub.resetHistory();
      wrapper = mount(
        <ProjectNavbar
          navLinks={navLinksWithLabels}
          projectTitle={projectWithoutRedirect.title}
          width={1024}
        />
      );
    });

    it('should set the breakpoint state on mount', function() {
      expect(setBreakpointStub.calledOnce).to.be.true;
    });

    it('should not set the breakpoint on update if projectTitle or navLinks do not change', function() {
      wrapper.setProps({ width: 768 });
      expect(setBreakpointStub.calledOnce).to.be.true;
    });

    it('should set the breakpoint on update if the projectTitle changes', function() {
      wrapper.setProps({ projectTitle: 'A new title' });
      expect(setBreakpointStub.calledTwice).to.be.true;
    });

    it('should set the breakpoint on update if the navLinks change', function() {
      const newNavLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: null });
      const newNavLinksWithLabels = buildLinksWithLabels(newNavLinks);
      wrapper.setProps({ navLinks: newNavLinksWithLabels });
      expect(setBreakpointStub.calledThrice).to.be.true;
    });
  });

  describe('rendering children components', function() {
    let wrapper;
    before(function() {
      wrapper = mount(
        <ProjectNavbar
          navLinks={navLinksWithLabels}
          projectTitle={projectWithoutRedirect.title}
          width={1024}
        />
      );
    });

    it('renders ProjectNavbarWide if props.width is greater than state.breakpoint', function() {
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(1);
      expect(wrapper.find('ProjectNavbarNarrow')).to.have.lengthOf(0);
    });

    it('renders ProjectNavbarNarrow if props.width is less than state.breakpoint', function() {
      wrapper.setProps({ width: 400 });
      wrapper.setState({ breakpoint: 768 });
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(0);
      expect(wrapper.find('ProjectNavbarNarrow')).to.have.lengthOf(1);
    });
  });
});
