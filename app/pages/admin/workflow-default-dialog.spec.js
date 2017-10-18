import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowDefaultDialog from './workflow-default-dialog';

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

  it('calls the onSuccess handler', () => {
    wrapper.find('button').simulate('submit');
    sinon.assert.calledOnce(onSuccessSpy);
  });
});
