import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import ProjectHome from './project-home';

const activeWorkflows = [
  { active: true, id: '34' }
];

const background = { src: 'background.jpg' };

const organization = { display_name: 'My organization', slug: 'zooniverse/my-organization' };

const project = {
  configuration: {},
  description: 'Project description',
  display_name: 'Identify Animals',
  experimental_tools: [''],
  id: '123',
  slug: 'zooniverse/identify-animals',
  urls: [
    {
      label: '',
      path: 'findthething',
      site: 'facebook.com/',
      url: 'https://www.facebook.com/find-the-thing'
    }
  ],
  links: {
    active_workflows: ['1']
  }
};

const talkSubjects = [
  { id: '1', locations: [{ 'image/png': 'subject1.png' }] },
  { id: '2', locations: [{ 'image/png': 'subject2.png' }] },
  { id: '3', locations: [{ 'image/png': 'subject3.png' }] }
];

const translation = {
  description: 'translated description',
  display_name: 'translated display_name',
  researcher_quote: 'translated researcher_quote',
  title: 'translated title'
};

const user = {
  id: '242'
};

describe('ProjectHome', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(
      <ProjectHome
        activeWorkflows={activeWorkflows}
        background={background}
        project={project}
        researcherAvatar={''}
        translation={translation}
      />
    );
  });

  it('should render without crashing', function() {});

  it('should render ProjectHomeWorkflowButtons', function() {
    expect(wrapper.find('ProjectHomeWorkflowButtons')).to.have.lengthOf(1);
  });

  it('should render ProjectMetadata', function() {
    expect(wrapper.find('ProjectMetadata')).to.have.lengthOf(1);
  });

  describe('with a launch-approved project', function () {
    project.launch_approved = true;
    wrapper = shallow(
      <ProjectHome
        project={project}
        background={background}
        translation={translation}
      />);
    const disclaimer = wrapper.find({ content: 'project.disclaimer' });
    it('should not render the Zooniverse disclaimer.', function () {
      expect(disclaimer).to.have.lengthOf(0);
    });
  });

  describe('without approval', function () {
    project.launch_approved = false;
    wrapper = shallow(
      <ProjectHome
        project={project}
        background={background}
        translation={translation}
      />);
    const disclaimer = wrapper.find({ content: 'project.disclaimer' });
    it('should render the Zooniverse disclaimer.', function () {
      expect(disclaimer).to.have.lengthOf(1);
    });
  });

  describe('when the project is not complete', function() {
    it('should not render FinishedBanner', function() {
      expect(wrapper.find('FinishedBanner')).to.have.lengthOf(0);
    });
  });

  describe('when the project is complete', function() {
    before(function() {
      wrapper.setProps({ projectIsComplete: true });
    });
    after(function() {
      wrapper.setProps({ projectIsComplete: false });
    });

    it('should render FinishedBanner if props.projectIsComplete is true', function() {
      expect(wrapper.find('FinishedBanner')).to.have.lengthOf(1);
    });
  });

  describe('when the project is not linked to an organization', function() {
    it('should not render a Link component linking to the organization', function() {
      expect(wrapper.find({ to: `/organizations/${organization.slug}` })).to.have.lengthOf(0);
    });

    it('should use the class .project-home-page__description--top-padding', function() {
      expect(wrapper.find('.project-home-page__description--top-padding')).to.have.lengthOf(1);
    });
  });

  describe('when the project is linked to an organization', function() {
    before(function() {
      wrapper.setProps({ organization });
    });

    it('should render a Link component linking to the organization', function() {
      expect(wrapper.find({ to: `/organizations/${organization.slug}` })).to.have.lengthOf(1);
    });

    it('should not use the class .project-home-page__description--top-padding', function() {
      expect(wrapper.find('.project-home-page__description--top-padding')).to.have.lengthOf(0);
    });

    it('should render a Translation component for the Link text', function() {
      const link = wrapper.find({ to: `/organizations/${organization.slug}` });
      expect(link.find('Translate')).to.have.lengthOf(1);
    });
  });

  describe('when the project does not have a redirect', function() {
    it('should render a Link component to the project about page', function() {
      expect(wrapper.find({ to: `/projects/${project.slug}/about` })).to.have.lengthOf(1);
    });

    it('should render a Translate component for the about page Link text', function() {
      expect(wrapper.find({ to: `/projects/${project.slug}/about` }).find('Translate')).to.have.lengthOf(1);
    });

    it('should render a Link component to the classify page if props.showWorkflowButtons is false', function() {
      expect(wrapper.find({ to: `/projects/${project.slug}/classify` })).to.have.lengthOf(1);
    });

    it('should render a Translate component for the about page Link text', function() {
      expect(wrapper.find({ to: `/projects/${project.slug}/classify` }).find('Translate')).to.have.lengthOf(1);
    });
  });

  describe('when the project does have a redirect', function() {
    before(function() {
      const projectWithRedirect = Object.assign({}, project, { redirect: 'https://identifyanimals.org' });
      wrapper.setProps({ project: projectWithRedirect });
    });

    it('should not render a Link component to the project about page', function() {
      expect(wrapper.find({ to: `/projects/${project.slug}/about` })).to.have.lengthOf(0);
    });

    it('should not render a Link component to the classify page', function() {
      expect(wrapper.find({ to: `/projects/${project.slug}/classify` })).to.have.lengthOf(0);
    });

    it('should render an html anchor tag linked to the redirect url', function() {
      expect(wrapper.find('a.project-home-page__button')).to.have.lengthOf(1);
    });

    it('should render a Translate component for the anchor tag text', function() {
      expect(wrapper.find('a.project-home-page__button').find('Translate')).to.have.lengthOf(1);
    });
  });

  describe('when there are not talk subject', function() {
    it('should not render subject talk divs', function() {
      expect(wrapper.find('.project-home-page__talk-image')).to.have.lengthOf(0);
    });
  });

  describe('when there are talk subjects', function() {
    before(function() {
      wrapper.setProps({ talkSubjects });
    });

    it('should render 3 subject talk divs', function() {
      expect(wrapper.find('.project-home-page__talk-image')).to.have.lengthOf(3);
    });

    it('should render 3 Link components for each subject', function() {
      talkSubjects.forEach((subject) => {
        expect(wrapper.find({ to: `/projects/${project.slug}/talk/subjects/${subject.id}` })).to.have.lengthOf(1);
      });
    });

    it('should render 3 Thumbnail components for each subject', function() {
      talkSubjects.forEach((subject) => {
        expect(wrapper.find({ src: subject.locations[0]['image/png'] })).to.have.lengthOf(1);
      });
    });

    it('should render a TalkStatus component', function() {
      expect(wrapper.find('TalkStatus')).to.have.lengthOf(1);
    });
  });

  describe('when a project does not have a researcher quote', function() {
    it('should not render the researcher quote div', function() {
      expect(wrapper.find('.project-home-page__researcher-words')).to.have.lengthOf(0);
    });
  });

  describe('when a project has a researcher quote', function() {
    before(function() {
      const projectWithResearcherQuote = Object.assign({}, project, { researcher_quote: 'Important thoughts!' });
      wrapper.setProps({ project: projectWithResearcherQuote });
    });

    it('should render the researcher quote div', function() {
      expect(wrapper.find('.project-home-page__researcher-words')).to.have.lengthOf(1);
    });

    it('should use the default avatar if props.researcherAvatar is not defined', function() {
      expect(wrapper.find({ src: '/assets/simple-avatar.png' })).to.have.lengthOf(1);
    });

    it('should use props.researcherAvatar if it is defined', function() {
      const researcherAvatar = 'researcher.png';
      wrapper.setProps({ researcherAvatar });
      expect(wrapper.find({ src: researcherAvatar })).to.have.lengthOf(1);
    });
  });

  describe('the project about section', function() {
    it('should render a Translate component', function() {
      expect(wrapper.find({ content: 'project.home.about' })).to.have.lengthOf(1);
    });

    it('should not render a Markdown component if there is no project introduction', function() {
      expect(wrapper.find('.project-home-page__about-text').find('Markdown')).to.have.lengthOf(0);
    });

    it('should render a Markdown component if there is a project introduction', function() {
      const projectWithIntroduction = Object.assign({}, project, { introduction: 'Please help our project' });

      wrapper.setProps({ project: projectWithIntroduction });
      expect(wrapper.find('.project-home-page__about-text').find('Markdown')).to.have.lengthOf(1);
    });
  });

  describe('when there is a workflow.assignment split test', function() {
    const splitsMock = { doPromote: {}, doNotPromote: {} }
    splitsMock.doPromote['workflow.assignment'] = {
      key: 'workflow.assignment',
      name: 'Workflow Promotion',
      state: 'active',
      type: 'splits',
      variant: {
        name: 'Promote',
        type: 'variants',
        value: {
          div: true,
          link: false,
          only_new_users: false,
          workflow_id: '2333'
        }
      }
    };

    splitsMock.doNotPromote['workflow.assignment'] = {
      key: 'workflow.assignment',
      name: 'Workflow Promotion',
      state: 'active',
      type: 'splits',
      variant: {
        name: 'Do Not Promote',
        type: 'variants',
        value: {
          div: false,
          link: true,
          only_new_users: false,
          workflow_id: '2758'
        }
      }
    }

    const projectWithWorkflowAssignment = Object.assign({}, project, {
      classifiers_count: 1,
      classifications_count: 1,
      completeness: 0.10,
      experimental_tools: ['workflow assignment'],
      subjects_count: 1,
      retired_subjects_count: 0
    })

    describe('when the split is to promote', function() {
      before(function () {
        // Using mount so the VisibilitySplit code will actually run
        wrapper = mount(
          <ProjectHome
            project={projectWithWorkflowAssignment}
            background={background}
            splits={splitsMock.doPromote}
            showWorkflowButtons={true}
            translation={translation}
          />
        );
      });

      it('should render the ProjectHomeWorkflowButtons', function() {
        expect(wrapper.find('ProjectHomeWorkflowButtons')).to.have.lengthOf(1);
      });

      it("should not render a 'Get Started' link to the classify page", function() {
        expect(wrapper.find({ to: `/projects/${project.slug}/classify` })).to.have.lengthOf(0);
      });
    });

    describe('when the split is to not promote', function () {
      before(function () {
        wrapper = mount(
          <ProjectHome
            project={projectWithWorkflowAssignment}
            background={background}
            splits={splitsMock.doNotPromote}
            showWorkflowButtons={true}
            translation={translation}
          />
        );
      });

      it('should not render the ProjectHomeWorkflowButtons', function () {
        expect(wrapper.find('ProjectHomeWorkflowButtons')).to.have.lengthOf(0);
      });

      it("should render a 'Get Started' link to the classify page", function () {
        expect(wrapper.find({ to: `/projects/${project.slug}/classify` })).to.have.lengthOf(1);
      });
    });
  });
});
