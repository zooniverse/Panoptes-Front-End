import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
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

describe('ProjectHomeWorkflowButton', function () {
  let wrapper;
  let handleWorkflowSelectionSpy;
  before(function() {
    handleWorkflowSelectionSpy = sinon.spy(ProjectHomeWorkflowButton.prototype, 'handleWorkflowSelection');
    sinon.stub(apiClient, 'type').callsFake(() => {
      return {
        get: () => Promise.resolve(testWorkflowWithoutLevel)
      }
    });
    wrapper = shallow(
      <ProjectHomeWorkflowButton
        actions={actions}
        disabled={false}
        preferences={preferences}
        project={testProject}
        translations={translations}
        user={user}
        workflow={testWorkflowWithoutLevel}
        workflowAssignment={false}
      />
    );
  });
  afterEach(function () {
    actions.classifier.setWorkflow.resetHistory();
    preferences.update.resetHistory();
  });
  after(function () {
    handleWorkflowSelectionSpy.restore();
    apiClient.type.restore();
  });

  it('renders without crashing', function () {});

  it('renders a Link component', function () {
    expect(wrapper.find('Link')).to.have.lengthOf(1);
    expect(wrapper.find('span')).to.have.lengthOf(0);
  });

  it('renders the workflow display name as the Link text', function() {
    expect(wrapper.render().text()).to.equal(testWorkflowWithoutLevel.display_name);
  });

  it('calls handleWorkflowSelection onClick', function() {
    wrapper.find('Link').simulate('click', fakeEvent);
    expect(handleWorkflowSelectionSpy).to.have.been.calledOnce;
  });

  it('should update user preferences before loadiing a workflow', function () {
    wrapper.instance().handleWorkflowSelection(fakeEvent)
    expect(preferences.update).to.have.been.calledOnce;
  });
  it('should clear the current workflow before loading a workflow', function () {
    wrapper.instance().handleWorkflowSelection(fakeEvent)
    expect(actions.classifier.setWorkflow.firstCall).to.have.been.calledWith(null);
  });
  it('should select a new workflow', function (done) {
    wrapper.instance().handleWorkflowSelection(fakeEvent)
    .then(function () {
      expect(actions.classifier.setWorkflow.secondCall).to.have.been.calledWith(testWorkflowWithoutLevel);
    })
    .then(done, done);
  });
  it('should load workflow translations before loading the workflow', function () {
    wrapper.instance().handleWorkflowSelection(fakeEvent)
    expect(actions.translations.load).to.have.been.calledWith('workflow', testWorkflowWithoutLevel.id, translations.locale);
  });
  it('uses the project slug in the Link href', function() {
    expect(wrapper.find('Link').props().to).to.have.string(testProject.slug);
  });

  describe('when props.disabled is true', function() {
    before(function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButton
          disabled={true}
          preferences={preferences}
          project={testProject}
          workflow={testWorkflowWithoutLevel}
          workflowAssignment={false}
        />
      );
    });

    it('renders a span instead of a Link component', function() {
      expect(wrapper.find('span')).to.have.lengthOf(1);
      expect(wrapper.find('Link')).to.have.lengthOf(0);
    });

    it('applies the call-to-action-button--disabled class', function() {
      expect(wrapper.hasClass('project-home-page__button--disabled')).to.be.true;
    });
  });

  describe('when props.workflowAssignment is true', function() {
    before(function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButton
          disabled={false}
          preferences={preferences}
          project={testProject}
          workflow={testWorkflowWithoutLevel}
          workflowAssignment={true}
        />
      );
    });

    it('renders null when the workflow does not have a level set in its configuration', function() {
      expect(wrapper.isEmptyRender()).to.be.true;
    });

    it('renders a Link when the workflow has a level set in its configuration', function() {
      wrapper.setProps({ workflow: testWorkflowWithLevel });
      expect(wrapper.find('Link')).to.have.lengthOf(1);
    });

    it('renders a Translate component for the Link text', function() {
      expect(wrapper.find('Translate')).to.have.lengthOf(1);
    });
  });
});
