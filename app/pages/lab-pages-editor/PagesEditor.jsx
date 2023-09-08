// ESLint: don't import global React, and don't use .defaultProps.
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import { StrictMode } from 'react';
import PropTypes from 'prop-types';
import DataManager from './DataManager.jsx';
import Tester from './Tester.jsx';
import { useWorkflowContext } from './context.js';

function PagesEditor(props) {
  const { params } = props;

  return (
    <StrictMode>
      <div className="lab-pages-editor">
        <DataManager
          key={params?.workflowId || '-'} //
          workflowId={params?.workflowId}
        >
          <WorkflowHeader />
          <h6>
            Workflow
            {' '}
            {params?.workflowId}
          </h6>
          <Tester />
        </DataManager>
      </div>
    </StrictMode>
  );
}

function WorkflowHeader() {
  const { workflow } = useWorkflowContext();

  if (!workflow) return null;

  return (
    <header>
      <h1>{workflow.display_name}</h1>
    </header>
  );
}

PagesEditor.propTypes = {
  params: PropTypes.shape({
    workflowId: PropTypes.string
  })
};

export default PagesEditor;
