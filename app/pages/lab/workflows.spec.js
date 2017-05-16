import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowsPage from './workflows';

const meta = () => {
  return { meta: { page: 1, page_size: 1 }};
};

const workflows = [
  { id: '1', display_name: 'Rad Workflow', getMeta: meta },
  { id: '2', display_name: 'Cool Workflow', getMeta: meta }
];

const project = {
  configuration: {}
};

describe('WorkflowsPage', function () {
  let wrapper;
  const newWorkflow = sinon.spy();

  before(function () {
    wrapper = shallow(
      <WorkflowsPage
        labPath={(url) => { return url; }}
        handleWorkflowReorder={() => {}}
        project={project}
        showCreateWorkflow={newWorkflow}
      />
    );
    wrapper.setProps({ loading: false });
  });

  it('will display a message when no workflows are present', function () {
    const message = 'No workflows are currently associated with this project.';
    assert.equal(wrapper.contains(<p>{message}</p>), true);
  });

  it('will display the correct amount of workflows', function () {
    wrapper.setProps({ workflows });
    assert.equal(wrapper.find('DragReorderable').render().find('li').length, 2);
  });

  it('should call the workflow create handler', function () {
    wrapper.find('button').simulate('click');
    sinon.assert.called(newWorkflow);
  });
});
