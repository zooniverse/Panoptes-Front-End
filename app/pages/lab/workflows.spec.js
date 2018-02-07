import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowsPage from './workflows';

const meta = function () {
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
  let reorderWorkflowButton;
  const showCreateWorkflowSpy = sinon.spy();
  const toggleReorderSpy = sinon.spy();

  before(function () {
    wrapper = shallow(
      <WorkflowsPage
        labPath={(url) => { return url; }}
        handleWorkflowReorder={function () {}}
        project={project}
        showCreateWorkflow={showCreateWorkflowSpy}
        toggleReorder={toggleReorderSpy}
      />
    );
    wrapper.setProps({ loading: false });
    reorderWorkflowButton = wrapper.find('[data-button="reorderWorkflow"]');
  });

  it('will display a message when no workflows are present', function () {
    const message = 'No workflows are currently associated with this project.';
    assert.equal(wrapper.contains(<p>{message}</p>), true);
  });

  it('should call the workflow create handler', function () {
    wrapper.find('[data-button="createWorkflow"]').simulate('click');
    sinon.assert.calledOnce(showCreateWorkflowSpy);
  });

  it('should default render the table view', function() {
    wrapper.setProps({ workflows });
    assert.equal(wrapper.find('Paginator').length, 1);
    assert.equal(reorderWorkflowButton.text(), 'Reorder view');
  });

  it('should call the toggleReorder handler', function() {
    reorderWorkflowButton.simulate('click');
    sinon.assert.calledOnce(toggleReorderSpy);
  });

  it('should render the reorderable view after toggled', function() {
    wrapper.setProps({ reorder: true });
    assert.equal(wrapper.find('DragReorderable').length, 1);
    assert.equal(wrapper.find('[data-button="reorderWorkflow"]').text(), 'Table view');
  });

  it('should re-render the table view when table view button is clicked', function() {
    reorderWorkflowButton.simulate('click');
    sinon.assert.calledTwice(toggleReorderSpy);
    wrapper.setProps({ reorder: false });
    assert.equal(wrapper.find('Paginator').length, 1);
    assert.equal(reorderWorkflowButton.text(), 'Reorder view');
  });
});
