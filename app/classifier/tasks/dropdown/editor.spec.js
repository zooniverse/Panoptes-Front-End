/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */

import { mount, shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import DropdownEditor from './editor';
import DropdownDialog from './dropdown-dialog';
import DropdownList from './dropdown-list';
import { workflow } from '../../../pages/dev-classifier/mock-data';

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  sinon.stub(resource, 'update');
  return resource;
}

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

// multiSelects:
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

  it('should display the DropdownDialog component with proper select when state of editing set to select index', function () {
    wrapper.setState({ editing: 0 });
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
  let multiSelects;
  let taskProp;
  let wrapper;

  beforeEach(function () {
    mockWorkflow = mockPanoptesResource('workflows', {});
    multiSelects = Object.assign({}, workflow.tasks.dropdown);
    wrapper = mount(<DropdownEditor task={multiSelects} workflow={mockWorkflow} />);
    taskProp = wrapper.prop('task');
  });

  it('should save with new data appropriately', function () {
    // initially should have IL state, Cook county, Chicago city and Bulls team

    assert.equal(taskProp.selects[1].options['USA-value'][1].value, 'IL');
    assert.equal(taskProp.selects[2].options['USA-value;IL'][0].value, 'Cook-value');
    assert.equal(taskProp.selects[3].options['USA-value;IL;Cook-value'][0].value, 'Chicago-value');
    assert.equal(taskProp.selects[4].options['USA-value;IL'][1].value, 'Bulls-value');

    const editStateSelect = multiSelects.selects[1];
    editStateSelect.options['USA-value'].splice(1, 1);
    editStateSelect.options['Canada-value'].push({ value: 'MB', label: 'Manitoba' });
    const newData = {
      deletedValues: ['IL'],
      editSelect: editStateSelect
    };

    wrapper.instance().handleSave(newData);
    taskProp = wrapper.prop('task');

    // deleting the IL option from country-USA should delete noted options
    assert.notEqual(taskProp.selects[1].options['USA-value'][1].value, 'IL');
    assert.equal(taskProp.selects[2].options['USA-value;IL'], undefined);
    assert.equal(taskProp.selects[3].options['USA-value;IL;Cook-value'], undefined);
    assert.equal(taskProp.selects[4].options['USA-value;IL'], undefined);
  });

  it('should delete the associated select and all selects dependent on the associated select after confirmation when the delete icon is clicked', function () {
    // initially multiSelects has 5 selects
    assert.equal(taskProp.selects.length, 5);

    wrapper.instance().deleteDropdown(1);
    taskProp = wrapper.prop('task');

    // deleting the State select should delete it, City, County and Team, leaving 1 select (Country)
    assert.equal(taskProp.selects.length, 1);
  });

  it('should create a new select dependent on last select (default) when createDropdown called', function () {
    const editDropdownStub = sinon.stub(wrapper.instance(), 'editDropdown');

    assert.equal(taskProp.selects.length, 5);

    wrapper.instance().createDropdown();

    assert.equal(taskProp.selects.length, 6);
    assert.equal(taskProp.selects[5].condition, 'teamID');

    editDropdownStub.restore();
  });
});
