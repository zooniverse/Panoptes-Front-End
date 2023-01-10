import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Dialog from 'modal-form/dialog';
import WorkflowDefaultDialog from './workflow-default-dialog';

describe('WorkflowDefaultDialog', () => {
  let wrapper;
  let onSuccessSpy;
  let onCancelSpy;

  before(() => {
    onSuccessSpy = sinon.spy();
    onCancelSpy = sinon.spy();
    wrapper = shallow(<WorkflowDefaultDialog onSuccess={onSuccessSpy} onCancel={onCancelSpy} />);
  });

  it('renders without crashing', () => {
    const WorkflowDefaultDialogContainer = wrapper.find(Dialog);
    assert.equal(WorkflowDefaultDialogContainer.length, 1);
  });

  it('calls the onSuccess handler', () => {
    wrapper.find('button').first().simulate('click');
    sinon.assert.calledOnce(onSuccessSpy);
  });

  it('calls the onCancel handler', () => {
    wrapper.find('button').last().simulate('click');
    sinon.assert.calledOnce(onCancelSpy);
  });
});
