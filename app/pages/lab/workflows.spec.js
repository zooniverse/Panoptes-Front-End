import React from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import WorkflowsPage from './workflows';

const meta = () => {
  return { meta: { page: 1, page_size: 1 }};
};

const workflows = [
  { id: '1', display_name: 'Rad Workflow', getMeta: meta },
  { id: '2', display_name: 'Cool Workflow', getMeta: meta }
];

const context = { router: {}};

describe('SubjectSetsPage', function () {
  let wrapper;

  before(function () {
    sinon.stub(WorkflowsPage.prototype, 'componentDidMount');
    wrapper = mount(
      <WorkflowsPage />,
      { disableLifecycleMethods: true, context }
    );
    wrapper.setState({ loading: false, workflows });
  });

  it('will display a message when no workflows are present', function () {
    const message = 'No workflows are currently associated with this project.';
    assert.equal(wrapper.find('p').text(), message);
  });

  // it('will display the correct number of workflows', function () {
  //   wrapper.setState({ workflows });
  //   console.log(wrapper.find('button'));
  //   assert.equal(wrapper.find('a').length, 2);
  // });
  //
  // it('will display workflows as a link', function () {
  // });
  //
  // it('will allow for the creation of a new sworkflow', function () {
  // });
});
