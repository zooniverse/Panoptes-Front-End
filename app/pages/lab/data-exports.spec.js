import React from 'react';
import assert from 'assert';
import { shallow, render } from 'enzyme';

import DataExports from './data-exports';
import WorkflowClassificationExportButton from "./workflow-classification-export-button";
import DataExportButton from  "../../partials/data-export-button";
import TalkDataExportButton from  "../../talk/data-export-button";

const testProject = {}

describe('DataExports', function () {
  let wrapper;
  let dataExportButtons;
  let talkDataExportButtons;

  before(function () {
    wrapper = shallow(<DataExports project={testProject} />);
    dataExportButtons = wrapper.find(DataExportButton)
    talkDataExportButtons = wrapper.find(TalkDataExportButton)
  })

  it('should render without crashing', function () {});

  it('should show a classifications export button', function () {
    const buttonToTest = findByExportType(dataExportButtons, 'classifications_export');
    assert.equal(buttonToTest.length, 1);
    assert.equal(buttonToTest.prop('project'), testProject);
  });

  it('should show a classifications export button', function () {
    const buttonToTest = wrapper.find(WorkflowClassificationExportButton)
    assert.equal(buttonToTest.length, 1);
    assert.equal(buttonToTest.prop('project'), testProject);
  });

  it('should show a subjects export button', function () {
    const buttonToTest = findByExportType(dataExportButtons, 'subjects_export');
    assert.equal(buttonToTest.length, 1);
    assert.equal(buttonToTest.prop('project'), testProject);

  });

  it('should show a workflows export button', function () {
    const buttonToTest = findByExportType(dataExportButtons, 'workflows_export');
    assert.equal(buttonToTest.length, 1);
    assert.equal(buttonToTest.prop('project'), testProject);

  });

  it('should show a workflow contents export button', function () {
    const buttonToTest = findByExportType(dataExportButtons, 'workflow_contents_export');
    assert.equal(buttonToTest.length, 1);
    assert.equal(buttonToTest.prop('project'), testProject);

  });

  it('should show a Talk comments export button', function () {
    const buttonToTest = findByExportType(talkDataExportButtons, 'comments'); assert.equal(buttonToTest.length, 1);
    assert.equal(buttonToTest.prop('project'), testProject);
  });

  it('should show a Talk tags export button', function () {
    const buttonToTest = findByExportType(talkDataExportButtons, 'tags');
    assert.equal(buttonToTest.length, 1);
    assert.equal(buttonToTest.prop('project'), testProject);
  });
});

function findByExportType (selector, exportType) {
  return selector.findWhere(function(button) {
    return button.prop('exportType') === exportType;
  });
}
