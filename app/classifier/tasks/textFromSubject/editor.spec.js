/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

import TextFromSubjectEditor from './editor';

const mockTextFromSubjectTask = {
  help: '',
  instruction: 'Correct the text',
  type: 'textFromSubject'
};

describe('TextFromSubjectEditor', function () {
  let mockWorkflow;
  let wrapper;
  let workflowUpdateSpy;

  beforeEach(function () {
    workflowUpdateSpy = sinon.spy();
    mockWorkflow = mockPanoptesResource('workflows', {});
    mockWorkflow.update = workflowUpdateSpy;
    wrapper = shallow(
      <TextFromSubjectEditor
        task={mockTextFromSubjectTask}
        taskPrefix="T0"
        workflow={mockWorkflow}
      />
    );
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should update the instructions when changed', function () {
    const mainTextTextarea = wrapper.find('textarea');
    mainTextTextarea.simulate('change', { target: { name: 'tasks.T0.instruction', value: 'Correct the OCR' }});
    expect(workflowUpdateSpy).to.have.been.calledWith({ 'tasks.T0.instruction': 'Correct the OCR' });
  });

  it('should update the help when changed', function () {
    const helpInput = wrapper.find('MarkdownEditor');
    helpInput.simulate('change', { target: { name: 'tasks.T0.help', value: 'new help text' }});
    expect(workflowUpdateSpy).to.have.been.calledWith({ 'tasks.T0.help': 'new help text' });
  });

  it('should render the NextTaskSelector component', function () {
    expect(wrapper.find('NextTaskSelector')).to.have.lengthOf(1);
  });
});
