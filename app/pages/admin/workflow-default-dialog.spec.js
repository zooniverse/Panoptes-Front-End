import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowDefaultDialog from './workflow-default-dialog';

const dialogText = 'You are about to make the default workflow inactive, which will remove the default setting from this workflow. The default workflow can be set in the workflows page of the project builder.'; // eslint-disable-line max-len

describe('WorkflowDefaultDialog', () => {
  let wrapper;
  let onSuccessSpy;

  before(() => {
    onSuccessSpy = sinon.spy();
    wrapper = shallow(<WorkflowDefaultDialog onSuccess={onSuccessSpy} />);
  });

  it('renders without crashing', () => {
    const WorkflowDefaultDialogContainer = wrapper.find('div').first();
    assert.equal(WorkflowDefaultDialogContainer.length, 1);
  });

  it('renders dialog text', () => {
    assert.equal(wrapper.find('div').last().text(), dialogText);
  });

  it('calls the onSuccess handler', () => {
    wrapper.find('button').simulate('submit');
    sinon.assert.calledOnce(onSuccessSpy);
  });
});
