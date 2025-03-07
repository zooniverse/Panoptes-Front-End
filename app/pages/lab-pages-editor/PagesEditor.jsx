/*
Pages Editor
Main component of the Pages Editor feature.
 */

// ESLint: don't import global React, and don't use .defaultProps.
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import { StrictMode, useState } from 'react';
import PropTypes from 'prop-types';

import DataManager from './DataManager.jsx';
import WorkflowHeaderTitle from './components/WorkflowHeaderTitle.jsx';
import WorkflowHeaderTabs from './components/WorkflowHeaderTabs.jsx';
import WorkflowTopLinks from './components/WorkflowTopLinks.jsx';
import TasksPage from './components/TasksPage';
import WorkflowSettingsPage from './components/WorkflowSettingsPage';
import strings from './strings.json';

function getDefaultTab() {  // Use ?tab=1 or tab='settings' to link directly to Workflow Settings
  const params = new URLSearchParams(window?.location?.search);
  const tab = params.get('tab');

  if ([1, '1', 'settings', 'workflowsettings'].includes(tab)) return 1;
  return 0;
}

function PagesEditor({ params }) {
  const { workflowID: workflowId, projectID: projectId } = params;
  const [currentTab, setCurrentTab] = useState(getDefaultTab());  // Default tab is 0
  const tabs = [
    {
      id: 'pages-editor_workflow-header-tab-button_task',
      label: strings.PagesEditor.components.WorkflowHeaderTabs.tasks,
      targetPanel: 'pages-editor_tab-panel_task'
    }, {
      id: 'pages-editor_workflow-header-tab-button_settings',
      label: strings.PagesEditor.components.WorkflowHeaderTabs.workflow_settings,
      targetPanel: 'pages-editor_tab-panel_settings'
    }
  ];

  return (
    <StrictMode>
      <div className="lab-pages-editor">
        <DataManager
          key={workflowId || '-'} //
          projectId={projectId}
          workflowId={workflowId}
        >
          <WorkflowTopLinks />
          <div className="workflow-main-content">
            <WorkflowHeaderTitle />
            <WorkflowHeaderTabs
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabs={tabs}
            />
            {(currentTab === 0) && (
              <div
                aria-labelledby={tabs[0].id}
                id={tabs[0].targetPanel}
                role="tabpanel"
              >
                <TasksPage />
              </div>
            )}
            {(currentTab === 1) && (
              <div
                aria-labelledby={tabs[1].id}
                id={tabs[1].targetPanel}
                role="tabpanel"
              >
                <WorkflowSettingsPage />
              </div>
            )}
          </div>
        </DataManager>
      </div>
    </StrictMode>
  );
}

PagesEditor.propTypes = {
  params: PropTypes.shape({
    projectID: PropTypes.string,
    workflowID: PropTypes.string
  })
};

export default PagesEditor;
