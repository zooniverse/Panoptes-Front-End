import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { browserHistory } from 'react-router';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import { ProjectHomeWorkflowButton } from './home-workflow-button';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

const testWorkflowWithLevel = {
  id: '2342',
  configuration: { level: '1' },
  display_name: 'Beginner Workflow'
};

const testWorkflowWithoutLevel = {
  id: '6757',
  configuration: { },
  display_name: 'Active, no level workflow'
};

const testProject = {
  slug: 'zooniverse/project'
};

const preferences = mockPanoptesResource('project-preferences', {});

const actions = {
  classifier: {
    loadWorkflow: sinon.stub(),
    setWorkflow: sinon.stub()
  },
  translations: {
    load: sinon.stub()
  }
};

const translations = {
  locale: 'en'
};

const user = mockPanoptesResource('user', {});

const fakeEvent = {
  preventDefault: sinon.stub()
};

describe('ProjectHomeWorkflowButton', () => {
  let wrapper;
  let handleWorkflowSelectionSpy;
  before(() => {
    handleWorkflowSelectionSpy = sinon.spy(ProjectHomeWorkflowButton.prototype, 'handleWorkflowSelection');
    sinon.stub(apiClient, 'type').callsFake(() => ({
      get: () => Promise.resolve(testWorkflowWithoutLevel)
    }));
    wrapper = shallow(
      <ProjectHomeWorkflowButton
        actions={actions}
        disabled={false}
        preferences={preferences}
        project={testProject}
        translation={testWorkflowWithoutLevel}
        translations={translations}
        user={user}
        workflow={testWorkflowWithoutLevel}
        workflowAssignment={false}
      />
    );
  });
  afterEach(() => {
    actions.classifier.setWorkflow.resetHistory();
    preferences.update.resetHistory();
  });
  after(() => {
    handleWorkflowSelectionSpy.restore();
    apiClient.type.restore();
  });

  it('renders with default props', () => {
    expect(shallow(<ProjectHomeWorkflowButton />)).to.be.ok;
  });

  it('renders an active button', () => {
    expect(wrapper.find('button').prop('disabled')).to.be.false;
  });

  it('renders the workflow display name as the button label', () => {
    expect(wrapper.render().text()).to.equal(testWorkflowWithoutLevel.display_name);
  });

  describe('on click', () => {
    before(() => {
      wrapper.find('button').simulate('click', fakeEvent);
    });
    after(() => {
      fakeEvent.preventDefault.resetHistory();
    });
    it('calls handleWorkflowSelection onClick', () => {
      expect(handleWorkflowSelectionSpy).to.have.been.calledOnce;
    });

    describe('for a new workflow', () => {
      after(() => {
        actions.classifier.loadWorkflow.resetHistory();
      });

      it('should load the workflow', () => {
        expect(actions.classifier.loadWorkflow).to.have.been.calledWith(testWorkflowWithoutLevel.id, translations.locale, preferences);
      });
    });

    describe('for the current workflow', () => {
      before(() => {
        sinon.stub(browserHistory, 'push');
        wrapper.setProps({ classifierWorkflow: testWorkflowWithoutLevel });
      });

      after(() => {
        browserHistory.push.restore();
        wrapper.setProps({ classifierWorkflow: undefined });
      });

      it('should not load the workflow', () => {
        expect(actions.classifier.loadWorkflow).to.have.not.been.called;
      });

      it('should load the classify page', () => {
        expect(browserHistory.push).to.have.been.calledOnce;
        expect(browserHistory.push).to.have.been.calledWith(`/projects/${testProject.slug}/classify`);
      });
    });
  });

  describe('when props.disabled is true', () => {
    before(() => {
      wrapper = shallow(
        <ProjectHomeWorkflowButton
          disabled={true}
          preferences={preferences}
          project={testProject}
          translation={testWorkflowWithoutLevel}
          workflow={testWorkflowWithoutLevel}
          workflowAssignment={false}
        />
      );
    });

    it('renders a disabled button', () => {
      expect(wrapper.find('button').prop('disabled')).to.be.true;
    });

    it('applies the call-to-action-button--disabled class', () => {
      expect(wrapper.hasClass('project-home-page__button--disabled')).to.be.true;
    });
  });

  describe('when props.workflowAssignment is true', () => {
    before(() => {
      wrapper = shallow(
        <ProjectHomeWorkflowButton
          disabled={false}
          preferences={preferences}
          project={testProject}
          translation={testWorkflowWithoutLevel}
          workflow={testWorkflowWithoutLevel}
          workflowAssignment={true}
        />
      );
    });

    it('renders null when the workflow does not have a level set in its configuration', () => {
      expect(wrapper.isEmptyRender()).to.be.true;
    });

    it('renders a button when the workflow has a level set in its configuration', () => {
      wrapper.setProps({ workflow: testWorkflowWithLevel });
      expect(wrapper.find('button')).to.have.lengthOf(1);
    });

    it('renders a Translate component for the Link text', () => {
      expect(wrapper.find('Translate')).to.have.lengthOf(1);
    });
  });
});
