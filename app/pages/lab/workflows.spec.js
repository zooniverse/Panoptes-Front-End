import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import WorkflowsPage from './workflows';

const meta = () => {
  return { meta: { page: 1, page_size: 1 }};
};

const workflows = [
  { id: '1', display_name: 'Rad Workflow', getMeta: meta },
  { id: '2', display_name: 'Cool Workflow', getMeta: meta }
];

const project = { id: '1', configuration: {}};

const createHref = function(channel) { return { bind: function(event, callback) { } }};
const isActive = function(channel) { return { bind: function(event, callback) { } }};
const context = { router: { createHref, isActive }};

describe('WorkflowsPage', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(
      <WorkflowsPage />,
      { disableLifecycleMethods: true, context }
    );
    wrapper.setState({ loading: false });
  });

  it('will display a message when no workflows are present', function () {
    const message = 'No workflows are currently associated with this project.';
    assert.equal(wrapper.find('p').text(), message);
  });

  it('will display the correct amount of workflows', function () {
    wrapper.setState({ workflows, loading: false });
    assert.equal(wrapper.find('DragReorderable').render().find('li').length, 2);
  });

  it('will display a form to create a new workflow', function () {
    wrapper.find('button').simulate('click');
    assert.equal(wrapper.find('WorkflowCreateForm').length, 1);
  });

  it('will display a paginator', function () {
    assert.equal(wrapper.find('Paginator').length, 1);
  });
});
