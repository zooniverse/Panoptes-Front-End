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
import WorkflowHeader from './components/WorkflowHeader.jsx';
import TasksPage from './components/TasksPage.jsx';
import WorkflowSettingsPage from './components/WorkflowSettingsPage.jsx';
import strings from './strings.json';

function PagesEditor({ params }) {
  const { workflowID: workflowId, projectID: projectId } = params;
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = [
    {
      id: 'pages-editor_workflow-header-tab-button_task',
      label: strings.PagesEditor.components.WorkflowHeader.tasks,
      targetPanel: 'pages-editor_tab-panel_task'
    }, {
      id: 'pages-editor_workflow-header-tab-button_settings',
      label: strings.PagesEditor.components.WorkflowHeader.workflow_settings,
      targetPanel: 'pages-editor_tab-panel_settings'
    }
  ];

  return (
    <StrictMode>
      <div className="lab-pages-editor">
        <DataManager
          key={workflowId || '-'} //
          workflowId={workflowId}
        >
          <WorkflowHeader
            currentTab={currentTab}
            projectId={projectId}
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
