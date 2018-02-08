import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import WorkflowsTable from './workflows-table';

const meta = { page: 1, page_size: 1 };

const workflows = [
  { active: false, id: '1', display_name: 'Rad Workflow', getMeta: meta },
  { active: true, id: '2', display_name: 'Cool Workflow', getMeta: meta }
];

const project = {
  configuration: {}
};

describe('WorkflowsTable', function () {
  let wrapper;
  const statusChangeSpy = sinon.spy();
  const statsVisibilityChangeSpy = sinon.spy();
  const completenessTypeChangeSpy = sinon.spy();

  before(function () {
    wrapper = shallow(
      <WorkflowsTable
        labPath={(url) => { return url; }}
        project={project}
        handleSetStatsCompletenessType={completenessTypeChangeSpy}
        handleWorkflowStatsVisibility={statsVisibilityChangeSpy}
        handleWorkflowStatusChange={statusChangeSpy}
        meta={meta}
        workflows={workflows}
      />
    );
  });

  it('should display the correct amount of workflows', function () {
    expect(wrapper.find('Link')).to.have.lengthOf(2);
  });

  it('should call handleWorkflowStatusChange on status checkbox change', function () {
    const statusCheckbox = wrapper.find(`input[name="status.${workflows[0].id}"]`);
    statusCheckbox.simulate('change');
    expect(statusChangeSpy.calledOnce).to.be.true;
  });

  it('should call handleSetStatsCompletenessType on completeness-type-classification change', function () {
    const completenessRadioButton = wrapper.find(`input[value="classification"][name="stats_completeness_type.${workflows[0].id}"]`);
    completenessRadioButton.simulate('change');
    expect(completenessTypeChangeSpy.calledOnce).to.be.true;
    completenessTypeChangeSpy.resetHistory();
  });

  it('should call handleSetStatsCompletenessType on completeness-type-retirement change', function () {
    const completenessRadioButton = wrapper.find(`input[value="retirement"][name="stats_completeness_type.${workflows[0].id}"]`);
    completenessRadioButton.simulate('change');
    expect(completenessTypeChangeSpy.calledOnce).to.be.true;
  });

  it('should call handleWorkflowStatsVisibility on visibility checkbox change', function () {
    const statsVisibilityCheckbox = wrapper.find(`input[name="stats_visible.${workflows[0].id}"]`);
    statsVisibilityCheckbox.simulate('change');
    expect(statsVisibilityChangeSpy.calledOnce).to.be.true;
  });
});
