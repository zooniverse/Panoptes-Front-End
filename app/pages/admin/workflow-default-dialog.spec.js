import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowDefaultDialog from './workflow-default-dialog';

describe('WorkflowDefaultDialog', () => {
  let wrapper;
  let onSuccessSpy;
  let onCancelSpy;

  before(() => {
    onSuccessSpy = sinon.spy();
    onCancelSpy = sinon.spy();
    wrapper = shallow(<WorkflowDefaultDialog onSuccess={onSuccessSpy} onCancel={onCancelSpy}/>);
  });

  it('renders without crashing', () => {
    const WorkflowDefaultDialogContainer = wrapper.find('div').first();
    assert.equal(WorkflowDefaultDialogContainer.length, 1);
  });

  it('calls the onSuccess handler', () => {
    wrapper.find('button#workflowDefaultDialogSuccess').simulate('click');
    sinon.assert.calledOnce(onSuccessSpy);
  });

  it('calls the onCancel handler', () => {
    wrapper.find('button#workflowDefaultDialogCancel').simulate('click');
    sinon.assert.calledOnce(onCancelSpy);
  });
});
