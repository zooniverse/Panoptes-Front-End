import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowsTable from './workflows-table';

const meta = function () {
  return { meta: { page: 1, page_size: 1 }};
};

const workflows = [
  { active: true, id: '1', display_name: 'Rad Workflow', getMeta: meta },
  { active: true, id: '2', display_name: 'Cool Workflow', getMeta: meta }
];

const project = {
  configuration: {}
};

describe('WorkflowsPage', function () {
  let wrapper;

  const workflowStatusChangeSpy = sinon.spy();

  before(function () {
    wrapper = shallow(
      <WorkflowsTable
        labPath={(url) => { return url; }}
        project={project}
        changeStatus={workflowStatusChangeSpy}
        workflows={workflows}
      />
    );
    wrapper.setProps({ loading: false });
  });

  it('will display the correct amount of workflows', function () {
    assert.equal(wrapper.find('Link').length, 2);
  });
});
