import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ProjectHomeWorkflowButton from 'home-workflow-button';

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

describe('ProjectHomeWorkflowButton', function() {
  let wrapper;
  before(function() {
    const handleWorkflowSelectionSpy = sinon.spy(ProjectHomeWorkflowButton.prototype, handleWorkflowSelection);
    const onChangePreferencesSpy = sinon.spy();
    wrapper = shallow(
      <ProjectHomeWorkflowButton
        disabled={false}
        onChangePreferences={onChangePreferencesSpy}
        project={testProject}
        workflow={testWorkflowWithoutLevel}
        workflowAssignment={false}
      />
    );
  });
});
