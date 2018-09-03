import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowDefaultDialog from './workflow-default-dialog';
import Dialog from 'modal-form/dialog';

describe('WorkflowDefaultDialog', function () {
  let wrapper;
  let onSuccessSpy;
  let onCancelSpy;

  before(function () {
    onSuccessSpy = sinon.spy();
    onCancelSpy = sinon.spy();
    wrapper = shallow(<WorkflowDefaultDialog onSuccess={onSuccessSpy} onCancel={onCancelSpy}/>);
  });

  it('renders without crashing', function () {
    const WorkflowDefaultDialogContainer = wrapper.find(Dialog);
    assert.equal(WorkflowDefaultDialogContainer.length, 1);
  });

  it('calls the onSuccess handler', function () {
    wrapper.find('button').first().simulate('click');
    sinon.assert.calledOnce(onSuccessSpy);
  });

  it('calls the onCancel handler', function () {
    wrapper.find('button').last().simulate('click');
    sinon.assert.calledOnce(onCancelSpy);
  });
});
