import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { sugarClient } from 'panoptes-client/lib/sugar';
import { project } from '../dev-classifier/mock-data';
import ProjectPage from './project-page';
import ProjectNavbar from './components/ProjectNavbar';
import ProjectHomeContainer from './home/';

function Page() {
  return (
    <p>Hello world!</p>
  );
}

describe('ProjectPage', function () {
  it('should render without crashing', function () {
    shallow(<ProjectPage><Page /></ProjectPage>);
  });

  it('should render the project nav bar', function () {
    const wrapper = shallow(<ProjectPage><Page /></ProjectPage>);
    expect(wrapper.find(ProjectNavbar)).to.have.lengthOf(1);
  });

  describe('conditional rendering of the project announcement', function () {
    it('should not render a Markdown component if there is not an announcement', function () {
      const wrapper = shallow(
        <ProjectPage
          project={project}
        >
          <Page />
        </ProjectPage>
      );
      expect(wrapper.find('Markdown')).to.have.lengthOf(0);
    });

    it('should render a Markdown component if there is an announcement', function () {
      const projectWithAnnouncement = Object.assign({}, project, { configuration: { announcement: 'Big Announcement!' }});
      const wrapper = shallow(
        <ProjectPage
          project={projectWithAnnouncement}
        >
          <Page />
        </ProjectPage>
      );
      const markdown = wrapper.find('Markdown');
      expect(markdown).to.have.lengthOf(1);
      expect(markdown.children().text()).to.equal('Big Announcement!');
    });
  });

  describe('when the field guide renders', function() {
    beforeEach(function() {
      project.slug = 'test/project';
    });

    it('should not display on the project home page', function() {
      const wrapper = shallow(
        <ProjectPage
          project={project}
        >
          <ProjectHomeContainer />
        </ProjectPage>
      );
      expect(wrapper.find('PotentialFieldGuide')).to.have.lengthOf(0);
    });

    it('should display on other project pages', function() {
      const wrapper = shallow(
        <ProjectPage
          project={project}
        >
          <Page />
        </ProjectPage>
      );
      expect(wrapper.find('PotentialFieldGuide')).to.have.lengthOf(1);
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
        expect(sugarClientSubscribeSpy.calledOnce).to.be.true;
        expect(sugarClientSubscribeSpy.calledWith(channel)).to.be.true;
      });

      it('unsubscribes the user from the sugar project channel on unmount', function () {
        wrapper.unmount();
        expect(sugarClientUnsubscribeSpy.calledOnce).to.be.true;
        expect(sugarClientUnsubscribeSpy.calledWith(channel)).to.be.true;
      });
    });

    describe('on project props change', function () {
      const newProject = { id: '999', title: 'fake project', slug: 'owner/name' };
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
        expect(sugarClientUnsubscribeSpy.calledOnce).to.be.true;
        expect(sugarClientUnsubscribeSpy.calledWith(channel)).to.true;
      });

      it('subscribes new project', function () {
        expect(sugarClientSubscribeSpy.calledOnce).to.be.true;
        expect(sugarClientSubscribeSpy.calledWith(newChannel)).to.be.true;
      });
    });
  });
});
