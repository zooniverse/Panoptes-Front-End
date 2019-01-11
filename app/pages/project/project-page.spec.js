import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import GeordiLogger from '../../lib/zooniverse-logging';
import { projectWithoutRedirect } from '../../../test/mockObjects';
import ProjectPage from './project-page';
import ProjectNavbar from './components/ProjectNavbar';
import ProjectHomeContainer from './home/';

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({ userInterface: { theme: 'light' } })
};

function Page() {
  return (
    <p>Hello world!</p>
  );
}

describe('ProjectPage', function () {
  const project = projectWithoutRedirect;

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

    let geordiRememberSpy;
    let geordiForgetSpy;
    const geordi = new GeordiLogger();

    let wrapper;

    before(function () {
      geordiRememberSpy = sinon.spy(geordi, 'remember');
      geordiForgetSpy = sinon.spy(geordi, 'forget');
    });

    afterEach(function () {
      geordiRememberSpy.resetHistory();
      geordiForgetSpy.resetHistory();
    });

    after(function () {
      geordiRememberSpy.restore();
      geordiForgetSpy.restore();
    });

    describe('on mount/unmount', function () {
      beforeEach(function () {
        wrapper = mount(
          <ProjectPage project={project}>
            <Page />
          </ProjectPage>,
          { 
            context: { geordi, store },
            childContextTypes: { store: PropTypes.object.isRequired }
          }
        );
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
        geordiRememberSpy.resetHistory();
        wrapper.setProps({ project: newProject });
      });

      it('remembers new project slug in geordi projectToken context', function () {
        expect(geordiRememberSpy.calledOnce).to.be.true;
        expect(geordiRememberSpy.calledWith({ projectToken: 'owner/name' })).to.be.true;
      });
    });
  });
});
