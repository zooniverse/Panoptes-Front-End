import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ProjectHomeWorkflowButton from './home-workflow-button';
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

describe('ProjectHomeWorkflowButton', function() {
  let wrapper;
  let handleWorkflowSelectionSpy;
  before(function() {
    handleWorkflowSelectionSpy = sinon.spy(ProjectHomeWorkflowButton.prototype, 'handleWorkflowSelection');
    wrapper = shallow(
      <ProjectHomeWorkflowButton
        disabled={false}
        preferences={preferences}
        project={testProject}
        workflow={testWorkflowWithoutLevel}
        workflowAssignment={false}
      />
    );
  });
  after(function () {
    handleWorkflowSelectionSpy.restore();
  });

  it('renders without crashing', function () {});

  it('renders a Link component', function () {
    assert.equal(wrapper.find('Link').length, 1);
    assert.equal(wrapper.find('span').length, 0);
  });

  it('renders the workflow display name as the Link text', function() {
    assert.equal(wrapper.render().text(), testWorkflowWithoutLevel.display_name);
  });

  it('calls handleWorkflowSelection onClick', function() {
    wrapper.find('Link').simulate('click');
    assert.equal(handleWorkflowSelectionSpy.calledOnce, true);
    assert.equal(preferences.update.calledOnce, true);
  });

  it('uses the project slug in the Link href', function() {
    assert.equal(wrapper.find('Link').props().to.includes(testProject.slug), true);
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
      assert.equal(wrapper.find('span').length, 1);
      assert.equal(wrapper.find('Link').length, 0);
    });

    it('applies the call-to-action-button--disabled class', function() {
      assert.equal(wrapper.hasClass('project-home-page__button--disabled'), true);
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
      assert.equal(wrapper.isEmptyRender(), true);
    });

    it('renders a Link when the workflow has a level set in its configuration', function() {
      wrapper.setProps({ workflow: testWorkflowWithLevel });
      assert.equal(wrapper.find('Link').length, 1);
    });

    it('renders a Translate component for the Link text', function() {
      assert.equal(wrapper.find('Translate').length, 1);
    });
  });
});
