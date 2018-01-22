import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { project, workflow } from '../dev-classifier/mock-data';
import ProjectPage from './project-page';
import { sugarClient } from 'panoptes-client/lib/sugar';
import sinon from 'sinon';

function Page() {
  return (
    <p>Hello world!</p>
  );
}

describe('ProjectPage', function () {
  const background = {
    src: 'the project background image url'
  };

  it('should render without crashing', function () {
    shallow(<ProjectPage><Page /></ProjectPage>);
  });

  it('should render the project nav bar', function () {
    const wrapper = shallow(<ProjectPage><Page /></ProjectPage>);
    const navElement = wrapper.find('ProjectNavbar');
    expect(navElement).to.have.lengthOf(1);
  });

  it('should render the project nav bar as its first child', function () {
    const wrapper = shallow(<ProjectPage><Page /></ProjectPage>);
    const navBar = wrapper.children().first().children().first();
    expect(navBar.name()).to.equal('ProjectNavbar');
  });

  it('should pass background, project and workflow props to its children', function () {
    const wrapper = shallow(<ProjectPage background={background} project={project} workflow={workflow}><Page /></ProjectPage>);
    const child = wrapper.find('Page');
    expect(child.props().background).to.equal(background);
    expect(child.props().project).to.equal(project);
    expect(child.props().workflow).to.equal(workflow);
  });

  describe('with a launch-approved project', function () {
    project.launch_approved = true;
    const wrapper = shallow(<ProjectPage project={project} ><Page /></ProjectPage>);
    const disclaimer = wrapper.find('Translate[className="project-disclaimer"]');
    it('should not render the Zooniverse disclaimer.', function () {
      expect(disclaimer).to.have.lengthOf(0);
    });
  });

  describe('without approval', function () {
    project.launch_approved = false;
    const wrapper = shallow(<ProjectPage project={project} ><Page /></ProjectPage>);
    const disclaimer = wrapper.find('Translate[className="project-disclaimer"]');
    it('should render the Zooniverse disclaimer.', function () {
      expect(disclaimer).to.have.lengthOf(1);
    });
    it('should render the disclaimer immediately after its children.', function () {
      expect(wrapper.childAt(1).name()).to.equal('Page');
      expect(wrapper.childAt(2)).to.deep.equal(disclaimer);
    });
  });

  describe('on the home page', function () {
    let wrapper;
    beforeEach(function () {
      project.slug = 'test/project';
      project.configuration = {};
      project.configuration.announcement = 'This is a test announcement';
      const mockLocation = {
        pathname: `/projects/${project.slug}`
      };
      const routes = [];
      routes[2] = {};
      wrapper = shallow(
        <ProjectPage
          location={mockLocation}
          routes={routes}
          project={project}
        >
          <Page />
        </ProjectPage>
      );
    });
    it('should not show the project navigation', function () {
      const navbar = wrapper.find('ProjectNavbar');
      expect(navbar).to.have.lengthOf(0);
    });
    it('should not show any project announcements', function () {
      const announcement = wrapper.find('div.informational.project-announcement-banner');
      expect(announcement).to.have.lengthOf(0);
    });
    it('should not show the field guide', function () {
      const fieldguide = wrapper.find('PotentialFieldGuide');
      expect(fieldguide).to.have.lengthOf(0);
    });
  });

  describe('on other project pages', function () {
    let wrapper;
    beforeEach(function () {
      project.slug = 'test/project';
      project.configuration = {};
      project.configuration.announcement = 'This is a test announcement';
      const mockLocation = {
        pathname: `/projects/${project.slug}/about`
      };
      const routes = [];
      routes[2] = { path: 'about' };
      wrapper = shallow(
        <ProjectPage
          location={mockLocation}
          routes={routes}
          project={project}
        >
          <Page />
        </ProjectPage>
      );
    });
    it('should show the project navigation', function () {
      const navbar = wrapper.find('ProjectNavbar');
      expect(navbar).to.have.lengthOf(1);
    });
    it('should show any project announcements', function () {
      const announcement = wrapper.find('div.informational.project-announcement-banner');
      expect(announcement).to.have.lengthOf(1);
    });
    it('should show the field guide', function () {
      const fieldguide = wrapper.find('PotentialFieldGuide');
      expect(fieldguide).to.have.lengthOf(1);
    });
  });

  describe('on component lifecycle', function () {
    const sugarClientSubscribeSpy = sinon.spy(sugarClient, 'subscribeTo');
    const sugarClientUnsubscribeSpy = sinon.spy(sugarClient, 'unsubscribeFrom');
    const channel = `project-${project.id}`;
    let wrapper;

    afterEach(function () {
      sugarClientSubscribeSpy.resetHistory();
      sugarClientUnsubscribeSpy.resetHistory();
    });

    after(function () {
      sugarClientSubscribeSpy.restore();
      sugarClientUnsubscribeSpy.restore();
    });

    describe('on mount/unmount', function () {
      beforeEach(function () {
        wrapper = mount(
          <ProjectPage project={project}>
            <Page />
          </ProjectPage>
        );
      });

      it('subscribes the user to the sugar project channel on mount', function () {
        expect(sugarClientSubscribeSpy.calledOnce).to.equal(true);
        expect(sugarClientSubscribeSpy.calledWith(channel)).to.equal(true);
      });

      it('unsubscribes the user from the sugar project channel on unmount', function () {
        wrapper.unmount();
        expect(sugarClientUnsubscribeSpy.calledOnce).to.equal(true);
        expect(sugarClientUnsubscribeSpy.calledWith(channel)).to.equal(true);
      });
    });

    describe('on project props change', function () {
      const newProject = {id: '999', title: 'fake project', slug: 'owner/name'};
      const newChannel = `project-${newProject.id}`;
      beforeEach(function () {
        wrapper = shallow(
          <ProjectPage project={project}>
            <Page />
          </ProjectPage>
        );
        wrapper.setProps({ project: newProject });
      });

      it('unsubscribes old project', function () {
        expect(sugarClientUnsubscribeSpy.calledOnce).to.equal(true);
        expect(sugarClientUnsubscribeSpy.calledWith(channel)).to.equal(true);
      });

      it('subscribes new project', function () {
        expect(sugarClientSubscribeSpy.calledOnce).to.equal(true);
        expect(sugarClientSubscribeSpy.calledWith(newChannel)).to.equal(true);
      });
    });
  });
});
