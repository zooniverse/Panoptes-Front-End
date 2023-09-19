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
import Tester from './Tester.jsx';
import WorkflowHeader from './components/WorkflowHeader.jsx';
import WorkflowSettingsPage from './components/WorkflowSettingsPage.jsx';

function PagesEditor({ params }) {
  const { workflowID: workflowId, projectID: projectId } = params;
  const [currentTab, setCurrentTab] = useState(0);

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
          />
          {(currentTab === 0) && <p>tasks</p>}
          {(currentTab === 1) && <WorkflowSettingsPage />}
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
