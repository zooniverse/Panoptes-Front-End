/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import DropdownEditor from './editor';
import DropdownDialog from './dropdown-dialog';
import DropdownList from './dropdown-list';
import { workflow } from '../../../pages/dev-classifier/mock-data';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

const defaultDropdownTask = {
  type: 'dropdown',
  instruction: 'Select or type an option',
  help: '',
  selects: [
    {
      id: Math.random().toString(16).split('.')[1],
      title: 'Main Dropdown',
      required: true,
      allowCreate: false,
      options: {
        '*': []
      }
    }
  ]
};

// multiSelectsTask:
//   1 - Country (required:true)
//   2 - State (condition:Country, required:true, allowCreate:false)
//   3 - County (condition:State, allowCreate:true)
//   4 - City (condition:County, allowCreate:false)
//   5 - Best State Team (condition:State, allowCreate:true)

describe('DropdownEditor', function () {
  let mockWorkflow;
  let wrapper;

  beforeEach(function () {
    mockWorkflow = mockPanoptesResource('workflows', {});
    wrapper = shallow(<DropdownEditor task={defaultDropdownTask} workflow={mockWorkflow} />);
  });

  it('should render without crashing', function () {
    // beforeEach shallow render of DropdownEditor
  });

  it('should update the main text when changed', function () {
    const mainTextTextarea = wrapper.find('textarea');
    mainTextTextarea.simulate('change', { target: { name: 'tasks.T0.instruction', value: 'new main text' }});
    sinon.assert.calledWith(mockWorkflow.update, { 'tasks.T0.instruction': 'new main text' });
  });

  it('should update the help content when changed', function () {
    const helpInput = wrapper.find('MarkdownEditor');
    helpInput.simulate('change', { target: { name: 'tasks.T0.help', value: 'new help text' }});
    sinon.assert.calledWith(mockWorkflow.update, { 'tasks.T0.help': 'new help text' });
  });

  it('should render the DropdownList component', function () {
    assert.equal(wrapper.find(DropdownList).length, 1);
  });

  it('should display the DropdownDialog component with proper select when state of editSelect is set', function () {
    wrapper.setState({ editSelect: defaultDropdownTask.selects[0] });
    const dropdownDialog = wrapper.find(DropdownDialog);
    assert.equal(dropdownDialog.length, 1);
    assert.equal(dropdownDialog.prop('initialSelect'), defaultDropdownTask.selects[0]);
  });

  it('should render the NextTaskSelector component', function () {
    assert.equal(wrapper.find('NextTaskSelector').length, 1);
  });
});

describe('DropdownEditor: methods', function () {
  let mockWorkflow;
  let multiSelectsTask;
  let wrapper;
  let updateSelectsStub;

  beforeEach(function () {
    mockWorkflow = mockPanoptesResource('workflows', {});
    multiSelectsTask = JSON.parse(JSON.stringify(workflow.tasks.dropdown));
    wrapper = shallow(<DropdownEditor task={multiSelectsTask} workflow={mockWorkflow} />);
    updateSelectsStub = sinon.stub(wrapper.instance(), 'updateSelects').callsFake(() => null);
  });

  afterEach(function () {
    updateSelectsStub.resetHistory();
    updateSelectsStub.restore();
  });

  it('should save with new data', function () {
    const editSelect = multiSelectsTask.selects[1];

    // delete USA state option.value 'IL', add Canada state option.value 'MB'
    editSelect.options['USA-value'].splice(1, 1);
    editSelect.options['Canada-value'].push({ value: 'MB', label: 'Manitoba' });
    const newData = {
      deletedValues: ['IL'],
      editSelect
    };

    wrapper.instance().handleSave(newData);

    // deleting the IL option from country-USA should delete noted options

    assert.equal(editSelect, multiSelectsTask.selects[1]);
    sinon.assert.calledOnce(updateSelectsStub);
    sinon.assert.calledWith(updateSelectsStub, multiSelectsTask.selects);
  });

  it('should delete the select and all dependent selects', function () {
    // initially multiSelectsTask has 5 selects
    assert.equal(multiSelectsTask.selects.length, 5);

    wrapper.instance().deleteDropdown(1);
    multiSelectsTask.selects.splice(1, 4);

    // deleting the State select should delete it, City, County and Team, leaving 1 select (Country)

    assert.equal(multiSelectsTask.selects.length, 1);
    sinon.assert.calledOnce(updateSelectsStub);
    sinon.assert.calledWith(updateSelectsStub, multiSelectsTask.selects);
  });

  it('should create a new select', function () {
    const createDropdownSpy = sinon.spy(wrapper.instance(), 'createDropdown');
    // fake a condition ref
    wrapper.instance().condition = { value: 4 };
    wrapper.instance().createDropdown();

    sinon.assert.calledOnce(createDropdownSpy);
    const newSelect = createDropdownSpy.returnValues[0];
    assert.equal(newSelect.condition, 'teamID');
    assert.equal(newSelect.required, false);
    assert.equal(newSelect.allowCreate, true);
  });
});
