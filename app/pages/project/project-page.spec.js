import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { sugarClient } from 'panoptes-client/lib/sugar';
import GeordiLogger from '../../lib/zooniverse-logging';
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
      expect(wrapper.find('FieldGuideContainer')).to.have.lengthOf(0);
    });

    it('should display on other project pages', function() {
      const wrapper = shallow(
        <ProjectPage
          project={project}
        >
          <Page />
        </ProjectPage>
      );
      expect(wrapper.find('FieldGuideContainer')).to.have.lengthOf(1);
    });
  });

  describe('on component lifecycle', function () {
    let sugarClientSubscribeSpy;
    let sugarClientUnsubscribeSpy;
    const channel = `project-${project.id}`;

    let geordiRememberSpy;
    let geordiForgetSpy;
    const geordi = new GeordiLogger();

    let wrapper;

    before(function () {
      sugarClientSubscribeSpy = sinon.spy(sugarClient, 'subscribeTo');
      sugarClientUnsubscribeSpy = sinon.spy(sugarClient, 'unsubscribeFrom');
      geordiRememberSpy = sinon.spy(geordi, 'remember');
      geordiForgetSpy = sinon.spy(geordi, 'forget');
    });

    afterEach(function () {
      sugarClientSubscribeSpy.resetHistory();
      sugarClientUnsubscribeSpy.resetHistory();
      geordiRememberSpy.resetHistory();
      geordiForgetSpy.resetHistory();
    });

    after(function () {
      sugarClientSubscribeSpy.restore();
      sugarClientUnsubscribeSpy.restore();
      geordiRememberSpy.restore();
      geordiForgetSpy.restore();
    });

    describe('on mount/unmount', function () {
      beforeEach(function () {
        wrapper = mount(
          <ProjectPage project={project}>
            <Page />
          </ProjectPage>,
          { context: { geordi }}
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

      it('remembers the project slug in geordi projectToken context', function () {
        expect(geordiRememberSpy.calledOnce).to.be.true;
        expect(geordiRememberSpy.calledWith({ projectToken: 'test/project' })).to.be.true;
      });

      it('forgets the project slug in geordi projectToken context', function () {
        wrapper.unmount();
        expect(geordiForgetSpy.calledOnce).to.be.true;
        expect(geordiForgetSpy.calledWith(['projectToken'])).to.be.true;
      })
    });

    describe('on project props change', function () {
      const newProject = { id: '999', title: 'fake project', slug: 'owner/name' };
      const newChannel = `project-${newProject.id}`;
      beforeEach(function () {
        wrapper = shallow(
          <ProjectPage project={project}>
            <Page />
          </ProjectPage>,
          { context: { geordi }}
        );
        wrapper.setProps({ project: newProject });
      });

      it('unsubscribes old project from sugar', function () {
        expect(sugarClientUnsubscribeSpy.calledOnce).to.be.true;
        expect(sugarClientUnsubscribeSpy.calledWith(channel)).to.true;
      });

      it('subscribes new project to sugar', function () {
        expect(sugarClientSubscribeSpy.calledOnce).to.be.true;
        expect(sugarClientSubscribeSpy.calledWith(newChannel)).to.be.true;
      });

      it('remembers new project slug in geordi projectToken context', function () {
        expect(geordiRememberSpy.calledOnce).to.be.true;
        expect(geordiRememberSpy.calledWith({ projectToken: 'owner/name' })).to.be.true;
      });
    });
  });
});
