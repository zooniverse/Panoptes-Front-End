import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import GeordiLogger from '../../lib/zooniverse-logging';
import { projectWithoutRedirect } from '../../../test/mockObjects';
import ProjectPage from './project-page';
import ProjectNavbar from './components/ProjectNavbar';
import ProjectHomeContainer from './home';

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({ userInterface: { theme: 'light' }})
};

function Page() {
  return (
    <p>Hello world!</p>
  );
}

describe('ProjectPage', () => {
  const project = projectWithoutRedirect;

  it('should render without crashing', () => {
    shallow(<ProjectPage><Page /></ProjectPage>);
  });

  it('should render the project nav bar', () => {
    const wrapper = shallow(<ProjectPage><Page /></ProjectPage>);
    expect(wrapper.find(ProjectNavbar)).to.have.lengthOf(1);
  });

  describe('conditional rendering of the project announcement', () => {
    it('should not render a Markdown component if there is not an announcement', () => {
      const wrapper = shallow(
        <ProjectPage
          project={project}
        >
          <Page />
        </ProjectPage>
      );
      expect(wrapper.find('Markdown')).to.have.lengthOf(0);
    });

    it('should render a Markdown component if there is an announcement', () => {
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

  describe('when the field guide renders', () => {
    beforeEach(() => {
      project.slug = 'test/project';
    });

    it('should not display on the project home page', () => {
      const wrapper = shallow(
        <ProjectPage
          project={project}
        >
          <ProjectHomeContainer />
        </ProjectPage>
      );
      expect(wrapper.find('FieldGuideContainer')).to.have.lengthOf(0);
    });

    it('should display on other project pages', () => {
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

  describe('on component lifecycle', () => {
    let geordiRememberSpy;
    let geordiForgetSpy;
    const geordi = new GeordiLogger();

    let wrapper;

    before(() => {
      geordiRememberSpy = sinon.spy(geordi, 'remember');
      geordiForgetSpy = sinon.spy(geordi, 'forget');
    });

    afterEach(() => {
      geordiRememberSpy.resetHistory();
      geordiForgetSpy.resetHistory();
    });

    after(() => {
      geordiRememberSpy.restore();
      geordiForgetSpy.restore();
    });

    describe('on mount/unmount', () => {
      beforeEach(() => {
        wrapper = mount(
          <ProjectPage project={project}>
            <Page />
          </ProjectPage>,
          {
            context: { geordi },
            wrappingComponent: Provider,
            wrappingComponentProps: { store }
          }
        );
      });

      it('remembers the project slug in geordi projectToken context', () => {
        expect(geordiRememberSpy.calledOnce).to.be.true;
        expect(geordiRememberSpy.calledWith({ projectToken: 'test/project' })).to.be.true;
      });

      it('forgets the project slug in geordi projectToken context', () => {
        wrapper.unmount();
        expect(geordiForgetSpy.calledOnce).to.be.true;
        expect(geordiForgetSpy.calledWith(['projectToken'])).to.be.true;
      });
    });

    describe('on project props change', () => {
      const newProject = { id: '999', title: 'fake project', slug: 'owner/name' };
      const newChannel = `project-${newProject.id}`;
      beforeEach(() => {
        wrapper = shallow(
          <ProjectPage project={project}>
            <Page />
          </ProjectPage>,
          { context: { geordi }}
        );
        geordiRememberSpy.resetHistory();
        wrapper.setProps({ project: newProject });
      });

      it('remembers new project slug in geordi projectToken context', () => {
        expect(geordiRememberSpy.calledOnce).to.be.true;
        expect(geordiRememberSpy.calledWith({ projectToken: 'owner/name' })).to.be.true;
      });
    });
  });
});
